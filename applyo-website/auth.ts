import NextAuth from "next-auth";
import "next-auth/jwt";
import GitHub from "next-auth/providers/github";
import { SupabaseAdapter } from "@auth/supabase-adapter";

const SUPABASE_URL = process.env.SUPABASE_URL ?? "";
const SUPABASE_ANON_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY ?? "";
const GITHUB_ID = process.env.AUTH_GITHUB_ID;
const GITHUB_SECRET = process.env.AUTH_GITHUB_SECRET;


export const { auth, handlers, signIn, signOut } = NextAuth({
    providers: [
        GitHub,
    ],
    session: { strategy: "jwt" },
    adapter: SupabaseAdapter({
        url: SUPABASE_URL,
        secret: SUPABASE_ANON_KEY,
    }),
    secret: process.env.AUTH_SECRET

})
