import NextAuth from "next-auth";
import "next-auth/jwt";
import GitHub from "next-auth/providers/github";

export const { handlers, auth, signIn, signOut } = NextAuth({
    providers: [
        GitHub
    ],

})
