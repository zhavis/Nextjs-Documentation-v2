import { NextResponse } from "next/server";

export async function GET() {
  // Only track past 5–7 days since your app is new
  const now = new Date();
  const days: { day: string; ping: number; status: string }[] = [];

  for (let i = 6; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(now.getDate() - i);

    // Simulate ping for past days
    const ping = Math.floor(Math.random() * 600); // 0–600ms
    const status = classifyPing(ping);

    days.push({
      day: date.toISOString().split("T")[0],
      ping,
      status,
    });
  }

  return NextResponse.json({ days });
}

// Classify ping into 4 statuses
function classifyPing(ping: number) {
  if (ping < 200) return "good";
  if (ping < 400) return "slow";
  if (ping < 600) return "degraded";
  return "down";
}
