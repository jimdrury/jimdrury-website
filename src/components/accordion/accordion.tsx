import {
  Children,
  cloneElement,
  type FC,
  isValidElement,
  type ReactElement,
  type ReactNode,
} from "react";
import { LuChevronDown } from "react-icons/lu";
import { IconBox } from "@/components/icon-box";
import type { ComponentPropsWithoutChildren } from "@/lib/component-props";
import type { IconReference } from "@/lib/icon-ref";
import { cn } from "@/lib/utils";

export type { IconReference };

export interface AccordionProps extends ComponentPropsWithoutChildren<"div"> {
  children?: ReactNode;
  /** When true, items sit in one bordered frame with dividers between rows (FAQ-style). */
  grouped?: boolean;
}

export const Accordion: FC<AccordionProps> = ({
  className,
  children,
  grouped = false,
  ...props
}) => {
  const renderedChildren = grouped
    ? Children.map(children, (child) => {
        if (!isValidElement(child)) {
          return child;
        }

        return cloneElement(child as ReactElement<{ grouped?: boolean }>, {
          grouped: true,
        });
      })
    : children;

  return (
    <div
      className={cn(
        grouped
          ? "overflow-hidden rounded-none divide-y divide-[var(--color-border)] border border-[var(--color-border)]"
          : "space-y-3",
        className,
      )}
      {...props}
    >
      {renderedChildren}
    </div>
  );
};

export interface AccordionItemProps
  extends ComponentPropsWithoutChildren<"details"> {
  children?: ReactNode;
  title: string;
  /** Internal flag injected by Accordion when `grouped` is enabled. */
  grouped?: boolean;
  /** Custom summary content; when provided, replaces the default title text node. */
  header?: ReactNode;
  /** Optional leading icon before the title; chevron expand indicator stays on the right. */
  icon?: IconReference;
}

export const AccordionItem: FC<AccordionItemProps> = ({
  className,
  title,
  grouped = false,
  header,
  children,
  icon: LeadingIcon,
  ...props
}) => {
  const sizeClass = grouped ? "size-5" : "size-4";
  const leadingIconClassName = cn("shrink-0", sizeClass);
  const chevronClassName = cn(
    "shrink-0 transition-transform group-open:-rotate-180",
    sizeClass,
  );

  return (
    <details
      className={cn(
        "group [&_summary::-webkit-details-marker]:hidden",
        className,
      )}
      {...props}
    >
      <summary
        className={cn(
          "flex cursor-pointer items-start justify-between gap-4 bg-[var(--bg-primary)] px-4 py-3 font-medium text-[var(--fg-primary)]",
          grouped
            ? "hover:bg-[var(--bg-secondary)] focus-visible:bg-[var(--bg-secondary)] focus-visible:focus-ring"
            : "rounded-none border border-[var(--color-border)] hover:bg-[var(--bg-secondary)] focus-visible:bg-[var(--bg-secondary)] focus-visible:focus-ring",
        )}
      >
        <span className="flex min-w-0 flex-1 items-start gap-3">
          {LeadingIcon ? (
            <LeadingIcon aria-hidden className={leadingIconClassName} />
          ) : null}
          {header ?? (
            <span className={cn("font-semibold", !grouped && "text-black")}>
              {title}
            </span>
          )}
        </span>
        <IconBox size="sm" className="self-center">
          <LuChevronDown className={chevronClassName} />
        </IconBox>
      </summary>
      <div
        className={cn(
          "p-4",
          grouped && "border-t border-[var(--color-border)]",
        )}
      >
        {children}
      </div>
    </details>
  );
};
