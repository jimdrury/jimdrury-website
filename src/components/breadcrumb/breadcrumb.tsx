import { Slot } from "@radix-ui/react-slot";
import {
  Children,
  cloneElement,
  type FC,
  isValidElement,
  type ReactElement,
  type ReactNode,
  type SVGProps,
} from "react";
import type { ComponentPropsWithoutChildren } from "@/lib/component-props";
import { cn } from "@/lib/utils";

function HomeIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <>
      {/* biome-ignore lint/a11y/noSvgWithoutTitle: decorative; parent link has aria-label */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="size-4"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        aria-hidden
        {...props}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
        />
      </svg>
    </>
  );
}

function SlashSeparator(props: SVGProps<SVGSVGElement>) {
  return (
    <>
      {/* biome-ignore lint/a11y/noSvgWithoutTitle: decorative; wrapper list item is aria-hidden */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        className="size-4"
        aria-hidden
        {...props}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="m9 20.247 6-16.5"
        />
      </svg>
    </>
  );
}

export interface BreadcrumbProps extends ComponentPropsWithoutChildren<"nav"> {
  children?: ReactNode;
  label?: string;
  /** When set, renders a home icon link before the first crumb. */
  homeHref?: string;
  /** Accessible name for the home control (default: `Home`). */
  homeLabel?: string;
}

export const Breadcrumb: FC<BreadcrumbProps> = ({
  className,
  label = "Breadcrumb",
  homeHref,
  homeLabel = "Home",
  children,
  ...props
}) => {
  const crumbs = Children.toArray(children);

  return (
    <nav aria-label={label} className={cn(className)} {...props}>
      <ol className="flex items-center gap-1 text-sm text-gray-700">
        {homeHref ? (
          <li>
            <a
              href={homeHref}
              className="block transition-colors hover:text-gray-900 focus-visible:focus-ring"
              aria-label={homeLabel}
            >
              <HomeIcon />
            </a>
          </li>
        ) : null}
        {crumbs.flatMap((child, index) => {
          if (!isValidElement(child)) {
            return [];
          }
          const nodes: ReactNode[] = [];
          if (homeHref != null || index > 0) {
            nodes.push(
              <li
                key={`breadcrumb-sep-${child.key ?? index}`}
                className="rtl:rotate-180"
                aria-hidden
              >
                <SlashSeparator />
              </li>,
            );
          }
          nodes.push(
            cloneElement(child as ReactElement<BreadcrumbItemProps>, {
              key: child.key ?? index,
            }),
          );
          return nodes;
        })}
      </ol>
    </nav>
  );
};

const crumbLinkClass =
  "block transition-colors hover:text-gray-900 focus-visible:focus-ring";

export interface BreadcrumbItemProps
  extends ComponentPropsWithoutChildren<"li"> {
  children?: ReactNode;
  href?: string;
  active?: boolean;
  asChild?: boolean;
}

export const BreadcrumbItem: FC<BreadcrumbItemProps> = ({
  className,
  href,
  active,
  asChild,
  children,
  ...props
}) => {
  const content = asChild ? (
    <Slot className={crumbLinkClass}>{children}</Slot>
  ) : href && !active ? (
    <a href={href} className={crumbLinkClass}>
      {children}
    </a>
  ) : (
    <span
      className={cn("block", active && "font-medium text-gray-900")}
      aria-current={active ? "page" : undefined}
    >
      {children}
    </span>
  );

  return (
    <li className={cn(className)} {...props}>
      {content}
    </li>
  );
};
