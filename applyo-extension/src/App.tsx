/// <reference types="chrome" />
import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";

// --- CONFIGURATION ---
const SUPABASE_URL = "https://fbwwtuojeoghjvfzoovc.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZid3d0dW9qZW9naGp2Znpvb3ZjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIwNzYzMDcsImV4cCI6MjA3NzY1MjMwN30.MTaBnbhvVJdJ9POSO8Eiw7Mle_tcaPTw0bFX6OQhPAU";
const AUTH_URL = "https://www.applyo.tech/api/auth/extension";
const DASHBOARD_URL = "https://www.applyo.tech/user-dashboard";
const WEBSITE_URL = "https://www.applyo.tech";  

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
      const { error } = await supabase
        .schema("next_auth") 
        .from("user_job_data")
        .insert(jobData);

      if (error) {
        throw error;
      }

      setStatusMsg("Saved successfully!");
      // Optional: Clear the form (uncomment if desired)
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
      <div className="w-[380px] h-[400px] flex flex-col items-center justify-center bg-white p-6 border border-slate-200 rounded-xl shadow-lg font-sans">
        <div className="flex items-center justify-center w-12 h-12 bg-blue-50 rounded-xl mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-blue-600">
            <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 00.75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 00-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0112 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 01-.673-.38m0 0A2.18 2.18 0 013 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 013.413-.387m7.5 0V5.25A2.25 2.25 0 0013.5 3h-3a2.25 2.25 0 00-2.25 2.25v.894m7.5 0a48.667 48.667 0 00-7.5 0M12 12.75h.008v.008H12v-.008z" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-slate-800 mb-2">Welcome to Applyo</h2>
        <p className="text-slate-500 mb-8 text-center px-4 text-sm leading-relaxed">
          Sign in to your account to start tracking your job applications instantly.
        </p>
        
        {statusMsg && (
          <div className="mb-4 p-2 bg-red-50 text-red-600 text-xs font-medium rounded w-full text-center border border-red-100">
            {statusMsg}
          </div>
        )}

        <button
          onClick={handleLogin}
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-sm text-white font-semibold rounded-lg py-3 transition duration-200 shadow-md shadow-blue-600/20 flex justify-center items-center disabled:opacity-70 disabled:cursor-not-allowed"
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
        
        <a
          href={WEBSITE_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-2 w-full text-center text-sm font-medium text-slate-500 hover:text-blue-600 transition-colors bg-slate-50 py-3 rounded-lg border border-slate-100 hover:border-blue-100 hover:bg-blue-50"
        >
          Go to Website
        </a>
      </div>
    );
  }

  // VIEW 2: Logged In (Form)
  return (
    <form
      onSubmit={handleSubmit}
      className="w-[380px] bg-white p-6 border border-slate-200 rounded-xl shadow-lg font-sans"
    >
      <div className="flex justify-between items-center mb-6 border-b border-slate-100 pb-4">
        <h2 className="text-xl font-bold text-slate-800">New Application</h2>
        <button
          type="button"
          onClick={handleLogout}
          className="text-xs font-medium text-slate-400 hover:text-red-600 hover:underline transition-colors"
        >
          Sign Out
        </button>
      </div>

      {/* Company Field */}
      <div className="mb-4">
        <label htmlFor="company" className="block text-xs font-bold text-slate-600 mb-1.5">
          Company Name
        </label>
        <input
          id="company"
          name="company"
          required
          type="text"
          placeholder="e.g. Google"
          value={formData.company}
          onChange={handleChange}
          className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2.5 px-3 text-sm text-slate-800 placeholder:text-slate-400 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all"
        />
      </div>

      {/* Location Field */}
      <div className="mb-4">
        <label htmlFor="location" className="block text-xs font-bold text-slate-600 mb-1.5">
          Location
        </label>
        <input
          id="location"
          name="location"
          type="text"
          placeholder="e.g. Remote / Toronto"
          value={formData.location}
          onChange={handleChange}
          className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2.5 px-3 text-sm text-slate-800 placeholder:text-slate-400 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all"
        />
      </div>

      {/* Job Title Field */}
      <div className="mb-4">
        <label htmlFor="title" className="block text-xs font-bold text-slate-600 mb-1.5">
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
          className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2.5 px-3 text-sm text-slate-800 placeholder:text-slate-400 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all"
        />
      </div>

      {/* Link Field */}
      <div className="mb-4">
        <label htmlFor="link" className="block text-xs font-bold text-slate-600 mb-1.5">
          Job Link
        </label>
        <input
          id="link"
          name="link"
          type="url"
          placeholder="https://..."
          value={formData.link}
          onChange={handleChange}
          className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2.5 px-3 text-sm text-slate-800 placeholder:text-slate-400 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all"
        />
      </div>

      {/* Description Field */}
      <div className="mb-6">
        <label htmlFor="description" className="block text-xs font-bold text-slate-600 mb-1.5">
          Description
        </label>
        <textarea
          id="description"
          name="description"
          rows={3}
          placeholder="Key details about the role..."
          value={formData.description}
          onChange={handleChange}
          className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2.5 px-3 text-sm text-slate-800 placeholder:text-slate-400 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all resize-none"
        />
      </div>

      {/* Status Message */}
      {statusMsg && (
        <div className={`mb-4 text-xs font-medium text-center py-2.5 rounded-lg ${
          statusMsg.includes("Error") 
            ? "bg-red-50 text-red-600 border border-red-100" 
            : "bg-green-50 text-green-600 border border-green-100"
        }`}>
          {statusMsg}
        </div>
      )}

      <div className="flex flex-col gap-3">
        {/* Save Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg py-3 transition duration-200 shadow-lg shadow-blue-600/20 hover:shadow-blue-600/30 disabled:opacity-70 disabled:cursor-not-allowed transform active:scale-[0.98]"
        >
          {loading ? "Saving..." : "Save Application"}
        </button>

        {/* Go to Dashboard Link */}
        <a
          href={DASHBOARD_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full text-center bg-blue-50 hover:bg-blue-100 text-blue-600 font-semibold rounded-lg py-2.5 text-xs transition duration-200 border border-blue-100"
        >
          Go to Dashboard
        </a>
      </div>
    </form>
  );
}

export default App;