import { NextRequest, NextResponse } from "next/server";
import {
  importTransferSupportersForAdmin,
  TransferServiceError,
} from "@/lib/server/transfer-service";
import { SUPERADMIN_SESSION_COOKIE } from "@/lib/server/supporter-store";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  try {
    const sessionToken = request.cookies.get(SUPERADMIN_SESSION_COOKIE)?.value;
    const body = (await request.json()) as {
      records?: Array<{
        supporterEmail: string;
        displayName?: string;
        sourceSystem?: string;
        sourceReference?: string;
        allocationAmount?: number | string | null;
        allocationUnit?: string;
        transferEligibility?: "eligible" | "hold" | "blocked";
        currentWalletAddress?: string | null;
        notes?: string;
      }>;
    };

    const summary = await importTransferSupportersForAdmin(sessionToken, body.records || []);

    return NextResponse.json({
      ok: true,
      message: "Transfer supporter records imported.",
      summary,
    });
  } catch (error) {
    if (error instanceof TransferServiceError) {
      return NextResponse.json({ ok: false, message: error.message }, { status: error.status });
    }

    return NextResponse.json({ ok: false, message: "Unable to import transfer supporter records." }, { status: 500 });
  }
}
