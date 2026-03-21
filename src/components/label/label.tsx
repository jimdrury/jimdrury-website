import { cva, type VariantProps } from "class-variance-authority";
import type { FC, ReactNode } from "react";
import type { ComponentPropsWithoutChildren } from "@/lib/component-props";
import { cn } from "@/lib/utils";

export const labelVariants = cva(
  "block text-sm font-bold uppercase tracking-wide",
  {
    variants: {
      tone: {
        default: "text-black",
        muted: "text-zinc-700",
      },
    },
    defaultVariants: {
      tone: "default",
    },
  },
);

export interface LabelProps
  extends ComponentPropsWithoutChildren<"label">,
    VariantProps<typeof labelVariants> {
  children?: ReactNode;
}

export const Label: FC<LabelProps> = ({
  className,
  tone,
  children,
  ...props
}) => {
  return (
    // biome-ignore lint/a11y/noLabelWithoutControl: consumer passes htmlFor or nests an input
    <label className={cn(labelVariants({ tone }), className)} {...props}>
      {children}
    </label>
  );
};
