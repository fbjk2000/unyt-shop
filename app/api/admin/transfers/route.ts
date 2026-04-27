import { NextRequest, NextResponse } from "next/server";
import { listTransferRequestsForAdmin, TransferServiceError } from "@/lib/server/transfer-service";
import { SUPERADMIN_SESSION_COOKIE } from "@/lib/server/supporter-store";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  try {
    const sessionToken = request.cookies.get(SUPERADMIN_SESSION_COOKIE)?.value;
    const transfers = await listTransferRequestsForAdmin(sessionToken);

    return NextResponse.json({
      ok: true,
      transfers,
    });
  } catch (error) {
    if (error instanceof TransferServiceError) {
      return NextResponse.json({ ok: false, message: error.message }, { status: error.status });
    }

    return NextResponse.json({ ok: false, message: "Unable to load transfer requests." }, { status: 500 });
  }
}
