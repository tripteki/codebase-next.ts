import { definePageAuth, } from "@/libs/page-auth";

export const pageAuth = definePageAuth ("/admin/activities/[id]", { mode: "auth", });
