import { NextRequest, NextResponse } from "next/server";
import User from "../../../../models/userModel";
import { connect } from "../../../../dbConfig/dbConfig";
import { getDataFromToken } from "../../../../helpers/getDataFromToken";

export async function GET(req: NextRequest) {
  try {
    await connect();

    const userId = getDataFromToken(req);
    if (!userId) return NextResponse.json({ pages: [] }, { status: 401 });

    const user = await User.findById(userId).select("progress");

    return NextResponse.json({
      pages: Array.isArray(user?.progress) ? user.progress : []
    });
  } catch (err: any) {
    console.log("GET ERROR:", err);
    return NextResponse.json({ pages: [] }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    await connect();

    const { page } = await req.json();
    if (!page) return NextResponse.json({ message: "Page required" }, { status: 400 });

    const userId = getDataFromToken(req);
    if (!userId) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const user = await User.findById(userId);
    if (!user) return NextResponse.json({ message: "User not found" }, { status: 404 });

    if (!Array.isArray(user.progress)) user.progress = [];
    if (!user.progress.includes(page)) {
      user.progress.push(page);
      await user.save();
    }

    return NextResponse.json({
      message: "Progress saved",
      pages: user.progress
    });
  } catch (err: any) {
    console.log("POST ERROR:", err);
    return NextResponse.json({ message: "Failed to save progress" }, { status: 500 });
  }
}
