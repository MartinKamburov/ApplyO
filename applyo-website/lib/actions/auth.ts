"use server";

import { signIn, signOut } from "@/auth";

// Accepts the provider name ('github' or 'google')
export const login = async (provider: "github" | "google", callbackUrl?: string | null) => {
    await signIn(provider, { redirectTo: callbackUrl || "/dashboard", });
}

export const logout = async () => {
    await signOut({ redirectTo: "/" });
}