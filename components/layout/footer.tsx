import Link from "next/link";
import { navigationItems } from "@/lib/site";
import { BrandLogo } from "@/components/brand/BrandLogo";
import { SectionAccent } from "@/components/brand/SectionAccent";

export function Footer() {
  return (
    <footer className="relative mt-24 overflow-hidden border-t border-white/8 pb-28 pt-12 md:pb-16">
      <SectionAccent variant="footer" />
      <div className="shell relative flex flex-col gap-10 md:flex-row md:items-end md:justify-between">
        <div className="max-w-md space-y-4">
          <BrandLogo variant="lockup" className="h-8 w-auto" alt="UNYTs" />
          <p className="text-sm leading-6 text-[var(--muted)]">
            One balance across every product. Built for payments, access, and a calmer way
            to move across the ecosystem.
          </p>
          <div className="brand-outline-divider" />
        </div>
        <div className="flex flex-wrap gap-4 text-sm text-[var(--muted)]">
          {navigationItems.map((item) => (
            <Link key={item.href} href={item.href} className="hover:text-white">
              {item.label}
            </Link>
          ))}
        </div>
      </div>
    </footer>
  );
}
