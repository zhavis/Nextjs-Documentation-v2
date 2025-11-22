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

export default function IntroductionPage() {
  const { progressPages, markPageAsRead } = useProgress();
  const pageSlug = "introduction";
  const hasRead = progressPages.includes(pageSlug);

  const percent = Math.round((progressPages.length / TOTAL_PAGES.length) * 100);

  const [clicked, setClicked] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 p-4 sm:p-6 md:p-12">
      <div className="max-w-5xl w-full mx-auto flex-1 flex flex-col">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-8 text-indigo-600 text-center sm:text-left">
          Introduction to Tailwind CSS
        </h1>

        <div className="text-gray-700 space-y-4 mb-10 text-base sm:text-lg md:text-xl">
          <p>
            Tailwind CSS is a <strong>utility-first CSS framework</strong> that allows you to rapidly build modern websites without leaving your HTML.
          </p>
          <p>
            Instead of writing custom CSS, you compose your design directly in your markup using predefined utility classes.
          </p>
          <p>
            With Tailwind, you can easily control <strong>layout, spacing, typography, colors, and responsiveness</strong> using simple classes.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
          <div className="bg-white p-6 rounded-xl shadow-lg flex flex-col items-center">
            <h2 className="text-2xl font-semibold mb-3">Animated Button</h2>
            <p className="text-gray-600 mb-2">Live Example:</p>
            <button
              onClick={() => {
                setClicked(true);
                setTimeout(() => setClicked(false), 300);
              }}
              className={`
                px-6 py-3 rounded shadow text-white font-medium
                transition-transform transform
                ${clicked ? "scale-95 bg-blue-600" : "bg-blue-500 hover:bg-blue-600"}
              `}
            >
              {clicked ? "Clicked!" : "Click me"}
            </button>
            <p className="text-gray-600 mt-3 text-center">
              Hover and click the button to see the animation
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-lg flex flex-col items-center">
            <h2 className="text-2xl font-semibold mb-3">Animated Card</h2>
            <p className="text-gray-600 mb-2">Live Example:</p>
            <div className="p-4 max-w-sm w-full bg-white rounded-xl shadow-md flex items-center space-x-4
                            transform transition-transform duration-300 hover:scale-105 hover:shadow-xl">
              <div>
                <div className="text-xl font-medium text-black">Hello Tailwind</div>
                <p className="text-gray-500">Hover over this card!</p>
              </div>
            </div>
            <p className="text-gray-600 mt-3 text-center">
              Smooth hover animation using Tailwind utility classes
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <button
            onClick={() => markPageAsRead(pageSlug)}
            disabled={hasRead}
            className={`px-6 py-3 rounded shadow text-white text-lg ${
              hasRead
                ? "bg-gray-300 cursor-not-allowed"
                : "bg-green-500 hover:bg-green-600"
            } disabled:opacity-50 transition-colors`}
          >
            {hasRead ? "Already Read" : "I've read it"}
          </button>

          <Link
            href="/getting-started"
            className={`text-blue-600 hover:underline text-lg ${
              !hasRead ? "pointer-events-none opacity-50" : ""
            }`}
          >
            Next: Getting Started
          </Link>
        </div>

        <div className="text-sm sm:text-base text-slate-600">Progress: {percent}%</div>
      </div>
    </div>
  );
}
