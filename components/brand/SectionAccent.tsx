import { cn } from "@/lib/utils";
import { BrandMotif } from "@/components/brand/BrandMotif";

type AccentVariant = "hero" | "section" | "panel" | "footer" | "security";

export function SectionAccent({
  variant,
  className,
}: {
  variant: AccentVariant;
  className?: string;
}) {
  if (variant === "hero") {
    return (
      <div className={cn("pointer-events-none absolute inset-0 overflow-hidden", className)}>
        <div className="absolute inset-x-[-12%] top-[-18%] h-[62%] rounded-full bg-[radial-gradient(circle,_rgba(79,124,255,0.22),_rgba(79,124,255,0)_68%)] blur-3xl" />
        <BrandMotif
          variant="halo"
          className="absolute right-[-16%] top-[-8%] hidden h-[38rem] w-[38rem] opacity-60 lg:block"
        />
      </div>
    );
  }

  if (variant === "panel") {
    return (
      <div className={cn("pointer-events-none absolute inset-0 overflow-hidden", className)}>
        <BrandMotif
          variant="pattern"
          className="absolute -right-20 -top-16 h-56 w-56 opacity-[0.12]"
        />
        <BrandMotif
          variant="outline"
          className="absolute -bottom-16 left-[-2.5rem] h-40 w-40 opacity-[0.08]"
        />
      </div>
    );
  }

  if (variant === "footer") {
    return (
      <div className={cn("pointer-events-none absolute inset-0 overflow-hidden", className)}>
        <BrandMotif
          variant="pattern"
          className="absolute inset-x-0 bottom-0 h-64 w-full object-cover opacity-[0.08]"
        />
        <BrandMotif
          variant="outline"
          className="absolute right-[-7rem] top-[-3rem] h-72 w-72 opacity-[0.08]"
        />
      </div>
    );
  }

  if (variant === "security") {
    return (
      <div className={cn("pointer-events-none absolute inset-0 overflow-hidden", className)}>
        <BrandMotif
          variant="outline"
          className="absolute right-[-4rem] top-[-3rem] h-44 w-44 opacity-[0.1]"
        />
        <div className="absolute inset-y-6 left-6 w-px bg-[linear-gradient(180deg,_rgba(79,124,255,0),_rgba(79,124,255,0.55),_rgba(79,124,255,0))] opacity-80" />
      </div>
    );
  }

  return (
    <div className={cn("pointer-events-none absolute inset-0 overflow-hidden", className)}>
      <BrandMotif
        variant="outline"
        className="absolute right-[-3rem] top-[-4rem] h-36 w-36 opacity-[0.1]"
      />
      <div className="absolute inset-x-10 top-0 h-px bg-[linear-gradient(90deg,_rgba(79,124,255,0),_rgba(79,124,255,0.38),_rgba(79,124,255,0))]" />
    </div>
  );
}
