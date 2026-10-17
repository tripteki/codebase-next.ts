import { definePageAuth, } from "@/libs/page-auth";

export const pageAuth = definePageAuth ("/admin/permissions/[id]/edit", { mode: "auth", });
