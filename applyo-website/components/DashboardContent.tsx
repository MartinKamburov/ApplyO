"use client"
import { useState } from "react";
import JobForm from "@/components/JobForm";
import DisplayUserJobs from "@/components/DisplayUserJobs";
import DashboardHeader from "@/components/DashboardHeader";

export default function DashboardContent() {
    // State lives here because this is a Client Component
    const [refreshCount, setRefreshCount] = useState(0);

    const triggerRefresh = () => {
        setRefreshCount((prev) => prev + 1);
    };

    return (
        <>
            <DashboardHeader />
            <div className="max-w-7xl mx-auto px-4 py-8">
                <br />
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                    
                    {/* LEFT COLUMN: The Form */}
                    <div className="lg:col-span-1">
                        {/* Pass the function down */}
                        <JobForm onJobAdded={triggerRefresh} />
                    </div>

                    {/* RIGHT COLUMN: The Table */}
                    <div className="lg:col-span-2">
                        {/* Pass the state value down */}
                        <DisplayUserJobs refreshTrigger={refreshCount} />
                    </div>
                </div>
            </div>
        </>
    );
}