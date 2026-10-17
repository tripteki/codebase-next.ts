import { definePageAuth, } from "@/libs/page-auth";

export const pageAuth = definePageAuth ("/admin/permissions", { mode: "auth", });
