import type { AppProps, } from "next/app";
import { ReactElement, } from "react";
import { SessionProvider, } from "next-auth/react";
import { appWithTranslation, } from "next-i18next/pages";

import AppShell from "@/src/app-shell";
import nextI18NextConfig from "../next-i18next.config.js";
import "@/styles/globals.css";

const REFETCH_INTERVAL_SECONDS = 50 * 60;

const TranslatedShell = appWithTranslation (AppShell, nextI18NextConfig);

const App = (props: AppProps): ReactElement =>
(
    <SessionProvider
        session={props.pageProps.session}
        refetchOnWindowFocus={false}
        refetchInterval={REFETCH_INTERVAL_SECONDS}
    >
        <TranslatedShell {... props} />
    </SessionProvider>
);

export default App;
