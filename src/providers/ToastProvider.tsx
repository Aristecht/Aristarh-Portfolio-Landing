// components/ui/sonner.tsx
"use client";

import { useTheme } from "next-themes";
import { Toaster as Sonner, type ToasterProps } from "sonner";
import {
  CircleCheckIcon,
  InfoIcon,
  TriangleAlertIcon,
  OctagonXIcon,
  Loader2Icon,
} from "lucide-react";
import { CSSProperties } from "react";

export const ToastProvider = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme();

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      icons={{
        success: <CircleCheckIcon className="size-5" />,
        info: <InfoIcon className="size-5" />,
        warning: <TriangleAlertIcon className="size-5" />,
        error: <OctagonXIcon className="size-5" />,
        loading: <Loader2Icon className="size-5 animate-spin" />,
      }}
      style={
        {
          "--normal-bg": "var(--card)",
          "--normal-text": "var(--card-foreground)",
          "--normal-border": "var(--border)",
          "--success-bg": "oklch(0.95 0.08 140)",
          "--success-text": "oklch(0.35 0.15 140)",
          "--success-border": "oklch(0.70 0.15 140)",
          "--info-bg": "oklch(0.95 0.05 260)",
          "--info-text": "oklch(0.35 0.12 260)",
          "--info-border": "oklch(0.65 0.12 260)",
          "--warning-bg": "oklch(0.95 0.12 60)",
          "--warning-text": "oklch(0.35 0.16 45)",
          "--warning-border": "var(--primary)",
          "--error-bg": "oklch(0.95 0.12 25)",
          "--error-text": "oklch(0.35 0.18 25)",
          "--error-border": "var(--destructive)",
          "--border-radius": "var(--radius-lg)",
        } as CSSProperties
      }
      toastOptions={{
        classNames: {
          toast:
            "group toast group-[.toaster]:bg-card group-[.toaster]:text-card-foreground group-[.toaster]:border-border group-[.toaster]:shadow-md group-[.toaster]:backdrop-blur-xl",
          description: "group-[.toast]:text-muted-foreground",
          actionButton:
            "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground group-[.toast]:hover:bg-primary/90 group-[.toast]:shadow-sm",
          cancelButton:
            "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground group-[.toast]:hover:bg-muted/80",
          success:
            "group-[.toaster]:!bg-[var(--success-bg)] group-[.toaster]:!text-[var(--success-text)] group-[.toaster]:!border-[var(--success-border)] group-[.toaster]:dark:!bg-[oklch(0.20_0.08_140)] group-[.toaster]:dark:!text-[oklch(0.85_0.12_140)] group-[.toaster]:dark:!border-[oklch(0.60_0.15_140)]",
          info: "group-[.toaster]:!bg-[var(--info-bg)] group-[.toaster]:!text-[var(--info-text)] group-[.toaster]:!border-[var(--info-border)] group-[.toaster]:dark:!bg-[oklch(0.20_0.05_260)] group-[.toaster]:dark:!text-[oklch(0.85_0.10_260)] group-[.toaster]:dark:!border-[oklch(0.55_0.12_260)]",
          warning:
            "group-[.toaster]:!bg-[var(--warning-bg)] group-[.toaster]:!text-[var(--warning-text)] group-[.toaster]:!border-[var(--warning-border)] group-[.toaster]:dark:!bg-[oklch(0.22_0.08_45)] group-[.toaster]:dark:!text-[oklch(0.88_0.16_45)] group-[.toaster]:dark:!border-[var(--primary)]",
          error:
            "group-[.toaster]:!bg-[var(--error-bg)] group-[.toaster]:!text-[var(--error-text)] group-[.toaster]:!border-[var(--error-border)] group-[.toaster]:dark:!bg-[oklch(0.22_0.10_25)] group-[.toaster]:dark:!text-[oklch(0.88_0.16_25)] group-[.toaster]:dark:!border-[var(--destructive)]",
        },
      }}
      {...props}
    />
  );
};
