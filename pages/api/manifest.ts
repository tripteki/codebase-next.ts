"use strict";

import type { NextApiRequest, NextApiResponse, } from "next";
import manifest from "../../app/manifest";

const handler = (req: NextApiRequest, res: NextApiResponse): void =>
{
    const data = manifest ();

    res.status (200).json (data);
};

export default handler;
