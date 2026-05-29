import { NextRequest, NextResponse } from "next/server";
import { verifyToken, COOKIE_NAME } from "@/lib/auth";
import connectDB from "@/lib/mongodb";
import Farmer from "@/lib/models/Farmer";

function isAdmin(payload: Record<string, unknown> | null) {
  return payload && payload.role === "admin";
}

// GET — list all farmers
export async function GET(req: NextRequest) {
  const token = req.cookies.get(COOKIE_NAME)?.value;
  const payload = token ? await verifyToken(token) : null;
  if (!isAdmin(payload)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  await connectDB();
  const farmers = await Farmer.find().select("-password").sort({ createdAt: -1 });
  return NextResponse.json(farmers);
}
