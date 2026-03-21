import { Slot } from "@radix-ui/react-slot";
import type { FC, ReactNode } from "react";
import type { ComponentPropsWithoutChildren } from "@/lib/component-props";
import { cn } from "@/lib/utils";

export interface SkipLinkProps extends ComponentPropsWithoutChildren<"a"> {
  children?: ReactNode;
  asChild?: boolean;
}

export const SkipLink: FC<SkipLinkProps> = ({
  asChild,
  className,
  children,
  href,
  ...props
}) => {
  const Comp = asChild ? Slot : href ? "a" : "span";
  return (
    <Comp
      href={asChild || !href ? undefined : href}
      className={cn(
        "sr-only cursor-pointer focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:border-2 focus:border-black focus:bg-yellow-300 focus:px-4 focus:py-2 focus:font-semibold focus:focus-ring",
        className,
      )}
      {...props}
    >
      {children}
    </Comp>
  );
};
