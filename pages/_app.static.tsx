import { appWithTranslation, } from "next-i18next/pages";

import AppShell from "@/src/app-shell";
import nextI18NextConfig from "../next-i18next.config.js";
import "@/styles/globals.css";

export default appWithTranslation (AppShell, nextI18NextConfig);
