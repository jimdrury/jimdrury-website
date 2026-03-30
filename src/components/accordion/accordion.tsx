import {
  Children,
  cloneElement,
  type FC,
  isValidElement,
  type ReactElement,
  type ReactNode,
} from "react";
import { FaChevronDown } from "react-icons/fa";
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
          ? "overflow-hidden rounded-md divide-y-2 divide-black border-2 border-black shadow-[4px_4px_0_0]"
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
          "flex cursor-pointer items-center justify-between gap-4 bg-white px-4 py-3 font-medium text-gray-900",
          grouped
            ? "hover:bg-yellow-100 focus-visible:bg-yellow-100 focus-visible:focus-ring"
            : "rounded-md border-2 border-black text-black shadow-[4px_4px_0_0] hover:bg-yellow-100 focus-visible:bg-yellow-100 focus-visible:focus-ring",
        )}
      >
        <span className="flex min-w-0 flex-1 items-center gap-3">
          {LeadingIcon ? (
            <LeadingIcon aria-hidden className={leadingIconClassName} />
          ) : null}
          {header ?? (
            <span className={cn("font-semibold", !grouped && "text-black")}>
              {title}
            </span>
          )}
        </span>
        <FaChevronDown aria-hidden className={chevronClassName} />
      </summary>
      <div className={cn("p-4", grouped && "border-t-2 border-black")}>
        {children}
      </div>
    </details>
  );
};
