import { definePageAuth, } from "@/libs/page-auth";

export const pageAuth = definePageAuth ("/admin/roles/create", { mode: "auth", });
