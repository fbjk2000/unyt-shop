import { NextResponse } from "next/server";
import { createTransferRequest, TransferServiceError } from "@/lib/server/transfer-service";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as Partial<{
      supporterEmail: string;
      displayName: string;
      walletAddress: string;
      supportNotes: string;
      consent: boolean;
    }>;

    const transfer = await createTransferRequest({
      supporterEmail: body.supporterEmail || "",
      displayName: body.displayName,
      walletAddress: body.walletAddress || "",
      supportNotes: body.supportNotes,
      consent: Boolean(body.consent),
    });

    return NextResponse.json({
      ok: true,
      message: "Transferanfrage wurde erfasst.",
      transfer,
    });
  } catch (error) {
    if (error instanceof TransferServiceError) {
      return NextResponse.json({ ok: false, message: error.message }, { status: error.status });
    }

    return NextResponse.json({ ok: false, message: "Transferanfrage konnte nicht gespeichert werden." }, { status: 500 });
  }
}
