export interface AuthLayoutProps
{
    name?: string;
    title?: string;
    description?: string;
    variant?: "hero" | "split";
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
    signed?: string;
};
