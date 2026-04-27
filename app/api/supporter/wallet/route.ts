import { NextRequest, NextResponse } from "next/server";
import { SUPPORTER_SESSION_COOKIE } from "@/lib/server/supporter-store";
import { getWalletForSession } from "@/lib/server/supporter-service";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  const sessionToken = request.cookies.get(SUPPORTER_SESSION_COOKIE)?.value;
  const result = await getWalletForSession(sessionToken);

  return NextResponse.json({
    ok: true,
    authenticated: result.authenticated,
    state: result.state,
  });
}
