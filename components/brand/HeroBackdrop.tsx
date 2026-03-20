import { SectionAccent } from "@/components/brand/SectionAccent";
import { BrandMotif } from "@/components/brand/BrandMotif";

export function HeroBackdrop() {
  return (
    <>
      <SectionAccent variant="hero" />
      <BrandMotif
        variant="pattern"
        className="absolute inset-x-0 bottom-[-10rem] h-80 w-full object-cover opacity-[0.08] sm:bottom-[-6rem]"
      />
    </>
  );
}

