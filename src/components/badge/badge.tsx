import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import type { FC, ReactNode } from "react";
import type { ComponentPropsWithoutChildren } from "@/lib/component-props";
import { cn } from "@/lib/utils";

export const badgeVariants = cva(
  "inline-flex max-w-full min-w-0 items-center justify-center rounded-full border-[3px] border-[var(--fg-primary)] px-4 py-1.5 font-[family-name:var(--font-inter)] text-[12px] font-bold uppercase leading-none tracking-[1.5px] text-[var(--fg-primary)] shadow-[4px_4px_0_0_var(--fg-primary)]",
  {
    variants: {
      variant: {
        primary: "bg-[var(--bg-accent-pink)]",
        secondary: "bg-[var(--bg-primary)]",
        tertiary: "bg-[var(--bg-accent-blue)]",
        highlight: "bg-[var(--bg-accent-yellow)]",
        dark: "bg-[var(--fg-primary)] text-[var(--fg-inverse)]",
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
