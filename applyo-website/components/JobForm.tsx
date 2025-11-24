"use client"
import { useState } from "react";

interface JobFormProps {
    onJobAdded: () => void;
}

export default function JobForm({ onJobAdded }: JobFormProps) {
    // Add loading state for better UX
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setIsLoading(true); // Start loading

        const form = event.currentTarget as HTMLFormElement;
        const formData = new FormData(form);

        const jobData = {
            company: formData.get("company") as string,
            job_title: formData.get("job_title") as string,
            location: formData.get("location") as string,
            listing_url: formData.get("listing_url") as string,
            description: formData.get("description") as string,
        };

        try {
            const res = await fetch("/api/jobs/insert", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(jobData),
            });

            if (!res.ok){
                const err = await res.json().catch(() => ({}));
                throw new Error(err?.message ?? `HTTP ${res.status}`);
            }

            onJobAdded();
            
            form.reset();
        } catch (err: any) {
            console.error("Failed to add job", err);
        } finally {
            setIsLoading(false); // Stop loading
        }
    };

    return (
        <div className="w-full max-w-[380px]">
            {/* Header */}
            <h2 className="text-2xl font-bold text-slate-800 mb-6 text-center">Add Job</h2>

            <form 
                onSubmit={handleSubmit}
                className="bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 p-6 sm:p-8"
            >
                <div className="space-y-5">
                    {/* Company Field */}
                    <div>
                        <label htmlFor="company" className="block text-sm font-semibold text-slate-600 mb-1.5">
                            Company
                        </label>
                        <input
                            id="company"
                            name="company"
                            type="text"
                            required
                            placeholder="Enter here..."
                            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all duration-200 outline-none"
                        />
                    </div>

                    {/* Location Field */}
                    <div>
                        <label htmlFor="location" className="block text-sm font-semibold text-slate-600 mb-1.5">
                            Location
                        </label>
                        <input
                            id="location"
                            name="location"
                            type="text"
                            required
                            placeholder="e.g. Remote / Toronto"
                            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all duration-200 outline-none"
                        />
                    </div>

                    {/* Job Title Field */}
                    <div>
                        <label htmlFor="job_title" className="block text-sm font-semibold text-slate-600 mb-1.5">
                            Job Title
                        </label>
                        <input
                            id="job_title"
                            name="job_title"
                            type="text"
                            required
                            placeholder="e.g. Software Engineer"
                            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all duration-200 outline-none"
                        />
                    </div>

                    {/* Link Field */}
                    <div>
                        <label htmlFor="listing_url" className="block text-sm font-semibold text-slate-600 mb-1.5">
                            Link
                        </label>
                        <input
                            id="listing_url"
                            name="listing_url"
                            type="url"
                            required
                            placeholder="Paste job link..."
                            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all duration-200 outline-none"
                        />
                    </div>

                    {/* Description Field */}
                    <div>
                        <label htmlFor="description" className="block text-sm font-semibold text-slate-600 mb-1.5">
                            Description
                        </label>
                        <input // You might want to change this to a <textarea> if descriptions are long
                            id="description"
                            name="description"
                            type="text"
                            required
                            placeholder="Short description..."
                            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all duration-200 outline-none"
                        />
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full mt-2 rounded-xl bg-blue-600 px-4 py-3.5 text-sm font-bold text-white shadow-lg shadow-blue-600/20 hover:bg-blue-700 hover:shadow-blue-600/30 focus:outline-none focus:ring-4 focus:ring-blue-600/20 active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed transition-all duration-200"
                    >
                        {isLoading ? (
                            <span className="flex items-center justify-center gap-2">
                                <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                                </svg>
                                Saving...
                            </span>
                        ) : (
                            "Save Application"
                        )}
                    </button>
                </div>
            </form>
        </div>
    )
}