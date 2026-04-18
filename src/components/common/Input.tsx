import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/utils/tw-merge";

const inputVariants = cva(
  "flex h-11 w-full rounded-xl border border-border/60 bg-input px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/60 transition-all duration-300 outline-none " +
    "shadow-sm " +
    // hover
    "hover:border-border/80 hover:shadow-md hover:bg-input hover:placeholder:text-muted-foreground/50 " +
    // focus (чистый, с мягким свечением)
    "focus-visible:border-primary/70 focus-visible:ring-[3px] focus-visible:ring-primary/15 focus-visible:shadow-lg focus-visible:placeholder:text-muted-foreground/40 " +
    // disabled
    "disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-muted/30",
  {
    variants: {
      variant: {
        default: "",
        ghost:
          "border-transparent bg-transparent shadow-none hover:bg-muted/50 hover:shadow-none focus-visible:bg-muted/60 focus-visible:ring-primary/10",
        filled:
          "bg-muted/60 border-transparent shadow-sm hover:bg-muted/70 hover:shadow-md focus-visible:bg-muted/80 focus-visible:ring-primary/15",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface InputProps
  extends
    React.InputHTMLAttributes<HTMLInputElement>,
    VariantProps<typeof inputVariants> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, variant, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(inputVariants({ variant, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Input.displayName = "Input";

export { Input, inputVariants };
