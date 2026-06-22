import { definePageAuth, } from "@/libs/page-auth";

export const pageAuth = definePageAuth ("/admin/auth/register", { mode: "guest", });
