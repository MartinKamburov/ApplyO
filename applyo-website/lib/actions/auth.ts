"use server";

import { signIn, signOut } from "@/auth";

// Accepts the provider name ('github' or 'google')
export const login = async (provider: "github" | "google") => {
    await signIn(provider, { redirectTo: "/user-dashboard" });
}

export const logout = async () => {
    await signOut({ redirectTo: "/" });
}