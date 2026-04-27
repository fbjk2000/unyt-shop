import { cn } from "@/lib/utils";

export function Card({
  className,
  id,
  children,
}: {
  className?: string;
  id?: string;
  children: React.ReactNode;
}) {
  return <div id={id} className={cn("card", className)}>{children}</div>;
}

export function SubtleCard({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return <div className={cn("subtle-card", className)}>{children}</div>;
}
