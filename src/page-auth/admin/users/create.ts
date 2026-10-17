import { definePageAuth, } from "@/libs/page-auth";

export const pageAuth = definePageAuth ("/admin/users/create", { mode: "auth", });
