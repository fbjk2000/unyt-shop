import Link from "next/link";
import { navigationItems } from "@/lib/site";
import { BrandLogo } from "@/components/brand/BrandLogo";
import { Button } from "@/components/ui/button";

export function MarketingHeader() {
  return (
    <header className="sticky top-0 z-40 overflow-hidden border-b border-white/8 bg-[#0b1020]/84 backdrop-blur-xl">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[rgba(140,215,255,0.75)] to-transparent" />
      <div className="absolute inset-x-0 bottom-0 h-20 bg-[radial-gradient(circle_at_top,_rgba(79,124,255,0.14),_rgba(79,124,255,0)_70%)]" />
      <div className="shell relative flex min-h-18 items-center justify-between gap-6">
        <Link href="/" className="flex items-center gap-3">
          <BrandLogo variant="lockup" className="h-7 w-auto sm:h-8" alt="UNYTs" priority />
        </Link>
        <nav aria-label="Primary" className="hidden items-center gap-7 md:flex">
          {navigationItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm text-[var(--muted)] hover:text-white"
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="hidden items-center gap-3 md:flex">
          <Link href="/app/wallet" className="text-sm text-[var(--muted)] hover:text-white">
            Sign in
          </Link>
          <Button href="/app/wallet">Get UNYTs</Button>
        </div>
        <div className="flex items-center gap-2 md:hidden">
          <Link href="/ecosystem" className="text-sm text-[var(--muted)] hover:text-white">
            Ecosystem
          </Link>
          <Button href="/app/wallet" variant="secondary">
            Open app
          </Button>
        </div>
      </div>
    </header>
  );
}
