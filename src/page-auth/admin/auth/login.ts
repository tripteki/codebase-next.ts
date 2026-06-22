import { definePageAuth, } from "@/libs/page-auth";

export const pageAuth = definePageAuth ("/admin/auth/login", { mode: "guest", });
