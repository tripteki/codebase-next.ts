import Head from "next/head";
import Link from "next/link";
import { GetServerSideProps, } from "next";
import { useRouter, } from "next/router";
import { useTranslation, } from "next-i18next";
import { SignInResponse, signIn, useSession, } from "next-auth/react";
import { FC, FormEvent, useState, useEffect, } from "react";
import { serverSideTranslations, } from "next-i18next/serverSideTranslations";
import IconButton from "@mui/material/IconButton";
import PersonIcon from "@mui/icons-material/Person";
import InputComponent from "@/components/InputComponent";

const AuthLoginTemplate: FC = () =>
{
    const [ isLoading, setIsLoading, ] = useState<boolean>(false);
    const [ isLoaded, setIsLoaded, ] = useState<boolean>(false);
    const [ isError, setIsError, ] = useState<boolean>(false);
    const [ isSuccess, setIsSuccess, ] = useState<boolean>(false);
    const [ validationMessage, setValidationMessage, ] = useState<string>("");

    const [ formUserIdentity, setFormUserIdentity, ] = useState<string>("");
    const [ formUserPassword, setFormUserPassword, ] = useState<string>("");
    const [ formCheckboxRemember, setFormCheckboxRemember, ] = useState<boolean>(false);

    const router = useRouter ();
    const { t, } = useTranslation ("auth");
    const { data: session, status: sessionStatus, } = useSession ();

    const load = () =>
    {
        setIsLoading (true);
        setIsLoaded (false);
    };

    const reset = () =>
    {
        setIsLoading (false);
        setIsLoaded (true);
    };

    const handleExternalLinkClick = (url: string) =>
    {
        window.open (url, "_blank");
    };

    const login = async (e: FormEvent<HTMLFormElement>) =>
    {
        e.preventDefault ();

        load ();

        try {

            const data: SignInResponse | undefined = await signIn ("credentials",
            {
                email: formUserIdentity,
                password: formUserPassword,
                remember: formCheckboxRemember,

                redirect: false,
            });

            if (data?.error) throw new Error (data?.error);

            setIsSuccess (true);

            router.push ("/admin/dashboard");

        } catch (throwable: any) {

            if (throwable instanceof Error) {

                throwable = JSON.parse (throwable.toString ().replace (/^Error: /, ""));

                if (Object.keys (throwable).length) {

                    setIsError (true);
                    setValidationMessage (t ("failed"));

                } else {

                    setIsError (false);
                    setValidationMessage ("");
                }
            }

        } finally {

            reset ();
        };
    };

    useEffect (() => {

        if (sessionStatus === "authenticated") router.push ("/admin/dashboard");

    }, [ router, sessionStatus, ]);

    return (

        <>
            <Head>
                <title>Login</title>
            </Head>
            <div className="container mx-auto text-center">
                <div className="grid grid-cols-2">
                    <div className="p-3">
                        <span>{t ("dont_have_an_account_yet")}</span>
                        <span>
                            <Link href="/auth/registration">&nbsp;{t ("sign_up_here")}</Link>
                        </span>
                    </div>
                    <div className="p-3">
                        <button onClick={() => handleExternalLinkClick ("https://google.com")} type="button">
                            {t ("sign_in_with_google")}
                        </button>
                    </div>
                </div>
                <form onSubmit={login} className="grid grid-rows-none gap-8 p-3 border">
                    <div>
                        <InputComponent
                            modelValue={formUserIdentity}
                            type="email"
                            name="email"
                            label="E-Mail"
                            placeholder="user@email.com"
                            isLoaded={true}
                            onChange={setFormUserIdentity}
                        />
                    </div>
                    <div>
                        <InputComponent
                            modelValue={formUserPassword}
                            type="password"
                            name="password"
                            label="Password"
                            placeholder="********"
                            isLoaded={true}
                            onChange={setFormUserPassword}
                        />
                    </div>
                    <div>
                        <label htmlFor="remember">{t ("remember")}</label>
                        <input onChange={(e) => setFormCheckboxRemember (e.target.checked)} checked={formCheckboxRemember} type="checkbox" name="remember" id="remember" />
                    </div>
                    {isError && <p>{validationMessage}</p>}
                    <button type="submit" className="border">{t ("sign_in")}</button>
                    <IconButton color="primary">
                        <PersonIcon />
                    </IconButton>
                </form>
            </div>
        </>
    );
};

export const getServerSideProps: GetServerSideProps = async ({ locale, }) =>
{
    return {

        props: {

            ... (await serverSideTranslations (locale ?? "en", [

                "auth",
            ])),
        },
    };
};

export default AuthLoginTemplate;