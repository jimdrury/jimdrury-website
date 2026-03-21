import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import type { FC, ReactNode } from "react";
import type { ComponentPropsWithoutChildren } from "@/lib/component-props";
import { cn } from "@/lib/utils";

export const surfaceVariants = cva(
  "border-2 border-black bg-white text-black",
  {
    variants: {
      variant: {
        default: "shadow-[4px_4px_0_0_#000]",
        raised: "shadow-[6px_6px_0_0_#000]",
        flat: "shadow-none",
      },
      padding: {
        none: "p-0",
        sm: "p-3",
        md: "p-5",
        lg: "p-7",
      },
    },
    defaultVariants: {
      variant: "default",
      padding: "md",
    },
  },
);

export interface SurfaceProps
  extends ComponentPropsWithoutChildren<"div">,
    VariantProps<typeof surfaceVariants> {
  children?: ReactNode;
  asChild?: boolean;
}

export const Surface: FC<SurfaceProps> = ({
  asChild,
  className,
  variant,
  padding,
  children,
  ...props
}) => {
  const Comp = asChild ? Slot : "div";
  return (
    <Comp
      className={cn(surfaceVariants({ variant, padding }), className)}
      {...props}
    >
      {children}
    </Comp>
  );
};
