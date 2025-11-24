import Link from "next/link";
import { ArrowLeftIcon, DocumentTextIcon, EnvelopeIcon } from "@heroicons/react/24/outline";

// Config placeholder - replace with your actual config import
const config = {
  appName: "ApplyO",
  email: "martin.kamburov23@gmail.com",
};

export const metadata = {
  title: `Terms of Service | ${config.appName}`,
  description: `Terms of Service for ${config.appName}. Read our usage guidelines and policies.`,
};

const TOS = () => {
  // Automatically update the date
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
            <DocumentTextIcon className="w-6 h-6 text-blue-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight sm:text-4xl mb-4">
            Terms of Service
          </h1>
          <p className="text-lg text-gray-600 leading-relaxed">
            Welcome to {config.appName}. By using our browser extension and dashboard, you agree to these terms. 
            Please read them carefully to understand your rights and obligations.
          </p>
          <div className="mt-6 flex items-center gap-4 text-sm text-gray-500">
            <span className="flex items-center gap-1.5 bg-gray-100 px-3 py-1 rounded-full">
              Last Updated: {currentDate}
            </span>
          </div>
        </div>

        {/* Terms Content */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 sm:p-12 space-y-12">
          
          {/* Section 1 */}
          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              1. Introduction and Acceptance
            </h2>
            <div className="prose prose-slate text-gray-600 leading-relaxed">
              <p>
                These Terms of Service ("Terms") govern your use of the website and browser extension provided by 
                <strong> {config.appName}</strong> ("we," "us," or "our"). Our service is designed to help job seekers 
                organize, track, and manage their job applications efficiently.
              </p>
              <p className="mt-4">
                By accessing or using our services, you agree to be bound by these Terms. If you do not agree 
                to these Terms, please do not use our services.
              </p>
            </div>
          </section>

          {/* Section 2 */}
          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              2. Description of Service
            </h2>
            <p className="text-gray-600 leading-relaxed">
              {config.appName} provides a suite of tools including a Chrome Extension for capturing job data 
              and a Web Dashboard for managing your application pipeline. We reserve the right to modify, 
              suspend, or discontinue any part of the service at any time with or without notice.
            </p>
          </section>

          {/* Section 3 */}
          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              3. User Accounts & Security
            </h2>
            <div className="space-y-4 text-gray-600 leading-relaxed">
              <p>
                To access certain features, you may be required to create an account via OAuth (GitHub/Google). 
                You are responsible for maintaining the confidentiality of your account login information 
                and are fully responsible for all activities that occur under your account.
              </p>
            </div>
          </section>

          {/* Section 4 */}
          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              4. Data and Privacy
            </h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              Your privacy is critical to us. Our use of your personal information is governed by our 
              <Link href="/privacy-policy" className="text-blue-600 hover:underline ml-1 font-medium">
                Privacy Policy
              </Link>.
            </p>
            <ul className="list-disc list-inside space-y-2 ml-2 text-gray-600">
              <li>You retain ownership of all job application data you save to our platform.</li>
              <li>We do not sell your personal data or application history to third parties.</li>
              <li>We use cookies solely to enhance your user experience and maintain your session.</li>
            </ul>
          </section>

          {/* Section 5 */}
          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              5. Governing Law
            </h2>
            <p className="text-gray-600 leading-relaxed">
              These Terms shall be governed by and construed in accordance with the laws of Canada, 
              without regard to its conflict of law provisions. Any disputes arising from these Terms 
              shall be resolved in the courts of Canada.
            </p>
          </section>

          {/* Section 6 */}
          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              6. Updates to Terms
            </h2>
            <p className="text-gray-600 leading-relaxed">
              We may revise these Terms from time to time. The most current version will always be posted on this page. 
              By continuing to access or use the Services after changes become effective, you agree to be bound by the revised Terms.
            </p>
          </section>

          {/* Contact Section */}
          <section className="border-t border-gray-100 pt-8 mt-8">
            <h2 className="text-lg font-bold text-gray-900 mb-2">
              Questions?
            </h2>
            <p className="text-gray-600 mb-4">
              If you have any questions or concerns regarding these Terms of Service, please contact us.
            </p>
            <a 
              href={`mailto:${config.email}`}
              className="inline-flex items-center gap-2 text-blue-600 font-medium hover:text-blue-700 transition-colors bg-blue-50 px-4 py-2 rounded-lg"
            >
              <EnvelopeIcon className="w-5 h-5" />
              {config.email}
            </a>
          </section>

        </div>
      </div>
    </main>
  );
};

export default TOS;