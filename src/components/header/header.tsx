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
      className={cn(
        "sticky top-0 z-50 h-16 bg-black/80 text-yellow-300 shadow-[0_2px_8px_rgba(0,0,0,0.25)] backdrop-blur-sm",
        className,
      )}
      {...props}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
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
      className={cn(
        "flex items-center gap-2 focus-visible:focus-ring",
        className,
      )}
      {...props}
    >
      {children}
    </Comp>
  );
};

export interface HeaderLogoBadgeProps
  extends ComponentPropsWithoutChildren<"span"> {
  children?: ReactNode;
}

export const HeaderLogoBadge: FC<HeaderLogoBadgeProps> = ({
  className,
  children,
  ...props
}) => {
  return (
    <span
      className={cn(
        "rounded bg-yellow-300 px-2.5 py-1 text-lg font-black text-black",
        className,
      )}
      aria-hidden
      data-nosnippet=""
      {...props}
    >
      {children}
    </span>
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
      <ul className="flex items-center gap-4 sm:gap-8">{children}</ul>
    </nav>
  );
};

export interface HeaderNavLinkProps extends ComponentPropsWithoutChildren<"a"> {
  children?: ReactNode;
  asChild?: boolean;
  active?: boolean;
}

export const HeaderNavLink: FC<HeaderNavLinkProps> = ({
  asChild,
  active,
  className,
  children,
  ...props
}) => {
  const Comp = asChild ? Slot : "a";
  return (
    <li className="flex list-none flex-col items-center gap-1">
      <Comp
        className={cn(
          "text-sm transition-colors focus-visible:focus-ring",
          active ? "font-bold" : "font-medium opacity-70 hover:opacity-100",
          className,
        )}
        aria-current={active ? "page" : undefined}
        {...props}
      >
        {children}
      </Comp>
      {active ? (
        <span className="h-0.5 w-full bg-yellow-300" aria-hidden />
      ) : null}
    </li>
  );
};
