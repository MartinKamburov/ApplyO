"use client"

import { ChevronRightIcon } from '@heroicons/react/20/solid';
import HeroPic from "@/public/HeroPic.png";
import Image from 'next/image';

export default function Hero() {
  return (
    // CHANGED: Removed 'overflow-hidden' so the glow isn't clipped at the edges
    <div className="relative bg-gray-50 py-16 sm:py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-y-16 lg:grid-cols-2 lg:gap-x-8 lg:items-center">
          
          {/* LEFT COLUMN: Text Content */}
          <div className="max-w-lg lg:max-w-none">
            
            {/* Notification Badge */}
            <div className="flex items-center space-x-2 mb-8">
              <span className="inline-flex items-center rounded-full bg-blue-50 px-3 py-1 text-sm font-semibold text-blue-600 ring-1 ring-inset ring-blue-600/20">
                What's new
              </span>
              <span className="inline-flex items-center text-sm font-medium text-gray-500">
                Just shipped v1.0
                <ChevronRightIcon className="ml-1 h-5 w-5 text-gray-400" aria-hidden="true" />
              </span>
            </div>

            {/* Heading */}
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
              Tracking Your Jobs Made Simple!
            </h1>

            {/* Subtext */}
            <p className="mt-6 text-xl font-bold leading-8 text-gray-600">
              Losing track of multiple jobs that you have applied to?
            </p>

            <p className="mt-2 text-lg leading-8 text-gray-600">
              Applyo is a lightweight browser extension and web dashboard that helps you stay organized throughout your job hunt. Capture job listings instantly with an all in one clean, modern interface.
            </p>

            {/* Buttons */}
            <div className="mt-10 flex items-center gap-x-6">
              <a
                href="#"
                className="rounded-md bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 transition-colors"
              >
                Add to Chrome
              </a>
              <a
                href="https://github.com/MartinKamburov/ApplyO"
                className="flex items-center text-sm font-semibold leading-6 text-gray-900 hover:text-blue-600 transition-colors"
              >
                View on GitHub <span aria-hidden="true" className="ml-2">→</span>
              </a>
            </div>
          </div>

          {/* RIGHT COLUMN: Image with Strong Blue Glow */}
          <div className="relative mt-10 lg:mt-0 lg:col-span-1 isolate">
  
            {/* 1. THE GLOW 
                -inset-4: Pushes glow out.
                opacity-100: Max visibility.
                -z-10: Puts it behind the image (but inside the isolated group).
            */}
            <div className="absolute -inset-4 bg-gradient-to-r from-blue-600 to-cyan-400 rounded-2xl opacity-100 blur-2xl -z-10"></div>
            
            {/* 2. THE IMAGE 
                bg-white: Blocks the glow from showing through the center.
            */}
            <div className="relative rounded-2xl bg-white shadow-xl ring-1 ring-gray-900/10">
              <Image
                src={HeroPic}
                alt="Applyo Dashboard Screenshot"
                priority={true}
                className="w-full h-auto rounded-2xl"
                quality={100}
              />
            </div>

          </div>
          
        </div>
      </div>
    </div>
  );
}