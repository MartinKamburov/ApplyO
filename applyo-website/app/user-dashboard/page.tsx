"use server"

import { auth } from "@/auth";
import DashboardContent from "@/components/DashboardContent";

export default async function UserDashboard() {
  const session = await auth();

  // If the user isn't signed in return blank
  if (!session?.user) return [];

  return (
    <DashboardContent />
  )
}
