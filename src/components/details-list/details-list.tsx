import type { FC, ReactNode } from "react";
import type { ComponentPropsWithoutChildren } from "@/lib/component-props";
import { cn } from "@/lib/utils";

export interface DetailsListProps extends ComponentPropsWithoutChildren<"dl"> {
  children?: ReactNode;
}

export const DetailsList: FC<DetailsListProps> = ({
  className,
  children,
  ...props
}) => {
  return (
    <dl
      className={cn(
        "overflow-hidden rounded-md divide-y-2 divide-black border-2 border-black bg-white text-black shadow-[4px_4px_0_0]",
        className,
      )}
      {...props}
    >
      {children}
    </dl>
  );
};

export interface DetailsItemProps extends ComponentPropsWithoutChildren<"div"> {
  children?: ReactNode;
  term: ReactNode;
}

export const DetailsItem: FC<DetailsItemProps> = ({
  className,
  term,
  children,
  ...props
}) => {
  return (
    <div
      className={cn("flex items-center justify-between px-4 py-3", className)}
      {...props}
    >
      <dt className="text-sm font-semibold text-gray-600">{term}</dt>
      <dd className="font-semibold text-black">{children}</dd>
    </div>
  );
};
