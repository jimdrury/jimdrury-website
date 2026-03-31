import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import type { FC, ReactNode } from "react";
import type { ComponentPropsWithoutChildren } from "@/lib/component-props";
import { cn } from "@/lib/utils";

/**
 * Matches Pencil `Component/Badge` in neo_pencil.pen: pill, 3px border, softened hard shadow,
 * Inter 12px / bold / 1.5px tracking, uppercase label. Variant axis aligns with Button
 * (`$btn-fill` / `$btn-text` in the design file).
 */
export const badgeVariants = cva(
  "inline-flex max-w-full min-w-0 items-center justify-center rounded-full border-[3px] border-[#1a1a1a] px-4 py-1.5 font-[family-name:var(--font-inter)] text-[12px] font-bold uppercase leading-none tracking-[1.5px] text-[#1a1a1a] shadow-[4px_4px_0_0_#1a1a1a]",
  {
    variants: {
      variant: {
        primary: "bg-[#ff6b6b]",
        secondary: "bg-[#fffdf5]",
        tertiary: "bg-[#a8d8ea]",
        highlight: "bg-[#ffe156]",
        dark: "bg-[#1a1a1a] text-[#fffdf5]",
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
