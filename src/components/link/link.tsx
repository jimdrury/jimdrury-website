import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import type { FC, ReactNode } from "react";
import type { ComponentPropsWithoutChildren } from "@/lib/component-props";
import type { IconReference } from "@/lib/icon-ref";
import { cn } from "@/lib/utils";

export const linkVariants = cva(
  "font-bold underline-offset-4 transition-colors focus-visible:focus-ring",
  {
    variants: {
      variant: {
        default: "text-black hover:text-zinc-700 underline",
        subtle: "text-zinc-700 hover:text-black",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

export interface LinkProps
  extends ComponentPropsWithoutChildren<"a">,
    VariantProps<typeof linkVariants> {
  children?: ReactNode;
  asChild?: boolean;
  /** Decorative icon; wrapped with `aria-hidden`. Not applied when `asChild` — include the icon inside your child. */
  icon?: IconReference;
  /** @default "start" */
  iconPosition?: "start" | "end";
}

export const Link: FC<LinkProps> = ({
  asChild,
  className,
  variant,
  children,
  icon: Icon,
  iconPosition = "start",
  ...props
}) => {
  const styles = cn(
    linkVariants({ variant }),
    Icon && !asChild && "inline-flex items-center gap-2",
    className,
  );

  if (asChild) {
    return (
      <Slot className={styles} {...props}>
        {children}
      </Slot>
    );
  }

  const iconEl = Icon ? (
    <span className="inline-flex shrink-0" aria-hidden>
      <Icon className="size-[1em] shrink-0" />
    </span>
  ) : null;

  return (
    <a className={styles} {...props}>
      {iconEl && iconPosition === "start" ? iconEl : null}
      {children}
      {iconEl && iconPosition === "end" ? iconEl : null}
    </a>
  );
};
