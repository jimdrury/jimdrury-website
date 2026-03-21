import { Slot } from "@radix-ui/react-slot";
import type { FC, ReactNode } from "react";
import type { ComponentPropsWithoutChildren } from "@/lib/component-props";
import { cn } from "@/lib/utils";

export interface SideMenuProps extends ComponentPropsWithoutChildren<"nav"> {
  children?: ReactNode;
}

export const SideMenu: FC<SideMenuProps> = ({
  className,
  children,
  ...props
}) => {
  return (
    <nav
      className={cn(
        "w-64 border-2 border-black bg-white text-black shadow-[4px_4px_0_0]",
        className,
      )}
      {...props}
    >
      <ul>{children}</ul>
    </nav>
  );
};

export interface SideMenuItemProps extends ComponentPropsWithoutChildren<"li"> {
  children?: ReactNode;
  href?: string;
  active?: boolean;
  asChild?: boolean;
}

export const SideMenuItem: FC<SideMenuItemProps> = ({
  className,
  href,
  active,
  asChild,
  children,
  ...props
}) => {
  const linkClasses = cn(
    "block cursor-pointer px-4 py-3 font-semibold hover:bg-yellow-100 focus-visible:focus-ring",
    active && "bg-yellow-300",
  );

  return (
    <li
      className={cn("border-b-2 border-black last:border-b-0", className)}
      {...props}
    >
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
