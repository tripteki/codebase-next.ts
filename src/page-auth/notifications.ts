import { definePageAuth, } from "@/libs/page-auth";

export const pageAuth = definePageAuth ("/notifications", { mode: "auth", });
