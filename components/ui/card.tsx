import { cn } from "@/lib/utils";
import { SectionAccent } from "@/components/brand/SectionAccent";

export function Card({
  className,
  id,
  children,
}: {
  className?: string;
  id?: string;
  children: React.ReactNode;
}) {
  return (
    <div id={id} className={cn("card relative overflow-hidden", className)}>
      <SectionAccent variant="panel" />
      <div className="absolute inset-x-5 top-0 h-px bg-gradient-to-r from-transparent via-white/60 to-transparent opacity-70" />
      <div className="absolute right-5 top-5 h-11 w-11 rounded-[18px] border border-[rgba(79,124,255,0.18)] bg-[radial-gradient(circle,_rgba(79,124,255,0.18),_rgba(79,124,255,0)_72%)] opacity-90" />
      <div className="relative">{children}</div>
    </div>
  );
}

export function SubtleCard({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={cn("subtle-card relative overflow-hidden", className)}>
      <div className="absolute inset-x-4 top-0 h-px bg-gradient-to-r from-transparent via-[rgba(140,215,255,0.65)] to-transparent opacity-60" />
      <div className="absolute right-4 top-4 h-6 w-6 rounded-full border border-[rgba(79,124,255,0.16)]" />
      <div className="relative">{children}</div>
    </div>
  );
}
