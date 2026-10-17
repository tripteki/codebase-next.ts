import { definePageAuth, } from "@/libs/page-auth";

export const pageAuth = definePageAuth ("/admin/roles/[id]/edit", { mode: "auth", });
