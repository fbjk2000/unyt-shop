import Link from "next/link";
import { cn } from "@/lib/utils";

const variants = {
  primary:
    "bg-[var(--foreground)] text-[#0b1020] shadow-[0_20px_40px_rgba(247,244,238,0.12)] hover:bg-white",
  secondary:
    "border border-[var(--border-strong)] bg-white/5 text-[var(--foreground)] hover:bg-white/10",
  ghost: "text-[var(--foreground)] hover:bg-white/8",
  accent:
    "border border-[rgba(79,124,255,0.24)] bg-[var(--accent-soft)] text-white hover:bg-[rgba(79,124,255,0.26)]",
} as const;

type ButtonProps = {
  href?: string;
  variant?: keyof typeof variants;
  className?: string;
  type?: "button" | "submit" | "reset";
  children: React.ReactNode;
};

const baseClassName =
  "relative inline-flex min-h-11 items-center justify-center overflow-hidden rounded-full px-5 py-3 text-sm font-semibold tracking-[-0.01em]";

export function Button({
  href,
  variant = "primary",
  className,
  type = "button",
  children,
}: ButtonProps) {
  const composedClassName = cn(baseClassName, variants[variant], className);

  if (href) {
    return (
      <Link href={href} className={composedClassName}>
        <span className="absolute inset-x-5 top-0 h-px bg-gradient-to-r from-transparent via-white/70 to-transparent opacity-80" />
        <span className="relative z-10">{children}</span>
      </Link>
    );
  }

  return (
    <button type={type} className={composedClassName}>
      <span className="absolute inset-x-5 top-0 h-px bg-gradient-to-r from-transparent via-white/70 to-transparent opacity-80" />
      <span className="relative z-10">{children}</span>
    </button>
  );
}
