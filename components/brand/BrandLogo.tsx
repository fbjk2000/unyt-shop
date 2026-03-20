import Image from "next/image";
import { cn } from "@/lib/utils";
import { brandLogos } from "@/lib/brand/assets";

type BrandLogoVariant = keyof typeof brandLogos;

export function BrandLogo({
  variant = "lockup",
  className,
  alt = "UNYTs",
  priority = false,
}: {
  variant?: BrandLogoVariant;
  className?: string;
  alt?: string;
  priority?: boolean;
}) {
  const logo = brandLogos[variant];

  return (
    <Image
      src={logo.src}
      alt={alt}
      width={logo.width}
      height={logo.height}
      priority={priority}
      className={cn("h-auto w-auto", className)}
    />
  );
}

