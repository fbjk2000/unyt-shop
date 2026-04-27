import { NextRequest, NextResponse } from "next/server";
import {
  AdminServiceError,
  getWalletByEmailForAdmin,
  updateWalletByEmailForAdmin,
} from "@/lib/server/admin-service";
import { SUPERADMIN_SESSION_COOKIE } from "@/lib/server/supporter-store";

export const runtime = "nodejs";

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ email: string }> },
) {
  try {
    const sessionToken = request.cookies.get(SUPERADMIN_SESSION_COOKIE)?.value;
    const params = await context.params;
    const email = decodeURIComponent(params.email || "");
    const state = await getWalletByEmailForAdmin(sessionToken, email);

    return NextResponse.json({
      ok: true,
      state,
    });
  } catch (error) {
    if (error instanceof AdminServiceError) {
      return NextResponse.json({ ok: false, message: error.message }, { status: error.status });
    }

    return NextResponse.json({ ok: false, message: "Unable to load wallet." }, { status: 500 });
  }
}

export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ email: string }> },
) {
  try {
    const sessionToken = request.cookies.get(SUPERADMIN_SESSION_COOKIE)?.value;
    const params = await context.params;
    const email = decodeURIComponent(params.email || "");

    const body = (await request.json()) as Partial<{
      displayName: string;
      email: string;
      availableCredits: number;
      pendingCredits: number;
      allocationAmount: number;
      allocationStatus: "pending_identity" | "recorded";
      reason: string;
    }>;

    const state = await updateWalletByEmailForAdmin(sessionToken, email, {
      displayName: body.displayName,
      email: body.email,
      availableCredits:
        typeof body.availableCredits === "number" ? Number(body.availableCredits) : undefined,
      pendingCredits:
        typeof body.pendingCredits === "number" ? Number(body.pendingCredits) : undefined,
      allocationAmount:
        typeof body.allocationAmount === "number" ? Number(body.allocationAmount) : undefined,
      allocationStatus: body.allocationStatus,
      reason: body.reason,
    });

    return NextResponse.json({
      ok: true,
      message: "Wallet updated.",
      state,
    });
  } catch (error) {
    if (error instanceof AdminServiceError) {
      return NextResponse.json({ ok: false, message: error.message }, { status: error.status });
    }

    return NextResponse.json({ ok: false, message: "Unable to update wallet." }, { status: 500 });
  }
}
