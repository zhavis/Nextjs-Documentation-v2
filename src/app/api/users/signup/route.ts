import { EmailType, sendEmail } from "../../../../helpers/mailer";
import { NextRequest, NextResponse } from "next/server";
import User from "../../../../models/userModel";
import bcrypt from "bcryptjs";
import { connect } from "../../../../dbConfig/dbConfig";

connect();

export async function POST(request: NextRequest) {
  try {
    const reqBody = await request.json();
    const { username, email, password } = reqBody;

    if (!username || !email || !password) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { error: "User already exists" },
        { status: 400 }
      );
    }

    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      progress: [],
    });

    const savedUser = await newUser.save();

    try {
      await sendEmail({
        email,
        emailType: EmailType.VERIFY,
        userId: savedUser._id,
      });
    } catch (err) {
      console.error("Verification email failed:", err);
    }

    const userObj = savedUser.toObject();
    delete userObj.password;

    return NextResponse.json({
      message: "User registered successfully",
      success: true,
      user: userObj,
    });
  } catch (error: any) {
    console.error("Registration error:", error);
    return NextResponse.json({ error: error.message || "Registration failed" }, { status: 500 });
  }
}
