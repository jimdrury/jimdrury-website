import type { FC, ReactNode } from "react";
import type { ComponentPropsWithoutChildren } from "@/lib/component-props";
import { cn } from "@/lib/utils";

export interface SpineProps extends ComponentPropsWithoutChildren<"div"> {
  label: string;
  dashed?: boolean;
  ruleClassName?: string;
  children?: ReactNode;
}

export const Spine: FC<SpineProps> = ({
  label,
  dashed = false,
  ruleClassName,
  children,
  className,
  ...props
}) => {
  return (
    <div className={cn("relative min-w-0 pl-3", className)} {...props}>
      <span
        aria-hidden
        className={cn(
          "absolute top-0 bottom-[-1.5rem] left-0 w-px bg-[var(--color-border)]",
          dashed
            ? "border-l border-dashed border-[var(--color-border)] bg-transparent"
            : null,
          ruleClassName,
        )}
      />
      <p className="mb-2 font-[family-name:var(--font-pixel),var(--font-mono)] text-[13px] leading-none text-[var(--fg-primary)]">
        {label}
      </p>
      {children}
    </div>
  );
};
