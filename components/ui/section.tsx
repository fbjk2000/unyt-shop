import { cn } from "@/lib/utils";
import { SectionAccent } from "@/components/brand/SectionAccent";
import { Eyebrow } from "@/components/ui/eyebrow";

export function Section({
  id,
  eyebrow,
  title,
  body,
  className,
  children,
}: {
  id?: string;
  eyebrow?: string;
  title?: string;
  body?: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className={cn("shell relative py-12 sm:py-16 lg:py-20", className)}>
      <SectionAccent variant="section" />
      {(eyebrow || title || body) && (
        <div className="relative mb-8 max-w-3xl space-y-4 sm:mb-10">
          {eyebrow ? <Eyebrow>{eyebrow}</Eyebrow> : null}
          {title ? (
            <h2 className="text-3xl font-medium tracking-[-0.05em] text-white sm:text-4xl lg:text-5xl">
              {title}
            </h2>
          ) : null}
          {body ? <p className="text-base leading-7 text-[var(--muted)] sm:text-lg">{body}</p> : null}
          <div className="brand-outline-divider" />
        </div>
      )}
      <div className="relative">{children}</div>
    </section>
  );
}
