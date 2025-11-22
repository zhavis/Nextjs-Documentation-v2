"use client";

import { useProgress } from "../api/users/progress/ProgressContext";
import Link from "next/link";

const TOTAL_PAGES = [
  "introduction",
  "getting-started",
  "guides",
  "faq",
];

export default function GuidesPage() {
  const { progressPages, markPageAsRead } = useProgress();
  const pageSlug = "guides";
  const completed = progressPages.includes(pageSlug);
  const canRead = progressPages.includes("getting-started");
  const percent = Math.round((progressPages.length / TOTAL_PAGES.length) * 100);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 p-4 sm:p-6 md:p-12">
      <div className="max-w-6xl w-full mx-auto flex-1 flex flex-col">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-8 text-indigo-600 text-center sm:text-left">
          Tailwind CSS Template Guide
        </h1>

        <div className="text-gray-700 space-y-4 mb-10 text-base sm:text-lg md:text-xl">
          <p>
            This is a full example of a simple Tailwind CSS page layout.
            You can learn how utilities combine to create modern, responsive components.
          </p>
          <p>
            The template includes header, card sections, alerts, grids, and buttons—all styled with Tailwind.
          </p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-lg mb-10 space-y-6">
          <header className="text-center">
            <h2 className="text-2xl font-bold mb-2">Welcome to Tailwind</h2>
            <p className="text-gray-600">A fully responsive page template example</p>
          </header>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-indigo-100 p-4 rounded-lg shadow hover:shadow-lg transition-shadow">
              <h3 className="font-semibold text-lg mb-2">Card 1</h3>
              <p className="text-gray-700">Use Tailwind utilities for padding, margin, and colors.</p>
            </div>
            <div className="bg-green-100 p-4 rounded-lg shadow hover:shadow-lg transition-shadow">
              <h3 className="font-semibold text-lg mb-2">Card 2</h3>
              <p className="text-gray-700">Cards can have hover effects, rounded corners, and shadows easily.</p>
            </div>
          </div>

          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-lg">
            <p className="font-bold">Alert!</p>
            <p>This is how you create an alert box using Tailwind utilities.</p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <button className="px-6 py-3 rounded bg-blue-500 text-white hover:bg-blue-600 shadow transition-colors">
              Primary Action
            </button>
            <button className="px-6 py-3 rounded bg-gray-300 text-gray-700 hover:bg-gray-400 shadow transition-colors">
              Secondary Action
            </button>
          </div>


          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
            <div className="bg-indigo-500 text-white p-4 rounded shadow text-center">1</div>
            <div className="bg-indigo-500 text-white p-4 rounded shadow text-center">2</div>
            <div className="bg-indigo-500 text-white p-4 rounded shadow text-center">3</div>
            <div className="bg-indigo-500 text-white p-4 rounded shadow text-center">4</div>
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
            href={completed ? "/faq" : "#"}
            className={`text-blue-600 hover:underline text-lg ${
              !completed ? "pointer-events-none opacity-50" : ""
            }`}
          >
            Next: FAQ
          </Link>
        </div>

        <div className="text-sm sm:text-base text-slate-600">Progress: {percent}%</div>
      </div>
    </div>
  );
}
