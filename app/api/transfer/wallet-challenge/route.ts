import { NextResponse } from "next/server";
import { createTransferWalletChallenge, TransferServiceError } from "@/lib/server/transfer-service";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as Partial<{
      supporterEmail: string;
      walletAddress: string;
    }>;

    const challenge = await createTransferWalletChallenge({
      supporterEmail: body.supporterEmail || "",
      walletAddress: body.walletAddress || "",
    });

    return NextResponse.json({
      ok: true,
      challenge,
    });
  } catch (error) {
    if (error instanceof TransferServiceError) {
      return NextResponse.json({ ok: false, message: error.message }, { status: error.status });
    }

    return NextResponse.json({ ok: false, message: "Wallet-Challenge konnte nicht erstellt werden." }, { status: 500 });
  }
}
