"use client"

import { login } from "@/lib/actions/auth";

const SignInButton = () => {
  return (
    <button onClick={() => login()}>Click to sign in with Github</button>
  )
}

export default SignInButton