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
    <>
      <DashboardHeader />
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Title */}
        <br />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          {/* RIGHT COLUMN (Table) - Order 2 on mobile, 2 on desktop (Wait, typically content is first) */}
          {/* Based on your image, Form is Left, Table is Right */}
          
          {/* LEFT COLUMN: The Form */}
          <div className="lg:col-span-1">
              <JobForm />
          </div>

          {/* RIGHT COLUMN: The Table */}
          <div className="lg:col-span-2">
              <DisplayUserJobs />
          </div>
        </div>
      </div>
    </>
  )
}
