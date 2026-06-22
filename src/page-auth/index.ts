import { definePageAuth, } from "@/libs/page-auth";

export const pageAuth = definePageAuth ("/", { mode: "public", });
