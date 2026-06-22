export type ResetPasswordRequestInput = {
    email: string;
    token?: string;
    signed?: string;
    password: string;
    password_confirmation: string;
};

export type ResetPasswordRequestDetail = {
    url: string;
    params?: Record<string, string>;
    data: Record<string, string>;
};

export const buildResetPasswordRequest = ({
    email,
    token,
    signed,
    password,
    password_confirmation,
}: ResetPasswordRequestInput): ResetPasswordRequestDetail =>
{
    const signedToken = signed || token;

    if (signedToken)
    {
        return {
            url: `/reset-password/${encodeURIComponent (email)}`,
            params: { signed: signedToken, },
            data: {
                password,
                password_confirmation,
            },
        };
    }

    return {
        url: "/reset-password",
        data: {
            token: token || "",
            email,
            password,
            password_confirmation,
        },
    };
};
