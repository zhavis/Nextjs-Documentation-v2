import { NextRequest, NextResponse } from "next/server";
import User from "../../../../models/userModel";
import { connect } from "../../../../dbConfig/dbConfig";
import { getDataFromToken } from "../../../../helpers/getDataFromToken";

connect();

export async function GET(req: NextRequest) {
  const userId = getDataFromToken(req);
  if (!userId) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  const user = await User.findById(userId).select("-password");
  if (!user) return NextResponse.json({ message: "User not found" }, { status: 404 });

  return NextResponse.json({ data: user });
}

export async function PUT(req: NextRequest) {
  const userId = getDataFromToken(req);
  if (!userId) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  const { username, email } = await req.json();
  if (!username || !email)
    return NextResponse.json({ message: "Username and email required" }, { status: 400 });

  const updatedUser = await User.findByIdAndUpdate(
    userId,
    { username, email },
    { new: true, select: "-password" }
  );

  if (!updatedUser) return NextResponse.json({ message: "User not found" }, { status: 404 });

  return NextResponse.json({ data: updatedUser });
}
