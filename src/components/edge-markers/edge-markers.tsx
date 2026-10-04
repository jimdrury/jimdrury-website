import type { FC } from "react";
import type { ComponentPropsWithoutChildren } from "@/lib/component-props";
import { cn } from "@/lib/utils";

export interface EdgeMarkersProps
  extends ComponentPropsWithoutChildren<"span"> {}

export const EdgeMarkers: FC<EdgeMarkersProps> = ({ className, ...props }) => {
  return (
    <span
      aria-hidden
      className={cn(
        "pointer-events-none absolute inset-x-2 top-1 flex justify-between font-[family-name:var(--font-pixel),var(--font-mono)] text-[11px] leading-none text-[var(--fg-primary)]/60",
        className,
      )}
      {...props}
    >
      <span>∵ x</span>
      <span>x ∵</span>
    </span>
  );
};
