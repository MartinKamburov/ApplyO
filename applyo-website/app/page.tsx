"use server"

import { auth } from "@/auth";
import { redirect } from 'next/navigation';
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Footer from "@/components/Footer";
import FAQ from "@/components/FAQ";

export default async function Home() {
  const session = await auth();

  if (session){
    redirect('/user-dashboard')
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />
      <main>
        <Hero />
        <FAQ />
      </main>
      <Footer /> 
    </div>
  );
}
