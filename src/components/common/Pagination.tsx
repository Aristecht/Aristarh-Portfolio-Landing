import * as React from "react";
import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/utils/tw-merge";

const paginationVariants = cva("flex items-center gap-1", {
  variants: {
    size: {
      default: "text-sm",
      sm: "text-xs",
      lg: "text-base",
    },
  },
  defaultVariants: {
    size: "default",
  },
});

interface PaginationProps
  extends
    React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof paginationVariants> {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  showFirstLast?: boolean;
  maxVisiblePages?: number;
}

const Pagination = React.forwardRef<HTMLDivElement, PaginationProps>(
  (
    {
      className,
      size,
      currentPage,
      totalPages,
      onPageChange,
      showFirstLast = true,
      maxVisiblePages = 5,
      ...props
    },
    ref
  ) => {
    const getVisiblePages = () => {
      const delta = Math.floor(maxVisiblePages / 2);
      let start = Math.max(1, currentPage - delta);
      const end = Math.min(totalPages, start + maxVisiblePages - 1);

      if (end - start + 1 < maxVisiblePages) {
        start = Math.max(1, end - maxVisiblePages + 1);
      }

      const pages = [];
      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      return { pages, start, end };
    };

    const { pages, start, end } = getVisiblePages();
    const showStartEllipsis = start > 2;
    const showEndEllipsis = end < totalPages - 1;

    if (totalPages <= 1) return null;

    return (
      <nav
        ref={ref}
        className={cn(paginationVariants({ size }), className)}
        aria-label="Pagination Navigation"
        {...props}
      >
        <PaginationButton
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage <= 1}
          aria-label="Go to previous page"
        >
          <ChevronLeft className="h-4 w-4" />
          <span className="sr-only">Previous</span>
        </PaginationButton>

        {showFirstLast && start > 1 && (
          <PaginationButton
            onClick={() => onPageChange(1)}
            isActive={currentPage === 1}
          >
            1
          </PaginationButton>
        )}

        {showStartEllipsis && <PaginationEllipsis />}

        {pages.map((page) => (
          <PaginationButton
            key={page}
            onClick={() => onPageChange(page)}
            isActive={page === currentPage}
          >
            {page}
          </PaginationButton>
        ))}

        {showEndEllipsis && <PaginationEllipsis />}

        {showFirstLast && end < totalPages && (
          <PaginationButton
            onClick={() => onPageChange(totalPages)}
            isActive={currentPage === totalPages}
          >
            {totalPages}
          </PaginationButton>
        )}

        <PaginationButton
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage >= totalPages}
          aria-label="Go to next page"
        >
          <ChevronRight className="h-4 w-4" />
          <span className="sr-only">Next</span>
        </PaginationButton>
      </nav>
    );
  }
);
Pagination.displayName = "Pagination";

interface PaginationButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  isActive?: boolean;
}

const PaginationButton = React.forwardRef<
  HTMLButtonElement,
  PaginationButtonProps
>(({ className, isActive, disabled, ...props }, ref) => (
  <button
    ref={ref}
    disabled={disabled}
    className={cn(
      "border-border bg-background hover:bg-accent hover:text-accent-foreground focus-visible:ring-ring inline-flex items-center justify-center rounded-lg border px-3 py-2 text-sm font-medium whitespace-nowrap transition-all focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50",
      isActive &&
        "bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground border-primary",
      className
    )}
    {...props}
  />
));
PaginationButton.displayName = "PaginationButton";

const PaginationEllipsis = React.forwardRef<
  HTMLSpanElement,
  React.HTMLAttributes<HTMLSpanElement>
>(({ className, ...props }, ref) => (
  <span
    ref={ref}
    className={cn(
      "text-muted-foreground inline-flex items-center justify-center px-2 py-2",
      className
    )}
    {...props}
  >
    <MoreHorizontal className="h-4 w-4" />
    <span className="sr-only">More pages</span>
  </span>
));
PaginationEllipsis.displayName = "PaginationEllipsis";

export { Pagination, PaginationButton, PaginationEllipsis };
