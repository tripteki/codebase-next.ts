import { definePageAuth, } from "@/libs/page-auth";

export const pageAuth = definePageAuth ("/auth/login", { mode: "guest", });
