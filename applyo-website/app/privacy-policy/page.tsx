import Link from "next/link";
import { ArrowLeftIcon, ShieldCheckIcon, CodeBracketIcon, EnvelopeIcon } from "@heroicons/react/24/outline";

// Replace this with your actual config import if you have one, 
// or just hardcode the appName if simpler for this page.
const config = {
  appName: "ApplyO",
};

export const metadata = {
  title: `Privacy Policy | ${config.appName}`,
  description: `Privacy Policy for ${config.appName}. We value your privacy and open-source transparency.`,
};

const PrivacyPolicy = () => {
  const currentDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <main className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        
        {/* Back Button */}
        <div className="mb-8">
          <Link 
            href="/" 
            className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-blue-600 transition-colors"
          >
            <ArrowLeftIcon className="w-4 h-4 mr-2" />
            Back to Home
          </Link>
        </div>

        {/* Header Section */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 sm:p-12 mb-8">
          <div className="flex items-center justify-center w-12 h-12 bg-blue-50 rounded-xl mb-6">
            <ShieldCheckIcon className="w-6 h-6 text-blue-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight sm:text-4xl mb-4">
            Privacy Policy
          </h1>
          <p className="text-lg text-gray-600 leading-relaxed">
            At {config.appName}, we believe in transparency by default. As an open-source project, 
            our code is public, and our commitment to your privacy is absolute. We do not sell your data. Period.
          </p>
          <div className="mt-6 flex items-center gap-4 text-sm text-gray-500">
            <span className="flex items-center gap-1.5 bg-gray-100 px-3 py-1 rounded-full">
              Last Updated: {currentDate}
            </span>
            <a 
              href="https://github.com/MartinKamburov/ApplyO" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 hover:text-blue-600 transition-colors"
            >
              <CodeBracketIcon className="w-4 h-4" />
              View Source Code
            </a>
          </div>
        </div>

        {/* Policy Content */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 sm:p-12 space-y-12">
          
          {/* Section 1 */}
          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              1. Introduction
            </h2>
            <div className="prose prose-slate text-gray-600 leading-relaxed">
              <p>
                Thank you for using ApplyO ("we," "us," or "our"). This Privacy Policy explains how we collect, use, 
                and safeguard your information when you use our browser extension and web dashboard.
              </p>
              <p className="mt-4">
                <strong>ApplyO is Open Source.</strong> This means the code that runs this application is publicly available 
                for anyone to audit. We believe this is the highest standard of trust—you don't have to take our word for it; 
                you can verify exactly how your data is handled by checking our GitHub repository.
              </p>
            </div>
          </section>

          {/* Section 2 */}
          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              2. Information We Collect
            </h2>
            <div className="space-y-4 text-gray-600 leading-relaxed">
              <p>We collect minimal data necessary to provide the functionality of the job tracking service:</p>
              <ul className="list-disc list-inside space-y-2 ml-2">
                <li><strong>Account Information:</strong> When you sign up via OAuth (e.g., GitHub, Google), we store your email address and name to create your account and save your data.</li>
                <li><strong>Job Application Data:</strong> We store the job listings you explicitly save (Company Name, Job Title, URL, Description, Location). This data is private to your account.</li>
                <li><strong>Usage Data:</strong> We may collect anonymous, aggregate telemetry to understand if the app is crashing or having performance issues.</li>
              </ul>
            </div>
          </section>

          {/* Section 3 */}
          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              3. How We Use Your Data
            </h2>
            <p className="text-gray-600 leading-relaxed">
              Your data is used solely for the purpose of providing the ApplyO service to you. 
              We use your job application data to populate your dashboard and help you organize your search.
              We use your email to identify you when you log in.
            </p>
          </section>

          {/* Section 4 - The "No Sell" Clause */}
          <section className="bg-blue-50 rounded-xl p-6 border border-blue-100">
            <h2 className="text-lg font-bold text-blue-900 mb-2">
              4. We Do Not Sell Your Data
            </h2>
            <p className="text-blue-800/80 leading-relaxed">
              This is a core promise. We do not sell, trade, or rent your personal identification information 
              or your job application history to third parties, recruiters, or advertisers. Your job hunt is your private business.
            </p>
          </section>

          {/* Section 5 */}
          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              5. Data Security
            </h2>
            <p className="text-gray-600 leading-relaxed">
              We implement industry-standard security measures to protect your data. All communication between 
              the browser extension, the dashboard, and our database is encrypted via HTTPS. Database access 
              is secured via strict Row Level Security (RLS) policies, ensuring users can only access their own data.
            </p>
          </section>

          {/* Section 6 */}
          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              6. Contact Us
            </h2>
            <p className="text-gray-600 mb-4">
              If you have any questions about this Privacy Policy, the practices of this site, or your dealings with this site, please contact us.
            </p>
            <a 
              href="mailto:martin.kamburov23@gmail.com"
              className="inline-flex items-center gap-2 text-blue-600 font-medium hover:text-blue-700 transition-colors"
            >
              <EnvelopeIcon className="w-5 h-5" />
              martin.kamburov23@gmail.com
            </a>
          </section>

        </div>
      </div>
    </main>
  );
};

export default PrivacyPolicy;