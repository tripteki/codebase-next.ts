import { definePageAuth, } from "@/libs/page-auth";

export const pageAuth = definePageAuth ("/admin/search", { mode: "auth", });
