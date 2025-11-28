"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import axios from "axios";

const STATUS_COLORS: Record<string, string> = {
  good: "bg-green-500",
  slow: "bg-lime-400",
  degraded: "bg-yellow-500",
  down: "bg-red-500",
};

export default function Home() {
  const [days, setDays] = useState<any[]>([]);
  const [current, setCurrent] = useState<any>(null);

  useEffect(() => {
    const loadStatus = async () => {
      try {
        const aliveRes = await axios.get("http://nextjs-documentaion.liara.run//api/alive");
        setCurrent(aliveRes.data);

        const statusRes = await axios.get("/api/status");
        setDays(statusRes.data.days);
      } catch (err) {
        console.error("Failed to load status:", err);
      }
    };
    loadStatus();
  }, []);

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex min-h-screen w-full max-w-3xl flex-col items-center justify-between py-32 px-16 bg-white dark:bg-black sm:items-start">
        <Image
          className="dark:invert"
          src="/next.svg"
          alt="Next.js logo"
          width={100}
          height={20}
          priority
        />

        {/* Current Status */}
        {current && (
          <div className="mt-8 p-4 w-full bg-white dark:bg-zinc-900 rounded-xl shadow-md">
            <h2 className="text-xl font-bold text-black dark:text-zinc-50">
              Current System Status
            </h2>
            <p className="mt-2 text-gray-700 dark:text-gray-300">
              Status:{" "}
              <span className={current.alive ? "text-green-600 font-bold" : "text-red-600 font-bold"}>
                {current.alive ? "🟢 Alive" : "🔴 Down"}
              </span>
            </p>
            <p className="text-gray-600 dark:text-gray-400">
              Last checked: {new Date(current.timestamp).toLocaleString()}
            </p>
          </div>
        )}

        {/* Timeline Status */}
        <div className="w-full mt-6 p-6 bg-white dark:bg-zinc-900 rounded-xl shadow-md">
          <h2 className="text-xl font-bold mb-4 text-black dark:text-zinc-50">
            System Status – Last Days
          </h2>

          <div className="flex gap-1 overflow-x-auto py-3">
            {days.map((item, idx) => (
              <div
                key={idx}
                className={`h-6 w-10 rounded-md ${STATUS_COLORS[item.status]}`}
                title={`${item.day} — ${item.status} (${item.ping}ms)`}
              />
            ))}
          </div>

          <div className="mt-4 text-sm text-gray-600 dark:text-gray-300 space-y-1">
            <p>
              <span className="inline-block w-3 h-3 rounded-full bg-green-500 mr-2 align-middle"></span>
              Good (ping &lt; 200ms)
            </p>
            <p>
              <span className="inline-block w-3 h-3 rounded-full bg-lime-400 mr-2 align-middle"></span>
              Slow (200–400ms)
            </p>
            <p>
              <span className="inline-block w-3 h-3 rounded-full bg-yellow-500 mr-2 align-middle"></span>
              Degraded (400–600ms)
            </p>
            <p>
              <span className="inline-block w-3 h-3 rounded-full bg-red-500 mr-2 align-middle"></span>
              Down
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
