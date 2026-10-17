import { definePageAuth, } from "@/libs/page-auth";

export const pageAuth = definePageAuth ("/auth/forgot-password", { mode: "guest", });
