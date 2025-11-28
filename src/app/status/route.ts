import { NextResponse } from "next/server";

export async function GET() {
  const daysCount = 7;
  const now = new Date();
  const days: { day: string; ping: number; status: string }[] = [];

  for (let i = daysCount - 1; i >= 0; i--) {
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
