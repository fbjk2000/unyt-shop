import { SectionAccent } from "@/components/brand/SectionAccent";

export function HeroBackdrop() {
  return (
    <>
      <SectionAccent variant="hero" />
      <div className="hero-dot-grid absolute inset-0 opacity-[0.04]" />
    </>
  );
}
