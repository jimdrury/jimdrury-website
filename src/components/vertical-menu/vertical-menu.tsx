import { Slot } from "@radix-ui/react-slot";
import type { FC, ReactNode } from "react";
import type { ComponentPropsWithoutChildren } from "@/lib/component-props";
import { cn } from "@/lib/utils";

export interface VerticalMenuProps
  extends ComponentPropsWithoutChildren<"nav"> {
  children?: ReactNode;
}

export const VerticalMenu: FC<VerticalMenuProps> = ({
  className,
  children,
  ...props
}) => {
  return (
    <nav className={className} {...props}>
      <ul className="space-y-1">{children}</ul>
    </nav>
  );
};

export interface VerticalMenuItemProps
  extends ComponentPropsWithoutChildren<"li"> {
  children?: ReactNode;
  href?: string;
  active?: boolean;
  asChild?: boolean;
}

export const VerticalMenuItem: FC<VerticalMenuItemProps> = ({
  className,
  href,
  active,
  asChild,
  children,
  ...props
}) => {
  const linkClasses = cn(
    "block cursor-pointer rounded-md border-2 border-black px-4 py-2 font-semibold shadow-[2px_2px_0_0] hover:bg-yellow-100 focus-visible:focus-ring",
    active && "bg-yellow-300",
  );

  return (
    <li className={className} {...props}>
      {asChild ? (
        <Slot className={linkClasses}>{children}</Slot>
      ) : href ? (
        <a href={href} className={linkClasses}>
          {children}
        </a>
      ) : (
        <span className={linkClasses}>{children}</span>
      )}
    </li>
  );
};
