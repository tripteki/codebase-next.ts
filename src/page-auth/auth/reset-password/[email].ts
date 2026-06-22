import { definePageAuth, } from "@/libs/page-auth";

export const pageAuth = definePageAuth ("/auth/reset-password/[email]", { mode: "public", });
