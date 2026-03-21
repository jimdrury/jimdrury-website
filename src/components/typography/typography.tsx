import { cva, type VariantProps } from "class-variance-authority";
import type { ElementType, FC, ReactNode } from "react";
import type { ComponentPropsWithoutChildren } from "@/lib/component-props";
import { cn } from "@/lib/utils";

export const typographyVariants = cva("text-black", {
  variants: {
    size: {
      xs: "text-xs",
      sm: "text-sm",
      md: "text-base",
      lg: "text-lg",
      xl: "text-xl",
      "2xl": "text-2xl",
      "3xl": "text-3xl",
    },
    weight: {
      normal: "font-normal",
      medium: "font-medium",
      bold: "font-bold",
      black: "font-black",
    },
  },
  defaultVariants: {
    size: "md",
    weight: "medium",
  },
});

export interface TypographyProps
  extends ComponentPropsWithoutChildren<"p">,
    VariantProps<typeof typographyVariants> {
  children?: ReactNode;
  as?: ElementType;
}

export const Typography: FC<TypographyProps> = ({
  as,
  className,
  size,
  weight,
  children,
  ...props
}) => {
  const Comp = as ?? "p";

  return (
    <Comp
      className={cn(typographyVariants({ size, weight }), className)}
      {...props}
    >
      {children}
    </Comp>
  );
};
