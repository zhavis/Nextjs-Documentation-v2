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

export default function GettingStartedPage() {
  const { progressPages, markPageAsRead } = useProgress();
  const pageSlug = "getting-started";
  const completed = progressPages.includes(pageSlug);
  const canRead = progressPages.includes("introduction");
  const percent = Math.round((progressPages.length / TOTAL_PAGES.length) * 100);

  const [clickedButton, setClickedButton] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 p-4 sm:p-6 md:p-12">
      <div className="max-w-5xl w-full mx-auto flex-1 flex flex-col">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-8 text-indigo-600 text-center sm:text-left">
          Getting Started with Tailwind CSS
        </h1>

        <div className="text-gray-700 space-y-4 mb-10 text-base sm:text-lg md:text-xl">
         <p>
  Now that you&apos;ve seen the basics, let&apos;s explore some practical examples and animations.
  Tailwind makes it easy to create modern, responsive, and interactive components quickly.
</p>
<p>
  We&apos;ll cover buttons, cards, grids, alerts, and how to add simple animations and transitions.
</p>

        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">

          <div className="bg-white p-6 rounded-xl shadow-lg flex flex-col items-center">
            <h2 className="text-2xl font-semibold mb-3">Interactive Button</h2>
            <p className="text-gray-600 mb-2">Click me to see animation:</p>
            <button
              onClick={() => {
                setClickedButton(true);
                setTimeout(() => setClickedButton(false), 300);
              }}
              className={`
                px-6 py-3 rounded shadow text-white font-medium
                transition-transform transform
                ${clickedButton ? "scale-95 bg-blue-600" : "bg-blue-500 hover:bg-blue-600"}
              `}
            >
              {clickedButton ? "Clicked!" : "Click me"}
            </button>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-lg flex flex-col items-center">
            <h2 className="text-2xl font-semibold mb-3">Responsive Card</h2>
            <div className="p-4 max-w-sm w-full bg-white rounded-xl shadow-md flex items-center space-x-4
                            transform transition-transform duration-300 hover:scale-105 hover:shadow-xl">
              <div>
                <div className="text-xl font-medium text-black">Tailwind Card</div>
                <p className="text-gray-500">Hover over me!</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-lg flex flex-col items-center">
            <h2 className="text-2xl font-semibold mb-3">Alert Box</h2>
            <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 w-full rounded-lg">
              <p className="font-bold">Error</p>
              <p>Something went wrong. Try again!</p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-lg flex flex-col items-center">
            <h2 className="text-2xl font-semibold mb-3">Responsive Grid</h2>
            <div className="grid grid-cols-2 gap-4 w-full">
              <div className="bg-indigo-500 text-white p-4 rounded shadow">1</div>
              <div className="bg-indigo-500 text-white p-4 rounded shadow">2</div>
              <div className="bg-indigo-500 text-white p-4 rounded shadow">3</div>
              <div className="bg-indigo-500 text-white p-4 rounded shadow">4</div>
            </div>
          </div>
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

          <Link
            href={completed ? "/guides" : "#"}
            className={`text-blue-600 hover:underline text-lg ${
              !completed ? "pointer-events-none opacity-50" : ""
            }`}
          >
            Next: Guides
          </Link>
        </div>

        <div className="text-sm sm:text-base text-slate-600">Progress: {percent}%</div>
      </div>
    </div>
  );
}
