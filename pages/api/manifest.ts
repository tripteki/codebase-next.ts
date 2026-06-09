import { NextApiRequest, NextApiResponse, } from "next";

import manifest from "@/libs/manifest";

const handler = (
    _req: NextApiRequest,
    res: NextApiResponse
): void =>
{
    res.setHeader ("Content-Type", "application/manifest+json");
    res.status (200).json (manifest ());
};

export default handler;
