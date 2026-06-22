import { NextApiRequest, NextApiResponse, } from "next";
import { getServerSession, } from "next-auth/next";

import { publicRuntimeConfig, } from "@/libs/runtime-config";
import { callServer, } from "@/libs/call-server";
import { authOptions, } from "./[...nextauth]";

const handler = async (
    req: NextApiRequest,
    res: NextApiResponse
): Promise<void> => {
    if (req.method !== "GET") {
        res.status (405).json ({ error: "Method not allowed", });

        return;
    }

    const session = await getServerSession (req, res, authOptions);
    const accessToken = (session as any)?.accessToken as string | undefined;

    if (! accessToken) {
        res.status (401).json ({ error: "Unauthorized", });

        return;
    }

    const response = await callServer ({
        baseUrl: publicRuntimeConfig.authURL,
        url: "/me",
        method: "GET",
    }, accessToken);

    if (response.isError) {
        res.status (401).json ({ error: "Unauthorized", });

        return;
    }

    res.status (200).json ({ user: response.data, });
};

export default handler;
