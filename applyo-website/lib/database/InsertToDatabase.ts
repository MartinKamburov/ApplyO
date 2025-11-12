import { supabaseConnection } from "@/lib/database/supabase";
import { auth } from '@/auth';

export type JobInput = {
  company: string;
  job_title: string;
  location: string;
  listing_url: string;
  description: string;
};

export async function insertUserJobs(job: JobInput) {
  const session = await auth();

  if (!session?.user?.id) return [];

  const payload = {
    userId: session.user.id, 
    company: job.company, 
    job_title: job.job_title, 
    location: job.location, 
    listing_url: job.listing_url, 
    description: job.description
  }

  const { data, error } = await supabaseConnection
    .from("next_auth.user_job_data")
    .insert(payload)
    .select()

  if (error) throw error;

  return data;
}