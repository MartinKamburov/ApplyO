"use server"

import { auth } from "@/auth";
import JobForm from "@/components/JobForm";
import DisplayUserJobs from "@/components/DisplayUserJobs";
import DashboardHeader from "@/components/DashboardHeader";

export default async function UserDashboard() {
  const session = await auth();

  // If the user isn't signed in return blank
  if (!session?.user) return [];

  console.log(session);

  return (
    <div>
        <DashboardHeader />
        <br/>
        <DisplayUserJobs />

        <br/>
        <JobForm />
        <br/>
    </div>
  )
}
