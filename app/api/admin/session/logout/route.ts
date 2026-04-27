import { NextRequest, NextResponse } from "next/server";
import { logoutSuperadmin } from "@/lib/server/admin-service";
import { SUPERADMIN_SESSION_COOKIE } from "@/lib/server/supporter-store";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  const sessionToken = request.cookies.get(SUPERADMIN_SESSION_COOKIE)?.value;
  const result = await logoutSuperadmin(sessionToken);

  const response = NextResponse.json({
    ok: result.ok,
    message: result.message,
  });

  response.cookies.set(SUPERADMIN_SESSION_COOKIE, "", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 0,
  });

  return response;
}
