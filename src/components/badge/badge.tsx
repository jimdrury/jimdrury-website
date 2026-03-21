import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import type { FC, ReactNode } from "react";
import type { ComponentPropsWithoutChildren } from "@/lib/component-props";
import type { IconReference } from "@/lib/icon-ref";
import { cn } from "@/lib/utils";

export const badgeVariants = cva(
  "inline-flex items-center border-2 border-black px-3 py-1.5 text-sm/none font-semibold shadow-[2px_2px_0_0]",
  {
    variants: {
      variant: {
        info: "bg-blue-100",
        success: "bg-green-100",
        error: "bg-red-100",
        warning: "bg-yellow-100",
      },
    },
    defaultVariants: { variant: "info" },
  },
);

export interface BadgeProps
  extends ComponentPropsWithoutChildren<"span">,
    VariantProps<typeof badgeVariants> {
  children?: ReactNode;
  asChild?: boolean;
  /** Decorative icon; wrapped with `aria-hidden`. Ignored when `asChild` — put the icon inside your child. */
  icon?: IconReference;
  /** @default "start" */
  iconPosition?: "start" | "end";
}

export const Badge: FC<BadgeProps> = ({
  asChild,
  className,
  variant,
  children,
  icon: Icon,
  iconPosition = "start",
  ...props
}) => {
  const styles = cn(
    badgeVariants({ variant }),
    Icon && !asChild && "gap-1.5",
    className,
  );
  const Comp = asChild ? Slot : "span";

  if (asChild) {
    return (
      <Comp className={styles} {...props}>
        {children}
      </Comp>
    );
  }

  const iconEl = Icon ? (
    <span className="inline-flex shrink-0" aria-hidden>
      <Icon className="size-[1em] shrink-0" />
    </span>
  ) : null;

  return (
    <Comp className={styles} {...props}>
      {iconEl && iconPosition === "start" ? iconEl : null}
      {children}
      {iconEl && iconPosition === "end" ? iconEl : null}
    </Comp>
  );
};
