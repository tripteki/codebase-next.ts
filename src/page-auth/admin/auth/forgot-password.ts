import { definePageAuth, } from "@/libs/page-auth";

export const pageAuth = definePageAuth ("/admin/auth/forgot-password", { mode: "guest", });
