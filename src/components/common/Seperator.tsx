"use client";

import { cn } from "@/utils/tw-merge";
import * as SeparatorPrimitive from "@radix-ui/react-separator";
import { ComponentProps } from "react";

function Separator({
  className,
  orientation = "horizontal",
  decorative = true,
  ...props
}: ComponentProps<typeof SeparatorPrimitive.Root>) {
  return (
    <SeparatorPrimitive.Root
      decorative={decorative}
      orientation={orientation}
      className={cn(
        "shrink-0 rounded-full",
        orientation === "horizontal"
          ? "via-border h-px w-full bg-linear-to-r from-transparent to-transparent sm:h-0.5 dark:via-white/40"
          : "via-border w-px self-stretch bg-linear-to-b from-transparent to-transparent dark:via-white/40",
        className
      )}
      {...props}
    />
  );
}

export { Separator };
