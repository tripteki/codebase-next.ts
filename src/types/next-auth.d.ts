import { Session, User, } from "next-auth";
import { JWT, } from "next-auth/jwt";

declare module "next-auth"
{
    interface Session
    {
        jwt?: string;
        accessToken?: string;
        refreshToken?: string;
        user?: any;
        user: {
            id: string;
            name?: string | null;
            email?: string | null;
            image?: string | null;
        };
    };

    interface User
    {
        jwt?: string;
        accessToken?: string;
        refreshToken?: string;
        token?: string;
        user?: any;
        id: string;
    };
};

declare module "next-auth/jwt"
{
    interface JWT
    {
        jwt?: string;
        accessToken?: string;
        refreshToken?: string;
        user?: any;
        id?: string;
    };
};
