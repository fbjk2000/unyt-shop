import { NextResponse } from "next/server";
import { lookupTransferStatus, TransferServiceError } from "@/lib/server/transfer-service";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as Partial<{
      supporterEmail: string;
      publicReference: string;
    }>;

    const transfer = await lookupTransferStatus({
      supporterEmail: body.supporterEmail || "",
      publicReference: body.publicReference || "",
    });

    return NextResponse.json({
      ok: true,
      transfer,
    });
  } catch (error) {
    if (error instanceof TransferServiceError) {
      return NextResponse.json({ ok: false, message: error.message }, { status: error.status });
    }

    return NextResponse.json({ ok: false, message: "Transferstatus konnte nicht geladen werden." }, { status: 500 });
  }
}
