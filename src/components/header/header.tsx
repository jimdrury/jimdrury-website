import { Slot } from "@radix-ui/react-slot";
import type { FC, ReactNode } from "react";
import type { ComponentPropsWithoutChildren } from "@/lib/component-props";
import { cn } from "@/lib/utils";

export interface HeaderProps extends ComponentPropsWithoutChildren<"header"> {
  children?: ReactNode;
}

export const Header: FC<HeaderProps> = ({ className, children, ...props }) => {
  return (
    <header
      className={cn("border-b-2 border-black bg-white text-black", className)}
      {...props}
    >
      <div className="flex items-center justify-between px-4 py-3 sm:px-6">
        {children}
      </div>
    </header>
  );
};

export interface HeaderLogoProps extends ComponentPropsWithoutChildren<"a"> {
  children?: ReactNode;
  asChild?: boolean;
}

export const HeaderLogo: FC<HeaderLogoProps> = ({
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
      className={cn("text-xl font-bold focus-visible:focus-ring", className)}
      {...props}
    >
      {children}
    </Comp>
  );
};

export interface HeaderNavProps extends ComponentPropsWithoutChildren<"nav"> {
  children?: ReactNode;
}

export const HeaderNav: FC<HeaderNavProps> = ({
  className,
  children,
  ...props
}) => {
  return (
    <nav className={className} {...props}>
      <ul className="flex items-center gap-4 font-semibold">{children}</ul>
    </nav>
  );
};
