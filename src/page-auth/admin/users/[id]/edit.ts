import { definePageAuth, } from "@/libs/page-auth";

export const pageAuth = definePageAuth ("/admin/users/[id]/edit", { mode: "auth", });
