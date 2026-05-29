import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { connectDB } from "@/lib/mongodb";
import Farmer from "@/lib/models/Farmer";
import { signToken, FARMER_COOKIE_NAME } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password required" }, { status: 400 });
    }

    await connectDB();

    const farmer = await Farmer.findOne({ email: email.toLowerCase() });
    if (!farmer) {
      return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
    }

    const valid = await bcrypt.compare(password, farmer.password);
    if (!valid) {
      return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
    }

    if (farmer.status === "pending") {
      return NextResponse.json({ error: "Your account is pending approval by the admin." }, { status: 403 });
    }

    if (farmer.status === "rejected") {
      return NextResponse.json({ error: "Your registration was rejected. Contact support." }, { status: 403 });
    }

    const token = await signToken({
      id: farmer._id.toString(),
      email: farmer.email,
      name: farmer.name,
      role: "farmer",
    });

    const res = NextResponse.json({ success: true });
    res.cookies.set(FARMER_COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 12,
      path: "/",
    });

    return res;
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function DELETE() {
  const res = NextResponse.json({ success: true });
  res.cookies.set(FARMER_COOKIE_NAME, "", { maxAge: 0, path: "/" });
  return res;
}
