import { NextRequest, NextResponse } from "next/server";
import { AdminServiceError, listAdminAuditLogsForAdmin } from "@/lib/server/admin-service";
import { SUPERADMIN_SESSION_COOKIE } from "@/lib/server/supporter-store";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  try {
    const sessionToken = request.cookies.get(SUPERADMIN_SESSION_COOKIE)?.value;
    const logs = await listAdminAuditLogsForAdmin(sessionToken);

    return NextResponse.json({
      ok: true,
      logs,
    });
  } catch (error) {
    if (error instanceof AdminServiceError) {
      return NextResponse.json({ ok: false, message: error.message }, { status: error.status });
    }

    return NextResponse.json({ ok: false, message: "Unable to load admin audit logs." }, { status: 500 });
  }
}
