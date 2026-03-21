"use client";

import { cva, type VariantProps } from "class-variance-authority";
import type { FC, ReactNode } from "react";
import { FaTimes } from "react-icons/fa";
import type { ComponentPropsWithoutChildren } from "@/lib/component-props";
import { cn } from "@/lib/utils";

export const toastVariants = cva(
  "flex items-center gap-3 border-2 border-black p-4 shadow-[4px_4px_0_0]",
  {
    variants: {
      variant: {
        info: "bg-blue-100",
        success: "bg-green-100",
        error: "bg-red-100",
      },
    },
    defaultVariants: { variant: "info" },
  },
);

export interface ToastProps
  extends ComponentPropsWithoutChildren<"div">,
    VariantProps<typeof toastVariants> {
  children?: ReactNode;
  onDismiss?: () => void;
  dismissLabel?: string;
  variantClassName?: string;
}

export const Toast: FC<ToastProps> = ({
  className,
  variant,
  onDismiss,
  dismissLabel = "Dismiss",
  variantClassName,
  children,
  ...props
}) => {
  return (
    <div
      role="alert"
      className={cn(toastVariants({ variant }), variantClassName, className)}
      {...props}
    >
      <span className="flex-1 font-semibold">{children}</span>
      {onDismiss && (
        <button
          type="button"
          onClick={onDismiss}
          className="inline-flex size-9 shrink-0 cursor-pointer items-center justify-center rounded-sm border-2 border-transparent transition-colors duration-150 hover:border-black hover:bg-white/50 active:bg-white/70 focus-visible:focus-ring"
          aria-label={dismissLabel}
        >
          <FaTimes className="size-4" aria-hidden />
        </button>
      )}
    </div>
  );
};
