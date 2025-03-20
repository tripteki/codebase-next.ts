import type { NextApiRequest, NextApiResponse, } from "next";
import manifest from "@/app/manifest";

const handler = (req: NextApiRequest, res: NextApiResponse): void =>
{
    res.status (200).json (manifest ());
};

export default handler;
