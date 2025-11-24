"use client"

import { useState, useRef } from "react";

// --- Types ---
type FAQItemData = {
  question: string;
  answer: string;
};

const faqData: FAQItemData[] = [
  {
    question: "What do I get exactly?",
    answer: "You get free access to our comprehensive dashboard, the Chrome extension for one-click saving, and unlimited job application tracking.",
  },
  {
    question: "Can I request a feature?",
    answer: "Yes of course! I would love to improve the job tracker just click on the support button at the bottom and email me!",
  },
  {
    question: "I have another question",
    answer: "Cool, contact me by email and I'll get back to you as soon as possible, just click the support button at the bottom.",
  },
];

// --- Sub-Component for Individual Items ---
// We need this to use 'useRef' for each individual answer height
const FAQItem = ({ 
  item, 
  isOpen, 
  onClick 
}: { 
  item: FAQItemData; 
  isOpen: boolean; 
  onClick: () => void; 
}) => {
  const contentRef = useRef<HTMLDivElement>(null);

  return (
    <div className="border-b border-gray-200 last:border-0">
      <button
        onClick={onClick}
        className="flex w-full items-center justify-between py-4 text-left focus:outline-none group"
        aria-expanded={isOpen}
      >
        <span
          className={`text-lg font-semibold transition-colors duration-300 ${
            isOpen ? "text-blue-600" : "text-slate-800 group-hover:text-blue-600"
          }`}
        >
          {item.question}
        </span>

        {/* Animated Plus/Minus Icon */}
        <span
          className={`ml-6 flex-shrink-0 transition-colors duration-300 ${
            isOpen ? "text-blue-600" : "text-gray-400 group-hover:text-blue-600"
          }`}
        >
          <div className="relative flex h-3 w-3 items-center justify-center">
            <span className="absolute h-[1.5px] w-full bg-current" />
            <span
              className={`absolute h-[1.5px] w-full bg-current transition-transform duration-300 ease-out ${
                isOpen ? "rotate-90 opacity-0" : "rotate-90 opacity-100"
              }`}
            />
          </div>
        </span>
      </button>

      {/* SMOOTH ANIMATION ENGINE:
        Using ref + scrollHeight allows exact pixel-perfect transitions.
      */}
      <div
        ref={contentRef}
        className="overflow-hidden transition-all duration-300 ease-in-out"
        style={{
          maxHeight: isOpen ? contentRef.current?.scrollHeight : 0,
          opacity: isOpen ? 1 : 0,
        }}
      >
        <p className="pb-4 text-gray-600 leading-relaxed">
          {item.answer}
        </p>
      </div>
    </div>
  );
};

// --- Main Component ---
export default function FAQ() {
  // State for Accordion (only one open at a time)
  const [openIndex, setOpenIndex] = useState<number | null>(2);

  const handleToggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="py-20 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          
          {/* Left Column: Title & Header */}
          <div className="lg:col-span-1">
            <span className="text-blue-600 font-bold tracking-wider uppercase text-sm">
              FAQ
            </span>
            <h2 className="mt-4 text-4xl font-extrabold text-slate-900 tracking-tight">
              Frequently Asked Questions
            </h2>
            <p className="mt-4 text-gray-500">
              Can’t find the answer you’re looking for? Reach out to my email martin.kamburov23@gmail.com.
            </p>
          </div>

          {/* Right Column: Accordion List */}
          <div className="lg:col-span-2">
            <div className="border-t border-gray-200">
              {faqData.map((item, index) => (
                <FAQItem
                  key={index}
                  item={item}
                  isOpen={openIndex === index}
                  onClick={() => handleToggle(index)}
                />
              ))}
            </div>
          </div>
          
        </div>
      </div>
    </section>
  );
}