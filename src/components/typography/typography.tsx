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

type TypographySize = NonNullable<
  VariantProps<typeof typographyVariants>["size"]
>;
type TypographyWeight = NonNullable<
  VariantProps<typeof typographyVariants>["weight"]
>;
type TypographyHeadingTag = "h1" | "h2" | "h3" | "h4";

const headingVariants: Record<
  TypographyHeadingTag,
  { size: TypographySize; weight: TypographyWeight }
> = {
  h1: { size: "3xl", weight: "black" },
  h2: { size: "2xl", weight: "bold" },
  h3: { size: "xl", weight: "bold" },
  h4: { size: "lg", weight: "medium" },
};

const isTypographyHeadingTag = (
  value: string,
): value is TypographyHeadingTag => {
  return value in headingVariants;
};

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
  const headingVariant =
    typeof Comp === "string" && isTypographyHeadingTag(Comp)
      ? headingVariants[Comp]
      : undefined;
  const resolvedSize = headingVariant?.size ?? size;
  const resolvedWeight = headingVariant?.weight ?? weight;

  return (
    <Comp
      className={cn(
        typographyVariants({ size: resolvedSize, weight: resolvedWeight }),
        className,
      )}
      {...props}
    >
      {children}
    </Comp>
  );
};
