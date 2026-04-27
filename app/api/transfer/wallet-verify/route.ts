import { NextResponse } from "next/server";
import { TransferServiceError, verifyTransferWalletSignature } from "@/lib/server/transfer-service";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as Partial<{
      challengeId: string;
      signature: string;
    }>;

    const transfer = await verifyTransferWalletSignature({
      challengeId: body.challengeId || "",
      signature: body.signature || "",
    });

    return NextResponse.json({
      ok: true,
      message: "Wallet-Adresse wurde per Signatur bestätigt.",
      transfer,
    });
  } catch (error) {
    if (error instanceof TransferServiceError) {
      return NextResponse.json({ ok: false, message: error.message }, { status: error.status });
    }

    return NextResponse.json({ ok: false, message: "Wallet-Signatur konnte nicht geprüft werden." }, { status: 500 });
  }
}
