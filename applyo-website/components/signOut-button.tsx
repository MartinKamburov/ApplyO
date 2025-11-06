"use client"

import { logout } from "@/lib/actions/auth";

const SignOutButton = () => {
  return (
      <button onClick={() => logout()}>Click to sign out</button>
    )
}

export default SignOutButton;