import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import type { FC, ReactNode } from "react";
import type { ComponentPropsWithoutChildren } from "@/lib/component-props";
import { cn } from "@/lib/utils";

export const badgeVariants = cva(
  "inline-flex max-w-full min-w-0 items-center justify-center rounded-none border border-[var(--color-border)] px-2.5 py-1 font-[family-name:var(--font-mono)] text-[10px] font-medium uppercase leading-none tracking-[0.08em] text-[var(--fg-primary)]",
  {
    variants: {
      variant: {
        primary: "border-transparent bg-[var(--bg-accent-pink)]",
        secondary: "bg-[var(--bg-primary)]",
        tertiary: "border-transparent bg-[var(--bg-accent-blue)]",
        highlight: "border-transparent bg-[var(--bg-accent-yellow)]",
        dark: "border-transparent bg-[var(--fg-primary)] text-[var(--fg-inverse)]",
      },
    },
    defaultVariants: {
      variant: "primary",
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
