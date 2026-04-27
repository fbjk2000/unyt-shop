import createMiddleware from "next-intl/middleware";
import { type NextRequest, NextResponse } from "next/server";
import { routing } from "@/i18n/routing";

const intlMiddleware = createMiddleware(routing);

export default function middleware(request: NextRequest) {
  const host = request.headers.get("host")?.split(":")[0].toLowerCase();

  if (host === "transfer.unyt.shop") {
    const url = request.nextUrl.clone();
    const pathname = url.pathname.replace(/\/$/, "");

    if (pathname === "" || pathname === "/de") {
      url.pathname = "/de/transfer";
      return NextResponse.redirect(url);
    }

    if (pathname === "/en") {
      url.pathname = "/en/transfer";
      return NextResponse.redirect(url);
    }
  }

  return intlMiddleware(request);
}

export const config = {
  matcher: ["/((?!api|_next|_vercel|.*\\..*).*)"],
};
