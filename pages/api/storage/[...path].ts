import { NextApiRequest, NextApiResponse, } from "next";

import { publicRuntimeConfig, } from "@/libs/runtime-config";

const handler = async (
    req: NextApiRequest,
    res: NextApiResponse
): Promise<void> =>
{
    if (req.method !== "GET" && req.method !== "HEAD")
    {
        res.setHeader ("Allow", "GET, HEAD");
        res.status (405).end ();

        return;
    }

    const parts = req.query.path;
    const segments = Array.isArray (parts) ? parts : typeof parts === "string" ? [ parts, ] : [];
    const relative = segments.map ((segment) => encodeURIComponent (segment)).join ("/");
    const apiUrl = publicRuntimeConfig.apiUrl.replace (/\/$/, "");
    const upstream = await fetch (`${apiUrl}/storage/${relative}`);
    const filename = relative.startsWith ("export/")
        ? decodeURIComponent (segments[segments.length - 1] ?? "")
        : "";
    const contentType = upstream.headers.get ("content-type");

    res.status (upstream.status);

    if (contentType)
    {
        res.setHeader ("Content-Type", contentType);
    }

    if (filename && upstream.ok)
    {
        res.setHeader (
            "Content-Disposition",
            `attachment; filename="${filename.replace (/"/g, "")}"`
        );
    }

    const body = Buffer.from (await upstream.arrayBuffer ());

    res.send (body);
};

export default handler;
