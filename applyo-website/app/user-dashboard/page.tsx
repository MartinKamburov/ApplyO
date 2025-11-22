"use server"

import { auth } from "@/auth";
import JobForm from "@/components/JobForm";
import SignOutButton from "@/components/signOut-button";
import DisplayUserJobs from "@/components/DisplayUserJobs";

export default async function UserDashboard() {
  const session = await auth();

  // If the user isn't signed in return blank
  if (!session?.user) return [];

  console.log(session);

  return (
    <div>
        {" "}
        <h1>Hello you are signed in!</h1>
        <p> User signed in with name: {session.user.name} </p>
        <p> User signed in with name: {session.user.email} </p>


        <JobForm />
        <br/>

        <DisplayUserJobs />

        <br/>

        <SignOutButton />
    </div>
  )
}
