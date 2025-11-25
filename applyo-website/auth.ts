import NextAuth from "next-auth";
import "next-auth/jwt";
import GitHub from "next-auth/providers/github";
import { SupabaseAdapter } from "@auth/supabase-adapter";
import Google from "next-auth/providers/google";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
const SUPABASE_ANON_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY ?? "";


export const { auth, handlers, signIn, signOut } = NextAuth({
    providers: [
        GitHub, Google
    ],
    session: { strategy: "jwt" },
    adapter: SupabaseAdapter({
        url: SUPABASE_URL,
        secret: SUPABASE_ANON_KEY,
    }),
    pages: {
        signIn: "/signin", 
    },
    callbacks: {
        // 1. When the user logs in, the 'user' object (from Supabase) is passed here.
        // We save the user.id into the JWT token.
        async jwt({ token, user }) {
        if (user) {
            token.id = user.id; 
        }
        return token;
        },
        // 2. When the client/server checks the session, they get the token.
        // We copy the ID from the token into the session object.
        async session({ session, token }) {
        if (session.user && token.id) {
            session.user.id = token.id as string;
        }
        return session;
        },
    },
})
