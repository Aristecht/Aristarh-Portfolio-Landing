// components/ui/spinner.tsx
import { Loader2Icon } from "lucide-react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/utils/tw-merge";

const spinnerVariants = cva("animate-spin", {
  variants: {
    size: {
      xs: "size-3",
      sm: "size-4",
      default: "size-5",
      lg: "size-6",
      xl: "size-8",
      "2xl": "size-12",
    },
    variant: {
      default: "text-muted-foreground",
      primary: "text-primary",
      orange: "text-primary",
      white: "text-white",
      current: "text-current",
    },
  },
  defaultVariants: {
    size: "default",
    variant: "default",
  },
});

export interface SpinnerProps
  extends React.ComponentProps<"svg">, VariantProps<typeof spinnerVariants> {}

function Spinner({ className, size, variant, ...props }: SpinnerProps) {
  return (
    <Loader2Icon
      role="status"
      aria-label="Loading"
      className={cn(spinnerVariants({ size, variant }), className)}
      {...props}
    />
  );
}

function DotsSpinner({ className }: { className?: string }) {
  return (
    <div
      role="status"
      aria-label="Loading"
      className={cn("flex items-center gap-1", className)}
    >
      <div className="size-2 animate-bounce rounded-full bg-current [animation-delay:-0.3s]" />
      <div className="size-2 animate-bounce rounded-full bg-current [animation-delay:-0.15s]" />
      <div className="size-2 animate-bounce rounded-full bg-current" />
    </div>
  );
}

function RingSpinner({
  className,
  size = "default",
}: {
  className?: string;
  size?: "sm" | "default" | "lg";
}) {
  const sizeClasses = {
    sm: "size-4 border-2",
    default: "size-6 border-2",
    lg: "size-8 border-[3px]",
  };

  return (
    <div
      role="status"
      aria-label="Loading"
      className={cn(
        "border-primary/30 border-t-primary animate-spin rounded-full",
        sizeClasses[size],
        className
      )}
    />
  );
}

function FullPageSpinner({ message }: { message?: string }) {
  return (
    <div className="bg-background/80 fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm">
      <div className="flex flex-col items-center gap-4">
        <Spinner size="xl" variant="primary" />
        {message && <p className="text-muted-foreground text-sm">{message}</p>}
      </div>
    </div>
  );
}

function CardSkeleton() {
  return (
    <div className="bg-card animate-pulse space-y-4 rounded-lg border p-6">
      <div className="bg-muted h-4 w-3/4 rounded" />
      <div className="bg-muted h-3 w-1/2 rounded" />
      <div className="space-y-2">
        <div className="bg-muted h-3 rounded" />
        <div className="bg-muted h-3 w-5/6 rounded" />
      </div>
    </div>
  );
}

export {
  Spinner,
  DotsSpinner,
  RingSpinner,
  FullPageSpinner,
  CardSkeleton,
  spinnerVariants,
};
