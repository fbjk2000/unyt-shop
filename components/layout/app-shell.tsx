import Link from "next/link";
import { cn } from "@/lib/utils";
import { BrandLogo } from "@/components/brand/BrandLogo";
import { SectionAccent } from "@/components/brand/SectionAccent";
import { MobileBottomActionBar } from "@/components/marketing/mobile-bottom-action-bar";

const items = [
  { href: "/app/wallet", label: "Wallet" },
  { href: "/app/swap", label: "Swap" },
  { href: "/app/activity", label: "Activity" },
  { href: "/app/settings", label: "Settings" },
] as const;

export function AppShell({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen overflow-hidden bg-[radial-gradient(circle_at_top,_rgba(79,124,255,0.16),_transparent_30%),linear-gradient(180deg,_#08101d_0%,_#0b1020_100%)]">
      <a href="#app-main-content" className="skip-link">
        Skip to content
      </a>
      <header className="relative overflow-hidden border-b border-white/8 bg-[#08101d]/86 backdrop-blur-xl">
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[rgba(140,215,255,0.75)] to-transparent" />
        <div className="shell relative flex min-h-18 items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <BrandLogo variant="mark" className="h-10 w-10" alt="UNYTs" />
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--muted)]">
                app.unyt.shop
              </p>
              <h1 className="mt-2 text-lg font-semibold text-white">{title}</h1>
            </div>
          </div>
          <Link href="/" className="text-sm text-[var(--muted)] hover:text-white">
            Back to site
          </Link>
        </div>
      </header>
      <div className="shell grid gap-6 py-6 lg:grid-cols-[220px_minmax(0,1fr)] lg:py-8">
        <aside className="subtle-card relative hidden overflow-hidden p-3 lg:block">
          <SectionAccent variant="panel" />
          <nav aria-label="App">
            <ul className="space-y-1">
              {items.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={cn(
                      "flex min-h-11 items-center rounded-2xl px-4 text-sm text-[var(--muted)] hover:bg-white/6 hover:text-white",
                    )}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </aside>
        <main id="app-main-content" className="space-y-4 pb-24 md:pb-6">
          <div className="flex gap-2 overflow-x-auto pb-1 lg:hidden">
            {items.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm whitespace-nowrap text-[var(--muted)] hover:text-white"
              >
                {item.label}
              </Link>
            ))}
          </div>
          <div className="flex flex-col gap-2 px-1">
            <p className="text-sm text-[var(--muted)]">{description}</p>
          </div>
          {children}
        </main>
      </div>
      <MobileBottomActionBar />
    </div>
  );
}
