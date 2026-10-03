import { cva, type VariantProps } from "class-variance-authority";
import type { FC, ReactNode } from "react";
import type { ComponentPropsWithoutChildren } from "@/lib/component-props";
import { cn } from "@/lib/utils";

export const iconBoxVariants = cva(
  "inline-flex shrink-0 items-center justify-center rounded-none border text-[var(--fg-primary)] transition-colors group-hover:bg-[var(--fg-primary)] group-hover:text-[var(--fg-inverse)]",
  {
    variants: {
      size: {
        sm: "size-5 [&_svg]:size-3",
        md: "size-7 [&_svg]:size-4",
      },
      tone: {
        default: "border-[var(--color-border-strong)]",
        inverse:
          "border-[color:color-mix(in_srgb,var(--fg-inverse)_30%,transparent)] text-[var(--fg-inverse)] group-hover:bg-[var(--fg-inverse)] group-hover:text-[var(--fg-primary)]",
      },
    },
    defaultVariants: {
      size: "sm",
      tone: "default",
    },
  },
);

export interface IconBoxProps
  extends ComponentPropsWithoutChildren<"span">,
    VariantProps<typeof iconBoxVariants> {
  children?: ReactNode;
}

export const IconBox: FC<IconBoxProps> = ({
  className,
  size,
  tone,
  children,
  ...props
}) => {
  return (
    <span
      aria-hidden
      className={cn(iconBoxVariants({ size, tone }), className)}
      {...props}
    >
      {children}
    </span>
  );
};
