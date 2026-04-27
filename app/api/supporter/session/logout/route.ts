import { NextRequest, NextResponse } from "next/server";
import { logoutSupporter } from "@/lib/server/supporter-service";
import { SUPPORTER_SESSION_COOKIE } from "@/lib/server/supporter-store";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  const sessionToken = request.cookies.get(SUPPORTER_SESSION_COOKIE)?.value;
  const result = await logoutSupporter(sessionToken);

  const response = NextResponse.json({
    ok: result.ok,
    message: result.message,
    state: result.state,
  });

  response.cookies.set(SUPPORTER_SESSION_COOKIE, "", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 0,
  });

  return response;
}
