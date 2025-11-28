import { NextResponse } from "next/server";

export async function GET() {
  const now = new Date();

  const days: { day: string; ping: number; status: string }[] = [];

  for (let i = 6; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(now.getDate() - i);

    let ping = -1;
    let status = "down";

    if (i === 0) {
      ping = await pingServer();
      status = classifyPing(ping);
    }
    days.push({
      day: date.toISOString().split("T")[0],
      ping,
      status,
    });
  }

  return NextResponse.json({ days });
}

async function pingServer(): Promise<number> {
  try {
    const start = Date.now();
    await fetch("https://nextjs-documentaion.liara.run/api/alive");
    return Date.now() - start;
  } catch {
    return -1;
  }
}

function classifyPing(ping: number) {
  if (ping === -1) return "down";
  if (ping < 200) return "good";
  if (ping < 400) return "slow";
  return "degraded";
}
