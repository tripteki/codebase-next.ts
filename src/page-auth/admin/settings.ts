import { definePageAuth, } from "@/libs/page-auth";

export const pageAuth = definePageAuth ("/admin/settings", { mode: "auth", });
