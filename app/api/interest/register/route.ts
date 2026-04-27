import { NextResponse } from "next/server";
import {
  InterestLeadServiceError,
  registerInterestLead,
} from "@/lib/server/interest-lead-service";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as Partial<{
      sourcePage: string;
      firstName: string;
      lastName: string;
      email: string;
      company: string;
      countryRegion: string;
      interestIn: string;
      interestFocus: unknown;
      message: string;
    }>;

    const result = await registerInterestLead(body);

    return NextResponse.json({
      ok: true,
      message: result.message,
      leadId: result.leadId,
      source: body.sourcePage,
      createdAt: result.createdAt,
      routedToEarnrm: result.forwarded.ok,
    });
  } catch (error) {
    if (error instanceof InterestLeadServiceError) {
      return NextResponse.json({ ok: false, message: error.message }, { status: error.status });
    }

    return NextResponse.json(
      { ok: false, message: "Unable to register interest right now." },
      { status: 500 },
    );
  }
}
