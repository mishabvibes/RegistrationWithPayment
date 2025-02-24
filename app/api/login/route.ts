// app/api/login/route.ts
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const { username, password } = await request.json();

  const adminUsername = process.env.ADMIN_USERNAME;
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (username === adminUsername && password === adminPassword) {
    return NextResponse.json({ success: true });
  } else {
    return NextResponse.json({ success: false, error: "Invalid credentials" }, { status: 401 });
  }
}