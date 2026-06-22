import { NextApiRequest, NextApiResponse, } from "next";

import manifest from "@/libs/manifest";

const handler = (
    _req: NextApiRequest,
    res: NextApiResponse
): void =>
{
    res.setHeader ("Content-Type", "application/manifest+json; charset=utf-8");
    res.setHeader ("Cache-Control", "public, max-age=300");
    res.status (200).json (manifest ());
};

export default handler;
