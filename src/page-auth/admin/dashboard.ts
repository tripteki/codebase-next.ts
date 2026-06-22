import { definePageAuth, } from "@/libs/page-auth";

export const pageAuth = definePageAuth ("/admin/dashboard", { mode: "auth", });
