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
    <div className="grid grid-flow-col grid-rows-3 gap-4 bg-gray-50">
      <div className="row-span-3">
        <Header />
        <Hero />
        <FAQ />
        <Footer /> 
      </div>
    </div>
  );
}
