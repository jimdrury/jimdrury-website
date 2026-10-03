import type { FC, ReactNode } from "react";
import type { ComponentPropsWithoutChildren } from "@/lib/component-props";
import { cn } from "@/lib/utils";

export const RuleMarks: FC<{ className?: string }> = ({ className }) => {
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
