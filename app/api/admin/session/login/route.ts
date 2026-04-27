import { NextResponse } from "next/server";
import { loginSuperadmin, AdminServiceError } from "@/lib/server/admin-service";
import { SUPERADMIN_SESSION_COOKIE } from "@/lib/server/supporter-store";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as Partial<{ email: string; password: string }>;
    const result = await loginSuperadmin({
      email: body.email || "",
      password: body.password || "",
    });

    const response = NextResponse.json({
      ok: result.ok,
      message: result.message,
      email: result.email,
      role: result.role,
    });

    if (result.sessionToken) {
      response.cookies.set(SUPERADMIN_SESSION_COOKIE, result.sessionToken, {
        httpOnly: true,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
        path: "/",
        maxAge: 60 * 60 * 12,
      });
    }

    return response;
  } catch (error) {
    if (error instanceof AdminServiceError) {
      return NextResponse.json({ ok: false, message: error.message }, { status: error.status });
    }

    return NextResponse.json({ ok: false, message: "Unable to log in as superadmin." }, { status: 500 });
  }
}
