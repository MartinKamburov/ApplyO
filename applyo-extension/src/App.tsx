/// <reference types="chrome" />
import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";

// --- CONFIGURATION ---
// These should be in your .env file in the extension root
// Example .env content:
// VITE_SUPABASE_URL=https://your-project.supabase.co
// VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsIn...
// VITE_AUTH_URL=http://localhost:3000/api/auth/extension

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;
const AUTH_URL = import.meta.env.VITE_AUTH_URL;

// Initial state for the form data
const INITIAL_FORM_STATE = {
  company: '',
  location: '',
  title: '',
  link: '',
  description: '',
};

// Define the type for form data
type FormData = typeof INITIAL_FORM_STATE;

function App() {
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [statusMsg, setStatusMsg] = useState("");
  // State to control the form inputs
  const [formData, setFormData] = useState<FormData>(INITIAL_FORM_STATE);

  // Function to update the formData state on every input change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  // 1. On load, check if we have a token saved in Chrome Storage
  useEffect(() => {
    chrome.storage.local.get(["supabase_token", "saved_form_data"], (result) => {
      if (result.supabase_token) {
        setToken(result.supabase_token as string);
      }

      // Load and restore saved form data if available
      if (result.saved_form_data && typeof result.saved_form_data === 'object') {
        setFormData(result.saved_form_data as FormData);
      }
    });
  }, []);

  // --- PERSISTENCE: Save form data to storage whenever it changes ---
  useEffect(() => {
    // Only save if the form is actually visible and populated
    const hasData = Object.values(formData).some(val => val !== '');
    
    if (token && hasData) {
      // Debounce the save operation to avoid excessive writes
      const delayDebounceFn = setTimeout(() => {
        chrome.storage.local.set({ saved_form_data: formData });
      }, 500); 

      return () => clearTimeout(delayDebounceFn);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formData, token]);

  // 2. Handle Login Redirect
  const handleLogin = () => {
    setLoading(true);
    setStatusMsg("Opening login window...");
    
    const extensionId = chrome.runtime.id;
    const authUrlWithParams = `${AUTH_URL}?ext_id=${extensionId}`;

    // This opens the popup window to your Next.js app
    chrome.identity.launchWebAuthFlow(
      {
        url: authUrlWithParams,
        interactive: true,
      },
      (redirectUrl) => {
        if (chrome.runtime.lastError || !redirectUrl) {
          console.error("Login Error:", chrome.runtime.lastError);
          setStatusMsg("Login failed or cancelled.");
          setLoading(false);
          return;
        }

        // Extract token from URL: https://<id>.chromiumapp.org/callback?token=...
        const url = new URL(redirectUrl);
        const receivedToken = url.searchParams.get("token");

        if (receivedToken) {
          // Save to storage and state
          chrome.storage.local.set({ supabase_token: receivedToken });
          setToken(receivedToken);
          setStatusMsg("");
        } else {
          setStatusMsg("No token received from website.");
        }
        setLoading(false);
      }
    );
  };

  // 3. Handle Logout
  const handleLogout = () => {
    chrome.storage.local.remove("supabase_token");
    chrome.storage.local.remove("saved_form_data");
    setToken(null);
    setFormData(INITIAL_FORM_STATE);
    setStatusMsg("");
  };

  // 4. Save Job Application to Supabase
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!token) return;

    setLoading(true);
    setStatusMsg("Saving...");

    try {
      // --- STEP A: Decode Email from Token ---
      // We need to send the email because your DB requires it, 
      // but the form doesn't ask the user for it.
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        window.atob(base64).split('').map(function(c) {
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join('')
      );
      const payload = JSON.parse(jsonPayload);
      const userEmail = payload.email;

      if (!userEmail) {
        throw new Error("Could not extract email from token. Please sign out and in again.");
      }
      
      // --- STEP B: Prepare Data (Using State Data) ---
      const jobData = {
        email: userEmail,           
        company: formData.company,
        location: formData.location,
        job_title: formData.title,     
        listing_url: formData.link,    
        description: formData.description,
      };

      // --- STEP C & D: Initialize Client and Insert Data ---
      const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
        global: { headers: { Authorization: `Bearer ${token}` } },
      });

      // --- STEP D: Insert Data ---
      // Target the 'user_job_data' table in the 'next_auth' schema
      // NOTE: We must explicitly state the schema since it's not 'public'
      const { error } = await supabase
        .schema("next_auth") 
        .from("user_job_data")
        .insert(jobData);

      if (error) {
        throw error;
      }

      setStatusMsg("Saved successfully!");
      // Optional: Clear the form (uncomment if desired)
      // FIX: Clear the form by reliably resetting the state
      setFormData(INITIAL_FORM_STATE); 
      // Clear the saved draft from storage
      chrome.storage.local.remove("saved_form_data");

    } catch (err: any) {
      console.error("Save Error:", err);
      setStatusMsg(`Error: ${err.message || "Unknown error"}`);
    } finally {
      setLoading(false);
    }
  };

  // --- RENDER LOGIC ---

  // VIEW 1: Logged Out
  if (!token) {
    return (
      <div className="w-[380px] h-[400px] flex flex-col items-center justify-center bg-white p-6 border border-gray-200 rounded-xl shadow-xl font-sans">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Applyo Job Tracker</h2>
        <p className="text-gray-500 mb-6 text-center px-4">
          Sign in to save job applications directly to your dashboard.
        </p>
        
        {statusMsg && (
          <div className="mb-4 p-2 bg-red-50 text-red-600 text-xs rounded w-full text-center">
            {statusMsg}
          </div>
        )}

        <button
          onClick={handleLogin}
          disabled={loading}
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg py-3 transition duration-200 shadow-md flex justify-center items-center disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {loading ? (
            <span className="flex items-center gap-2">
              <svg className="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
              </svg>
              Connecting...
            </span>
          ) : (
            "Sign in with Website"
          )}
        </button>
      </div>
    );
  }

  // VIEW 2: Logged In (Form)
  return (
    <form
      onSubmit={handleSubmit}
      className="w-[380px] rounded-2xl bg-white shadow-xl p-6 border border-gray-100 font-sans"
    >
      <div className="flex justify-between items-center mb-5 border-b border-gray-100 pb-3">
        <h2 className="text-xl font-bold text-gray-800">Add Application</h2>
        <button
          type="button"
          onClick={handleLogout}
          className="text-xs text-gray-500 hover:text-red-600 hover:underline transition-colors"
        >
          Sign Out
        </button>
      </div>

      {/* Company Field */}
      <div className="mb-3">
        <label htmlFor="company" className="block text-xs font-semibold text-gray-600 mb-1 uppercase tracking-wide">
          Company
        </label>
        <input
          id="company"
          name="company"
          required
          type="text"
          placeholder="e.g. Google"
          value={formData.company}
          onChange={handleChange}
          className="w-full rounded-lg border border-gray-300 bg-gray-50 py-2 px-3 text-sm text-gray-800 placeholder:text-gray-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all"
        />
      </div>

      {/* Location Field */}
      <div className="mb-3">
        <label htmlFor="location" className="block text-xs font-semibold text-gray-600 mb-1 uppercase tracking-wide">
          Location
        </label>
        <input
          id="location"
          name="location"
          type="text"
          placeholder="e.g. Remote / Toronto"
          value={formData.location}
          onChange={handleChange}
          className="w-full rounded-lg border border-gray-300 bg-gray-50 py-2 px-3 text-sm text-gray-800 placeholder:text-gray-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all"
        />
      </div>

      {/* Job Title Field */}
      <div className="mb-3">
        <label htmlFor="title" className="block text-xs font-semibold text-gray-600 mb-1 uppercase tracking-wide">
          Job Title
        </label>
        <input
          id="title"
          name="title"
          required
          type="text"
          placeholder="e.g. Frontend Engineer"
          value={formData.title}
          onChange={handleChange}
          className="w-full rounded-lg border border-gray-300 bg-gray-50 py-2 px-3 text-sm text-gray-800 placeholder:text-gray-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all"
        />
      </div>

      {/* Link Field */}
      <div className="mb-3">
        <label htmlFor="link" className="block text-xs font-semibold text-gray-600 mb-1 uppercase tracking-wide">
          Link
        </label>
        <input
          id="link"
          name="link"
          type="url"
          placeholder="https://..."
          value={formData.link}
          onChange={handleChange}
          className="w-full rounded-lg border border-gray-300 bg-gray-50 py-2 px-3 text-sm text-gray-800 placeholder:text-gray-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all"
        />
      </div>

      {/* Description Field */}
      <div className="mb-5">
        <label htmlFor="description" className="block text-xs font-semibold text-gray-600 mb-1 uppercase tracking-wide">
          Description
        </label>
        <textarea
          id="description"
          name="description"
          rows={2}
          placeholder="Key details..."
          value={formData.description}
          onChange={handleChange}
          className="w-full rounded-lg border border-gray-300 bg-gray-50 py-2 px-3 text-sm text-gray-800 placeholder:text-gray-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all resize-none"
        />
      </div>

      {/* Status Message */}
      {statusMsg && (
        <div className={`mb-4 text-xs text-center py-2 rounded ${
          statusMsg.includes("Error") 
            ? "bg-red-50 text-red-600 border border-red-100" 
            : "bg-green-50 text-green-600 border border-green-100"
        }`}>
          {statusMsg}
        </div>
      )}

      {/* Submit Button */}
      <button
        type="submit"
        disabled={loading}
        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg py-2.5 transition duration-200 shadow-lg hover:shadow-xl disabled:opacity-70 disabled:cursor-not-allowed transform active:scale-[0.98]"
      >
        {loading ? "Saving..." : "Save Application"}
      </button>
    </form>
  );
}

export default App;