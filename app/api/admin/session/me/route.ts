import { NextRequest, NextResponse } from "next/server";
import { getAdminCapabilities, getSuperadminSession } from "@/lib/server/admin-service";
import { SUPERADMIN_SESSION_COOKIE } from "@/lib/server/supporter-store";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  const sessionToken = request.cookies.get(SUPERADMIN_SESSION_COOKIE)?.value;
  const session = await getSuperadminSession(sessionToken);

  if (!session.authenticated) {
    return NextResponse.json({
      ok: true,
      authenticated: false,
      email: null,
      role: null,
      maxBalanceDeltaPerEdit: null,
    });
  }

  const capabilities = await getAdminCapabilities(sessionToken);

  return NextResponse.json({
    ok: true,
    authenticated: true,
    email: capabilities.adminEmail,
    role: capabilities.adminRole,
    maxBalanceDeltaPerEdit: capabilities.maxBalanceDeltaPerEdit,
  });
}
