"use client"
import { useState, useEffect } from "react";
import Modal from "./Modal";

type Job = {
    email?: string;
    company: string;
    job_title: string;
    location?: string | null;
    listing_url?: string | null;
    description?: string | null;
    created_at?: string | null;
}

export default function DisplayUserJobs() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedJob, setSelectedJob] = useState<Job | null>(null);
    const [userJobData, setUserJobData] = useState<Job[]>([]);

    const getUserJobData = async () => {
        try {
            const res = await fetch("/api/jobs/get", {
                method: "GET"
            });

            if (!res.ok){
                const err = await res.json().catch(() => ({}));
                throw new Error(err?.message ?? `HTTP ${res.status}`);
            }

            const response = await res.json();

            setUserJobData(response.data);
        } catch (err: any) {
            console.error("Failed to fetch the jobs", err);
        } 
    };

    useEffect(() => {
        getUserJobData();
    }, []);

    const openDescription = (job: Job) => {
        setSelectedJob(job);
        setIsModalOpen(true);
    };

    return (
        <div className="relative overflow-x-auto bg-neutral-primary-soft shadow-xs rounded-base border border-default p-2">
            <table className="w-full text-sm text-left rtl:text-right text-body">
                <thead className="text-sm text-body bg-neutral-secondary-medium border-b border-default-medium">
                <tr>
                    <th scope="col" className="px-6 py-3 font-medium">
                    Company
                    </th>
                    <th scope="col" className="px-6 py-3 font-medium">
                    Location
                    </th>
                    <th scope="col" className="px-6 py-3 font-medium">
                    Job Title
                    </th>
                    <th scope="col" className="px-6 py-3 font-medium">
                    Link
                    </th>
                    <th scope="col" className="px-6 py-3 font-medium">
                    Description
                    </th>
                    <th scope="col" className="px-6 py-3 font-medium">
                    Change Info
                    </th>
                </tr>
                </thead>

                <tbody>
                    {userJobData.length === 0 ? (
                        <tr>
                        <td colSpan={5} className="px-6 py-4 text-center text-body">
                            No jobs found
                        </td>
                        </tr>
                    ) : (
                        userJobData.map((job) => (
                            <tr key={job.email} className="bg-neutral-primary-soft border-b border-default">
                                <th scope="row" className="px-6 py-4 font-medium text-heading whitespace-nowrap">
                                {job.company}
                                </th>

                                <td className="px-6 py-4">{job.job_title}</td>
                                <td className="px-6 py-4">{job.location ?? "—"}</td>
                                <td className="px-6 py-4">{job.listing_url ? <a href={job.listing_url} className="text-fg-brand hover:underline">Link</a> : "—"}</td>
                                {/* <td className="px-6 py-4">{job.description}</td> */}
                                <td className="px-6 py-4">
                                    <button
                                        onClick={() => openDescription(job)}
                                        className="bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded"
                                    >
                                        Open to view
                                    </button>
                                </td>

                                <td className="px-6 py-4">
                                    <button className="bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded">
                                        Edit
                                    </button>
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>

            {/* single modal instance */}
            <Modal isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen} title="Description">
                <div>
                    {selectedJob?.description ? (
                        // preserve formatting if long
                        <div className="whitespace-pre-wrap">{selectedJob.description}</div>
                    ) : (
                        <div className="text-sm text-muted">No description available.</div>
                    )}
                </div>
            </Modal>
        </div>

    );
}