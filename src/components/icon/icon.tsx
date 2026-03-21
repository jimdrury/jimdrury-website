import { cva, type VariantProps } from "class-variance-authority";
import type { FC, ReactNode } from "react";
import type { ComponentPropsWithoutChildren } from "@/lib/component-props";
import { cn } from "@/lib/utils";

export const iconVariants = cva(
  "inline-flex shrink-0 items-center justify-center",
  {
    variants: {
      size: {
        sm: "size-4",
        md: "size-5",
        lg: "size-6",
      },
    },
    defaultVariants: {
      size: "md",
    },
  },
);

export interface IconProps
  extends ComponentPropsWithoutChildren<"span">,
    VariantProps<typeof iconVariants> {
  children?: ReactNode;
}

export const Icon: FC<IconProps> = ({
  className,
  size,
  children,
  ...props
}) => {
  return (
    <span
      className={cn(iconVariants({ size }), className)}
      aria-hidden="true"
      {...props}
    >
      {children}
    </span>
  );
};
