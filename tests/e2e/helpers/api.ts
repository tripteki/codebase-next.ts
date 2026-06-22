import { e2eEnv, } from "./env";

const isE2eLoginSuccessful = async (response: Response): Promise<boolean> =>
{
    if (! response.ok)
    {
        return false;
    }

    const text = await response.text ();

    try
    {
        const body = JSON.parse (text) as { accessToken?: string; };

        return typeof body?.accessToken === "string";
    }
    catch
    {
        return false;
    }
};

const API_ROUTE_STATUSES = new Set ([ 404, 405, ]);

export async function isApiAvailable (): Promise<boolean>
{
    try
    {
        const [ loginResponse, docsResponse, ] = await Promise.all ([
            fetch (`${e2eEnv.apiUrl}/api/v1/auth/login`, {
                method: "GET",
                headers: {
                    Accept: "application/json",
                },
            }),
            fetch (`${e2eEnv.apiUrl}/api/docs`, {
                method: "GET",
                headers: {
                    Accept: "text/html",
                },
            }),
        ]);

        return API_ROUTE_STATUSES.has (loginResponse.status) || docsResponse.ok;
    }
    catch
    {
        return false;
    }
}

export async function ensureE2eUser (): Promise<void>
{
    for (let attempt = 0; attempt < 4; attempt++)
    {
        const loginResponse = await fetch (`${e2eEnv.apiUrl}/api/v1/auth/login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
            },
            body: JSON.stringify ({
                identifierKey: "email",
                identifierValue: e2eEnv.userEmail,
                password: e2eEnv.userPassword,
            }),
        });

        if (await isE2eLoginSuccessful (loginResponse))
        {
            return;
        }

        if (loginResponse.status === 429)
        {
            await new Promise ((resolve) => setTimeout (resolve, 21_000));
            continue;
        }

        break;
    }

    const registerResponse = await registerUser ({
        name: "e2e-superuser",
        email: e2eEnv.userEmail,
        password: e2eEnv.userPassword,
    });

    if (! registerResponse.ok && registerResponse.status !== 422)
    {
        const body = await registerResponse.text ().catch (() => "");

        throw new Error (`Failed to prepare e2e user (${registerResponse.status}): ${body}`);
    }
}

export async function registerUser (input: {
    name: string;
    email: string;
    password: string;
}): Promise<Response>
{
    return fetch (`${e2eEnv.apiUrl}/api/v1/auth/register`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
        },
        body: JSON.stringify ({
            name: input.name,
            email: input.email,
            password: input.password,
            password_confirmation: input.password,
        }),
    });
}

export async function requestPasswordResetLink (email: string): Promise<Response>
{
    const url = `${e2eEnv.apiUrl}/api/v1/auth/forgot-password`;
    const init: RequestInit = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
        },
        body: JSON.stringify ({ email, }),
    };

    for (let attempt = 0; attempt < 4; attempt++)
    {
        const response = await fetch (url, init);

        if (response.status !== 429)
        {
            return response;
        }

        await new Promise ((resolve) => setTimeout (resolve, 21_000));
    }

    return fetch (url, init);
}
