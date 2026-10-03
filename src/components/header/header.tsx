import { Slot } from "@radix-ui/react-slot";
import type { FC, ReactNode } from "react";
import { Button } from "@/components/button";
import type { ComponentPropsWithoutChildren } from "@/lib/component-props";
import { cn } from "@/lib/utils";

export interface HeaderProps extends ComponentPropsWithoutChildren<"header"> {
  children?: ReactNode;
}

export const Header: FC<HeaderProps> = ({ className, children, ...props }) => {
  return (
    <header
      className={cn(
        "sticky top-0 z-50 flex items-center justify-between gap-3 border-b border-[var(--color-border)] bg-[var(--bg-primary)] px-4 py-3 sm:px-6 lg:px-12",
        className,
      )}
      {...props}
    >
      {children}
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
        "font-[family-name:var(--font-geist-sans)] text-[1.05rem] leading-none font-medium tracking-[-0.03em] text-[var(--fg-primary)] focus-visible:focus-ring sm:text-[1.15rem]",
        className,
      )}
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
      <ul className="flex items-center gap-4 sm:gap-6">{children}</ul>
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
    <li className="list-none">
      <Comp
        className={cn(
          "font-[family-name:var(--font-geist-sans)] text-sm font-medium tracking-[-0.01em] text-[var(--fg-primary)] transition-opacity focus-visible:focus-ring-sm",
          active ? "opacity-100" : "opacity-55 hover:opacity-100",
          className,
        )}
        aria-current={active ? "page" : undefined}
        {...props}
      >
        {children}
      </Comp>
    </li>
  );
};

export interface HeaderCtaProps extends ComponentPropsWithoutChildren<"a"> {
  children?: ReactNode;
  asChild?: boolean;
  active?: boolean;
}

export const HeaderCta: FC<HeaderCtaProps> = ({
  asChild,
  active,
  className,
  children,
  ...props
}) => {
  const Comp = asChild ? Slot : "a";

  return (
    <li className="list-none">
      <Button
        asChild
        variant="highlight"
        size="small"
        className={cn(
          active && "outline outline-1 outline-[var(--fg-primary)]",
          className,
        )}
      >
        <Comp aria-current={active ? "page" : undefined} {...props}>
          {children}
        </Comp>
      </Button>
    </li>
  );
};
