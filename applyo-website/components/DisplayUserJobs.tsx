"use client"
import { useState, useEffect } from "react";
import { 
    EyeIcon, 
    TrashIcon, 
    MapPinIcon, 
    BuildingOfficeIcon, 
    ArrowTopRightOnSquareIcon 
} from "@heroicons/react/24/outline";
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
            const res = await fetch("/api/jobs/get", { method: "GET" });

            if (!res.ok) {
                const err = await res.json().catch(() => ({}));
                throw new Error(err?.message ?? `HTTP ${res.status}`);
            }

            const response = await res.json();
            setUserJobData(response.data);
        } catch (err: any) {
            console.error("Failed to fetch the jobs", err);
        }
    };

    const deleteUserJobData = async (job: Job) => {
        if (!confirm("Are you sure you want to delete this job?")) return;

        try {
            const res = await fetch("/api/jobs/delete", {
                method: "DELETE",
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(job)
            });

            if (!res.ok) {
                const err = await res.json().catch(() => ({}));
                throw new Error(err?.message ?? `HTTP ${res.status}`);
            }

            getUserJobData();
        } catch (err: any) {
            console.error("Failed to delete the job", err);
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
        // CHANGED: Added max-width, mx-auto, and padding to "squish" it in the middle
        <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            
            {/* Optional Title Section */}
            <div className="mb-6 flex items-center justify-between">
                <h2 className="text-2xl font-bold text-slate-800">Your Applications</h2>
                <span className="text-sm text-slate-500">{userJobData.length} saved</span>
            </div>

            {/* Card Container */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm text-slate-600">
                        {/* Table Header */}
                        <thead className="bg-slate-50 border-b border-slate-200">
                            <tr>
                                <th scope="col" className="px-6 py-4 font-semibold text-slate-700">Company / Role</th>
                                <th scope="col" className="px-6 py-4 font-semibold text-slate-700">Location</th>
                                <th scope="col" className="px-6 py-4 font-semibold text-slate-700 text-center">Link</th>
                                <th scope="col" className="px-6 py-4 font-semibold text-slate-700 text-right">Actions</th>
                            </tr>
                        </thead>

                        {/* Table Body */}
                        <tbody className="divide-y divide-slate-100">
                            {userJobData.length === 0 ? (
                                <tr>
                                    <td colSpan={4} className="px-6 py-12 text-center">
                                        <div className="flex flex-col items-center justify-center text-slate-400">
                                            <BuildingOfficeIcon className="w-12 h-12 mb-3 opacity-20" />
                                            <p className="text-base font-medium">No jobs saved yet.</p>
                                            <p className="text-sm">Start adding applications to populate this list.</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                userJobData.map((job, index) => (
                                    <tr 
                                        key={index} 
                                        className="hover:bg-blue-50/50 transition-colors duration-200 group"
                                    >
                                        {/* Column 1: Company & Title */}
                                        <td className="px-6 py-4 align-middle">
                                            <div className="flex flex-col">
                                                <span className="text-base font-bold text-slate-900">
                                                    {job.company}
                                                </span>
                                                <span className="text-blue-600 font-medium text-sm mt-0.5">
                                                    {job.job_title}
                                                </span>
                                            </div>
                                        </td>

                                        {/* Column 2: Location */}
                                        <td className="px-6 py-4 align-middle">
                                            <div className="flex items-center text-slate-500">
                                                <MapPinIcon className="w-4 h-4 mr-1.5 text-slate-400" />
                                                <span>{job.location || "Remote / Unspecified"}</span>
                                            </div>
                                        </td>

                                        {/* Column 3: External Link */}
                                        <td className="px-6 py-4 align-middle text-center">
                                            {job.listing_url ? (
                                                <a 
                                                    href={job.listing_url} 
                                                    target="_blank" 
                                                    rel="noopener noreferrer"
                                                    className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-blue-50 text-blue-600 hover:bg-blue-100 hover:scale-105 transition-all"
                                                    title="Visit Job Listing"
                                                >
                                                    <ArrowTopRightOnSquareIcon className="w-4 h-4" />
                                                </a>
                                            ) : (
                                                <span className="text-slate-300">—</span>
                                            )}
                                        </td>

                                        {/* Column 4: Actions (View & Delete) */}
                                        <td className="px-6 py-4 align-middle text-right">
                                            <div className="flex items-center justify-end gap-3">
                                                {/* View Button */}
                                                <button
                                                    onClick={() => openDescription(job)}
                                                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-blue-700 bg-blue-50 rounded-md border border-blue-100 hover:bg-blue-100 hover:border-blue-200 transition-all"
                                                >
                                                    <EyeIcon className="w-4 h-4" />
                                                    View
                                                </button>

                                                {/* Delete Button */}
                                                <button
                                                    onClick={() => deleteUserJobData(job)}
                                                    className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-all"
                                                    title="Delete Job"
                                                >
                                                    <TrashIcon className="w-5 h-5" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal */}
            <Modal isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen} title="Job Description">
                <div className="mt-2">
                    {selectedJob ? (
                        <div>
                            <div className="mb-4 pb-4 border-b border-slate-100">
                                <h3 className="text-lg font-bold text-slate-900">{selectedJob.job_title}</h3>
                                <p className="text-slate-500 text-sm">{selectedJob.company}</p>
                            </div>
                            {selectedJob.description ? (
                                <div className="whitespace-pre-wrap text-slate-600 text-sm leading-relaxed">
                                    {selectedJob.description}
                                </div>
                            ) : (
                                <div className="text-sm text-slate-400 italic">No description available.</div>
                            )}
                        </div>
                    ) : null}
                </div>
            </Modal>
        </div>
    );
}