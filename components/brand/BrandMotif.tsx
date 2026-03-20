import Image from "next/image";
import { cn } from "@/lib/utils";
import { brandMotifs } from "@/lib/brand/assets";

type BrandMotifVariant = keyof typeof brandMotifs;

export function BrandMotif({
  variant,
  className,
}: {
  variant: BrandMotifVariant;
  className?: string;
}) {
  return (
    <Image
      src={brandMotifs[variant]}
      alt=""
      aria-hidden="true"
      width={900}
      height={900}
      className={cn("pointer-events-none select-none", className)}
    />
  );
}

