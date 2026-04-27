import { NextResponse } from "next/server";
import {
  registerOrLinkSupporter,
  SupporterServiceError,
} from "@/lib/server/supporter-service";
import { SUPPORTER_SESSION_COOKIE } from "@/lib/server/supporter-store";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as Partial<{ displayName: string; email: string }>;
    const result = await registerOrLinkSupporter({
      displayName: body.displayName || "",
      email: body.email || "",
    });

    const response = NextResponse.json({
      ok: result.ok,
      message: result.message,
      state: result.state,
    });

    if (result.sessionToken) {
      response.cookies.set(SUPPORTER_SESSION_COOKIE, result.sessionToken, {
        httpOnly: true,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
        path: "/",
        maxAge: 60 * 60 * 24 * 30,
      });
    }

    return response;
  } catch (error) {
    if (error instanceof SupporterServiceError) {
      return NextResponse.json({ ok: false, message: error.message }, { status: error.status });
    }

    return NextResponse.json(
      { ok: false, message: "Unable to register supporter account." },
      { status: 500 },
    );
  }
}
