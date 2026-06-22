import { definePageAuth, } from "@/libs/page-auth";

export const pageAuth = definePageAuth ("/admin/auth/reset-password", { mode: "public", });
