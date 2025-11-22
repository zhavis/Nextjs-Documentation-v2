"use client";

import { useProgress } from "../api/users/progress/ProgressContext";
import Link from "next/link";
import { useState } from "react";

const TOTAL_PAGES = [
    "introduction",
    "getting-started",
    "guides",
    "faq",
  ];
export default function FAQPage() {
  const { progressPages, markPageAsRead } = useProgress();
  const pageSlug = "faq";
  const completed = progressPages.includes(pageSlug);
  const canRead = progressPages.includes("guides");
  const percent = Math.round((progressPages.length / TOTAL_PAGES.length) * 100);

  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const faqs = [
    {
      question: "What is Tailwind CSS?",
      answer:
        "Tailwind CSS is a utility-first CSS framework that allows you to style your HTML elements directly using utility classes instead of writing custom CSS.",
    },
    {
      question: "How do I make responsive designs?",
      answer:
        "Tailwind provides responsive prefixes like sm:, md:, lg:, and xl:. For example, `md:text-xl` will apply text-xl only on medium screens and above.",
    },
    {
      question: "Can I customize colors and spacing?",
      answer:
        "Yes! Tailwind is highly configurable. You can extend or override default colors, spacing, and other design tokens via the tailwind.config.js file.",
    },
    {
      question: "How do I add hover effects?",
      answer:
        "Use variant modifiers such as `hover:`. For example, `hover:bg-blue-500` changes the background color on hover.",
    },
    {
      question: "Is Tailwind CSS compatible with React and Next.js?",
      answer:
        "Absolutely! Tailwind works seamlessly with React, Next.js, and other frameworks. You can use utility classes in JSX or TSX just like in HTML.",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 p-4 sm:p-6 md:p-12">
      <div className="max-w-4xl w-full mx-auto flex-1 flex flex-col">
       
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-8 text-indigo-600 text-center sm:text-left">
          Tailwind CSS FAQ
        </h1>

        
        <div className="space-y-4 mb-10">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="bg-white p-4 rounded-xl shadow hover:shadow-lg transition-shadow"
            >
              <button
                onClick={() =>
                  setOpenIndex(openIndex === index ? null : index)
                }
                className="w-full text-left flex justify-between items-center"
              >
                <span className="font-semibold text-lg">{faq.question}</span>
                <span className="text-indigo-500 font-bold text-xl">
                  {openIndex === index ? "-" : "+"}
                </span>
              </button>
              {openIndex === index && (
                <p className="mt-2 text-gray-700">{faq.answer}</p>
              )}
            </div>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <button
            onClick={() => markPageAsRead(pageSlug)}
            disabled={completed || !canRead}
            className={`px-6 py-3 rounded shadow text-white text-lg ${
              completed || !canRead
                ? "bg-gray-300 cursor-not-allowed"
                : "bg-green-500 hover:bg-green-600"
            } disabled:opacity-50 transition-colors`}
          >
            {completed ? "Already Read" : "I've read it"}
          </button>
        </div>

        <div className="text-sm sm:text-base text-slate-600">Progress: {percent}%</div>
      </div>
    </div>
  );
}
