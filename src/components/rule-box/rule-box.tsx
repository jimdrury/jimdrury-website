import type { FC, ReactNode } from "react";
import type { ComponentPropsWithoutChildren } from "@/lib/component-props";
import { cn } from "@/lib/utils";

export type RuleMarksVariant = "extend" | "corners";

export const RuleMarks: FC<{
  className?: string;
  variant?: RuleMarksVariant;
}> = ({ className, variant = "extend" }) => {
  if (variant === "corners") {
    return (
      <span
        aria-hidden
        className={cn("pointer-events-none absolute inset-0 z-[2]", className)}
      >
        <span className="absolute -top-3 -left-3 size-2.5 border-t border-l border-[var(--color-border-strong)]" />
        <span className="absolute -top-3 -right-3 size-2.5 border-t border-r border-[var(--color-border-strong)]" />
        <span className="absolute -bottom-3 -left-3 size-2.5 border-b border-l border-[var(--color-border-strong)]" />
        <span className="absolute -bottom-3 -right-3 size-2.5 border-b border-r border-[var(--color-border-strong)]" />
      </span>
    );
  }

  return (
    <span
      aria-hidden
      className={cn("pointer-events-none absolute inset-0 z-[2]", className)}
    >
      <span className="rule-mark-h top-0" />
      <span className="rule-mark-h bottom-0" />
      <span className="rule-mark-v left-0" />
      <span className="rule-mark-v right-0" />
    </span>
  );
};

export interface RuleBoxProps extends ComponentPropsWithoutChildren<"div"> {
  children?: ReactNode;
  grow?: boolean;
}

export const RuleBox: FC<RuleBoxProps> = ({
  className,
  children,
  grow = false,
  ...props
}) => {
  return (
    <div
      className={cn("rule-box relative overflow-visible", className)}
      data-grow={grow ? "true" : undefined}
      {...props}
    >
      <RuleMarks />
      {children}
    </div>
  );
};
