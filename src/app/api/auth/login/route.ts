import { NextResponse } from "next/server";
import { verifyPassword, setSessionCookie } from "@/lib/auth";

export async function POST(request: Request) {
  const { password } = await request.json();

  const valid = await verifyPassword(password);
  if (!valid) {
    return NextResponse.json(
      { error: "パスワードが正しくありません" },
      { status: 401 }
    );
  }

  setSessionCookie();
  return NextResponse.json({ success: true });
}
