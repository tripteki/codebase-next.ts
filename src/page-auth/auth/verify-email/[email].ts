import { definePageAuth, } from "@/libs/page-auth";

export const pageAuth = definePageAuth ("/auth/verify-email/[email]", { mode: "public", });
