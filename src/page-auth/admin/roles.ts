import { definePageAuth, } from "@/libs/page-auth";

export const pageAuth = definePageAuth ("/admin/roles", { mode: "auth", });
