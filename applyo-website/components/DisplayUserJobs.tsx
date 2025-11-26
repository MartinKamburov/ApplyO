"use client"
import { useState, useEffect, useCallback } from "react";
import { 
    EyeIcon, 
    TrashIcon, 
    MapPinIcon, 
    BuildingOfficeIcon, 
    ArrowTopRightOnSquareIcon,
    MagnifyingGlassIcon,
    ChevronLeftIcon,
    ChevronRightIcon
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

interface DisplayUserJobsProps {
    refreshTrigger: number;
}

const ITEMS_PER_PAGE = 10;

export default function DisplayUserJobs({ refreshTrigger }: DisplayUserJobsProps) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedJob, setSelectedJob] = useState<Job | null>(null);
    const [userJobData, setUserJobData] = useState<Job[]>([]);
    
    // Pagination & Search State
    const [searchQuery, setSearchQuery] = useState("");
    const [currentPage, setCurrentPage] = useState(1);

    const getUserJobData = useCallback(async () => {
        try {
            const res = await fetch("/api/jobs/get", { method: "GET" });
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            const response = await res.json();
            setUserJobData(response.data);
        } catch (err: any) {
            console.error("Failed to fetch the jobs", err);
        }
    }, []);

    const deleteUserJobData = async (job: Job) => {
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
    }, [getUserJobData, refreshTrigger]);

    // Reset to page 1 when search query changes
    useEffect(() => {
        setCurrentPage(1);
    }, [searchQuery]);

    const openDescription = (job: Job) => {
        setSelectedJob(job);
        setIsModalOpen(true);
    };

    // 1. Filter Data
    const filteredJobs = userJobData.filter((job) => 
        job.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
        job.job_title.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // 2. Calculate Pagination Logic
    const totalPages = Math.ceil(filteredJobs.length / ITEMS_PER_PAGE);
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    const paginatedJobs = filteredJobs.slice(startIndex, endIndex);

    const handlePrevious = () => {
        if (currentPage > 1) setCurrentPage(prev => prev - 1);
    };

    const handleNext = () => {
        if (currentPage < totalPages) setCurrentPage(prev => prev + 1);
    };

    return (
        <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            
            {/* Title & Search Section */}
            <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-slate-800">Your Applications</h2>
                    <span className="text-sm text-slate-500">{userJobData.length} saved</span>
                </div>

                {/* Modern Search Bar */}
                <div className="relative w-full sm:w-72">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <MagnifyingGlassIcon className="h-5 w-5 text-slate-400" aria-hidden="true" />
                    </div>
                    <input
                        type="text"
                        placeholder="Search companies..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="block w-full rounded-lg border border-slate-200 bg-white py-2.5 pl-10 pr-3 text-sm text-slate-700 placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 focus:outline-none shadow-sm transition-all duration-200"
                    />
                </div>
            </div>

            {/* Card Container */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden flex flex-col">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm text-slate-600">
                        <thead className="bg-slate-50 border-b border-slate-200">
                            <tr>
                                <th scope="col" className="px-6 py-4 font-semibold text-slate-700">Company / Role</th>
                                <th scope="col" className="px-6 py-4 font-semibold text-slate-700">Location</th>
                                <th scope="col" className="px-6 py-4 font-semibold text-slate-700 text-center">Link</th>
                                <th scope="col" className="px-6 py-4 font-semibold text-slate-700 text-right">Actions</th>
                            </tr>
                        </thead>

                        <tbody className="divide-y divide-slate-100">
                            {/* Handle Empty Search Results vs Empty Database */}
                            {filteredJobs.length === 0 ? (
                                <tr>
                                    <td colSpan={4} className="px-6 py-12 text-center">
                                        <div className="flex flex-col items-center justify-center text-slate-400">
                                            <BuildingOfficeIcon className="w-12 h-12 mb-3 opacity-20" />
                                            <p className="text-base font-medium">
                                                {searchQuery ? "No matching jobs found." : "No jobs saved yet."}
                                            </p>
                                            <p className="text-sm">
                                                {searchQuery ? "Try a different search term." : "Start adding applications to populate this list."}
                                            </p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                // Map over PAGINATED jobs
                                paginatedJobs.map((job, index) => (
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
                                                <button
                                                    onClick={() => openDescription(job)}
                                                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-blue-700 bg-blue-50 rounded-md border border-blue-100 hover:bg-blue-100 hover:border-blue-200 transition-all"
                                                >
                                                    <EyeIcon className="w-4 h-4" />
                                                    View
                                                </button>

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

                {/* ✨ NEW: Pagination Footer */}
                {filteredJobs.length > ITEMS_PER_PAGE && (
                    <div className="border-t border-slate-200 bg-slate-50 px-4 py-3 sm:px-6 flex items-center justify-between">
                        <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
                            <div>
                                <p className="text-sm text-slate-700">
                                    Showing <span className="font-medium">{startIndex + 1}</span> to <span className="font-medium">{Math.min(endIndex, filteredJobs.length)}</span> of <span className="font-medium">{filteredJobs.length}</span> results
                                </p>
                            </div>
                            <div>
                                <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
                                    <button
                                        onClick={handlePrevious}
                                        disabled={currentPage === 1}
                                        className="relative inline-flex items-center rounded-l-md px-2 py-2 text-slate-400 ring-1 ring-inset ring-slate-300 hover:bg-slate-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        <span className="sr-only">Previous</span>
                                        <ChevronLeftIcon className="h-5 w-5" aria-hidden="true" />
                                    </button>
                                    
                                    {/* Page Info */}
                                    <span className="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-slate-900 ring-1 ring-inset ring-slate-300 focus:outline-offset-0">
                                        Page {currentPage} of {totalPages}
                                    </span>

                                    <button
                                        onClick={handleNext}
                                        disabled={currentPage === totalPages}
                                        className="relative inline-flex items-center rounded-r-md px-2 py-2 text-slate-400 ring-1 ring-inset ring-slate-300 hover:bg-slate-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        <span className="sr-only">Next</span>
                                        <ChevronRightIcon className="h-5 w-5" aria-hidden="true" />
                                    </button>
                                </nav>
                            </div>
                        </div>
                        
                        {/* Mobile View (Simpler) */}
                        <div className="flex flex-1 justify-between sm:hidden">
                            <button
                                onClick={handlePrevious}
                                disabled={currentPage === 1}
                                className="relative inline-flex items-center rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Previous
                            </button>
                            <button
                                onClick={handleNext}
                                disabled={currentPage === totalPages}
                                className="relative ml-3 inline-flex items-center rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Next
                            </button>
                        </div>
                    </div>
                )}
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