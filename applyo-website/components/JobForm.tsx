import { insertUserJobs } from "@/lib/database/InsertToDatabase";

export default function JobForm() {

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const formData = new FormData(event.currentTarget);

        const jobData = {
        company: formData.get("company") as string,
        job_title: formData.get("job_title") as string,
        location: formData.get("location") as string,
        listing_url: formData.get("listing_url") as string,
        description: formData.get("description") as string,
        };

        await insertUserJobs(jobData); // ✅ pass the values to your function
    };

    return (
        <form 
            onSubmit={handleSubmit}
            className="w-[380px] rounded-2xl bg-gradient-to-b from-white/90 to-white/70 backdrop-blur-xl shadow-xl p-6 border border-white/30"
        >
            <h2 className="text-2xl font-semibold text-gray-800 mb-4 text-center">Add Job</h2>

            {/* Company Field */}
            <div className="mb-5">
                <label htmlFor="company" className="block text-sm font-medium text-gray-600 mb-1">
                Company
                </label>
                <input
                id="company"
                name="company"
                type="text"
                required
                placeholder="Enter here..."
                className="w-full rounded-lg border border-gray-300 bg-white/70 py-2 px-3 text-gray-800 placeholder:text-gray-400 shadow-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-400 outline-none transition duration-200"
                />
            </div>

            {/* Company Field */}
            <div className="mb-5">
                <label htmlFor="location" className="block text-sm font-medium text-gray-600 mb-1">
                Location
                </label>
                <input
                id="location"
                name="location"
                type="text"
                required
                placeholder="Enter here..."
                className="w-full rounded-lg border border-gray-300 bg-white/70 py-2 px-3 text-gray-800 placeholder:text-gray-400 shadow-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-400 outline-none transition duration-200"
                />
            </div>

            {/* Job Title Field */}
            <div className="mb-5">
                <label htmlFor="title" className="block text-sm font-medium text-gray-600 mb-1">
                Job Title
                </label>
                <input
                id="job_title"
                name="job_title"
                type="text"
                required
                placeholder="e.g. Software Engineer"
                className="w-full rounded-lg border border-gray-300 bg-white/70 py-2 px-3 text-gray-800 placeholder:text-gray-400 shadow-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-400 outline-none transition duration-200"
                />
            </div>

            {/* Link Field */}
            <div className="mb-6">
                <label htmlFor="link" className="block text-sm font-medium text-gray-600 mb-1">
                Link
                </label>
                <input
                id="listing_url"
                name="listing_url"
                type="url"
                required
                placeholder="Paste job link..."
                className="w-full rounded-lg border border-gray-300 bg-white/70 py-2 px-3 text-gray-800 placeholder:text-gray-400 shadow-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-400 outline-none transition duration-200"
                />
            </div>

            <div className="mb-6">
                <label htmlFor="description" className="block text-sm font-medium text-gray-600 mb-1">
                Description
                </label>
                <input
                id="description"
                name="description"
                type="text"
                required
                placeholder="Paste the jobs description..."
                className="w-full rounded-lg border border-gray-300 bg-white/70 py-2 px-3 text-gray-800 placeholder:text-gray-400 shadow-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-400 outline-none transition duration-200"
                />
            </div>

            {/* Buttons */}
            <div className="flex justify-between items-center">
                <button
                type="submit"
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg py-2.5 transition duration-200 shadow-md"
                >
                Save Application
                </button>
            </div>
        </form>
    )
}
