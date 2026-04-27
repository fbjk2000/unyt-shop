import { NextRequest, NextResponse } from "next/server";
import {
  SupporterServiceError,
  topUpSupporterBySession,
} from "@/lib/server/supporter-service";
import { SUPPORTER_SESSION_COOKIE } from "@/lib/server/supporter-store";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  try {
    const sessionToken = request.cookies.get(SUPPORTER_SESSION_COOKIE)?.value;
    const body = (await request.json()) as Partial<{ usdAmount: number; methodId: string }>;
    const result = await topUpSupporterBySession(sessionToken, {
      usdAmount: Number(body.usdAmount),
      methodId: body.methodId || "",
    });

    return NextResponse.json({
      ok: result.ok,
      message: result.message,
      state: result.state,
    });
  } catch (error) {
    if (error instanceof SupporterServiceError) {
      return NextResponse.json({ ok: false, message: error.message }, { status: error.status });
    }

    return NextResponse.json({ ok: false, message: "Unable to top up wallet." }, { status: 500 });
  }
}
