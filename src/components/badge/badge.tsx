import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import type { FC, ReactNode } from "react";
import type { ComponentPropsWithoutChildren } from "@/lib/component-props";
import { cn } from "@/lib/utils";

export const badgeVariants = cva(
  "inline-flex max-w-full min-w-0 items-center justify-center rounded-none px-1 py-0.5 font-[family-name:var(--font-pixel),var(--font-mono)] text-[13px] font-normal leading-none normal-case text-[var(--fg-primary)]",
  {
    variants: {
      variant: {
        primary: "bg-[var(--fg-primary)] text-[var(--fg-inverse)]",
        secondary: "border border-[var(--color-border)] bg-[var(--bg-primary)]",
        tertiary: "bg-[var(--bg-accent-blue)]",
        highlight: "bg-[var(--bg-accent-pink)]",
        dark: "bg-[var(--fg-primary)] text-[var(--fg-inverse)]",
        inverse: "bg-[#1e1e1e] text-[#fefefe]",
        magenta: "bg-[var(--bg-accent-magenta)] text-[var(--fg-primary)]",
        tag: "bg-[#c4c4c4] text-[#1e1e1e] px-1.5 py-1 before:mr-1 before:content-['✣']",
      },
    },
    defaultVariants: {
      variant: "inverse",
    },
  },
);

export interface BadgeProps
  extends ComponentPropsWithoutChildren<"span">,
    VariantProps<typeof badgeVariants> {
  children?: ReactNode;
  asChild?: boolean;
}

export const Badge: FC<BadgeProps> = ({
  asChild,
  className,
  variant,
  children,
  ...props
}) => {
  const styles = cn(badgeVariants({ variant }), className);
  const Comp = asChild ? Slot : "span";

  return (
    <Comp className={styles} {...props}>
      {children}
    </Comp>
  );
};
