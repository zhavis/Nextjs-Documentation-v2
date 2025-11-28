import { NextResponse } from "next/server";
import { connectDB } from "../../../dbConfig/dbConfig";
import Status from "../../../models/status";

export async function GET() {
  await connectDB();

  const now = new Date();
  const today = now.toISOString().split("T")[0];

  const ping = await pingServer();
  const status = classifyPing(ping);

  await Status.findOneAndUpdate(
    { day: today },
    { ping, status },
    { upsert: true, new: true }
  );

  const pastDays = await Status.find({})
    .sort({ day: 1 })
    .limit(7)
    .lean();

  return NextResponse.json({ days: pastDays });
}

async function pingServer(): Promise<number> {
  try {
    const start = Date.now();
    const res = await fetch(`${process.env.BASE_URL}/api/alive`);
    if (!res.ok) throw new Error("Ping failed");
    return Date.now() - start;
  } catch {
    return -1;
  }
}

function classifyPing(ping: number): string {
  if (ping === -1) return "down";
  if (ping < 200) return "good";
  if (ping < 400) return "slow";
  return "degraded";
}
