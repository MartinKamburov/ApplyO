"use server"

import { auth } from "@/auth";
import SignInButton from "@/components/login-button";
import { redirect } from 'next/navigation';

export default async function Home() {
  const session = await auth();

  if (session){
    redirect('/user-dashboard')
  }

  return (
    <div className="grid grid-flow-col grid-rows-3 gap-4">
      <div className="row-span-3">
        <p> You are not signed in! </p>
        <br/>
        <SignInButton />
      </div>
    </div>
  );
}
