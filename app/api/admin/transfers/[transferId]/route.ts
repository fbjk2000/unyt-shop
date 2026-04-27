import { NextRequest, NextResponse } from "next/server";
import {
  TransferServiceError,
  updateTransferRequestForAdmin,
} from "@/lib/server/transfer-service";
import { SUPERADMIN_SESSION_COOKIE, type TransferRequestStatus } from "@/lib/server/supporter-store";

export const runtime = "nodejs";

export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ transferId: string }> },
) {
  try {
    const sessionToken = request.cookies.get(SUPERADMIN_SESSION_COOKIE)?.value;
    const params = await context.params;
    const body = (await request.json()) as Partial<{
      status: TransferRequestStatus;
      statusNote: string;
      adminNotes: string;
    }>;

    const transfer = await updateTransferRequestForAdmin(sessionToken, params.transferId, {
      status: body.status,
      statusNote: body.statusNote,
      adminNotes: body.adminNotes,
    });

    return NextResponse.json({
      ok: true,
      message: "Transfer request updated.",
      transfer,
    });
  } catch (error) {
    if (error instanceof TransferServiceError) {
      return NextResponse.json({ ok: false, message: error.message }, { status: error.status });
    }

    return NextResponse.json({ ok: false, message: "Unable to update transfer request." }, { status: 500 });
  }
}
