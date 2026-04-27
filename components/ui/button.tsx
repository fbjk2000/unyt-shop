import type { MouseEventHandler } from "react";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

const variants = {
  primary:
    "bg-[var(--foreground)] !text-[#0b1020] shadow-[0_20px_40px_rgba(247,244,238,0.12)] hover:bg-white",
  brand:
    "bg-[#4a9eff] !text-white shadow-[0_16px_36px_rgba(74,158,255,0.42)] hover:bg-[#6aafff]",
  secondary:
    "border border-[var(--border-strong)] bg-white/5 !text-[var(--foreground)] hover:bg-white/10",
  ghost: "!text-[var(--foreground)] hover:bg-white/8",
  accent:
    "border border-[rgba(79,124,255,0.24)] bg-[var(--accent-soft)] !text-white hover:bg-[rgba(79,124,255,0.26)]",
} as const;

type ButtonProps = {
  href?: string;
  variant?: keyof typeof variants;
  className?: string;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
  onClick?: MouseEventHandler<HTMLButtonElement>;
  children: React.ReactNode;
};

const baseClassName =
  "relative inline-flex min-h-11 items-center justify-center overflow-hidden rounded-full px-5 py-3 text-sm font-semibold tracking-[-0.01em] disabled:cursor-not-allowed disabled:opacity-55";

export function Button({
  href,
  variant = "primary",
  className,
  type = "button",
  disabled = false,
  onClick,
  children,
}: ButtonProps) {
  const composedClassName = cn(
    baseClassName,
    variants[variant],
    disabled && href ? "pointer-events-none opacity-55" : "",
    className,
  );

  if (href) {
    if (href.startsWith("/api/")) {
      return (
        <a href={href} className={composedClassName} aria-disabled={disabled}>
          <span className="absolute inset-x-5 top-0 h-px bg-gradient-to-r from-transparent via-white/70 to-transparent opacity-80" />
          <span className="relative z-10">{children}</span>
        </a>
      );
    }

    return (
      <Link href={href} className={composedClassName} aria-disabled={disabled}>
        <span className="absolute inset-x-5 top-0 h-px bg-gradient-to-r from-transparent via-white/70 to-transparent opacity-80" />
        <span className="relative z-10">{children}</span>
      </Link>
    );
  }

  return (
    <button type={type} className={composedClassName} disabled={disabled} onClick={onClick}>
      <span className="absolute inset-x-5 top-0 h-px bg-gradient-to-r from-transparent via-white/70 to-transparent opacity-80" />
      <span className="relative z-10">{children}</span>
    </button>
  );
}
