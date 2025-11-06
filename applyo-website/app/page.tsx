"use server"

import { auth } from "@/auth";
import SignInButton from "@/components/login-button";
import SignOutButton from "@/components/signOut-button";


export default async function Home() {
  const session = await auth();
  console.log(session);

  if (session?.user) {
    return (
      <div>
        {" "}
        <h1>Hello you are signed in!</h1>
        <p> User signed in with name: {session.user.name} </p>
        <p> User signed in with name: {session.user.email} </p>
        <SignOutButton />
      </div>
    )
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <p> You are not signed in! </p>
      <SignInButton />
    </div>
  );
}
