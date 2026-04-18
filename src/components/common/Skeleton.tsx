import { cn } from "@/utils/tw-merge";

function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "from-muted via-muted/80 to-muted animate-pulse rounded-lg bg-linear-to-r",
        className
      )}
      {...props}
    />
  );
}

export { Skeleton };
