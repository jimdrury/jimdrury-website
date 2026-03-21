"use client";

import type { FC, ReactNode } from "react";
import { FaTimes } from "react-icons/fa";
import type { ComponentPropsWithoutChildren } from "@/lib/component-props";
import { cn } from "@/lib/utils";

export interface BannerProps extends ComponentPropsWithoutChildren<"div"> {
  children?: ReactNode;
  onDismiss?: () => void;
  dismissLabel?: string;
}

export const Banner: FC<BannerProps> = ({
  className,
  onDismiss,
  dismissLabel = "Dismiss",
  children,
  ...props
}) => {
  return (
    <div
      className={cn(
        "flex items-center gap-4 rounded-md border-2 border-black bg-yellow-300 px-4 py-3 font-semibold shadow-[4px_4px_0_0]",
        className,
      )}
      {...props}
    >
      <span className="flex-1">{children}</span>
      {onDismiss && (
        <button
          type="button"
          onClick={onDismiss}
          className="inline-flex size-9 shrink-0 cursor-pointer items-center justify-center rounded-sm border-2 border-transparent transition-colors duration-150 hover:border-black hover:bg-yellow-400/90 active:bg-yellow-500/90 focus-visible:focus-ring"
          aria-label={dismissLabel}
        >
          <FaTimes className="size-4" aria-hidden />
        </button>
      )}
    </div>
  );
};
