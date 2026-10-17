import { definePageAuth, } from "@/libs/page-auth";

export const pageAuth = definePageAuth ("/admin/users/[id]", { mode: "auth", });
