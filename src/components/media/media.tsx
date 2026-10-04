import type { FC, ReactNode } from "react";
import { RuleMarks } from "@/components/rule-box";
import type { ComponentPropsWithoutChildren } from "@/lib/component-props";
import { cn } from "@/lib/utils";

export interface MediaProps extends ComponentPropsWithoutChildren<"figure"> {
  children: ReactNode;
  caption?: string;
}

export const Media: FC<MediaProps> = ({
  className,
  children,
  caption,
  ...props
}) => {
  return (
    <figure
      className={cn("rule-box relative overflow-visible", className)}
      {...props}
    >
      <RuleMarks />
      <div className="overflow-hidden">{children}</div>
      {caption && (
        <figcaption className="border-t border-[var(--color-border)] bg-[var(--bg-primary)] px-4 py-2 font-[family-name:var(--font-mono)] text-[12px] font-medium text-[var(--fg-secondary)]">
          {caption}
        </figcaption>
      )}
    </figure>
  );
};
