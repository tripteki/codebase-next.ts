export interface AuthLayoutProps
{
    name?: string;
    title?: string;
    description?: string;
};

export interface LoginProps
{
    status?: string;
    canResetPassword?: boolean;
    canRegister?: boolean;
};

export interface ForgotPasswordProps
{
    status?: string;
};

export interface ResetPasswordProps
{
    token: string;
    email: string;
};
