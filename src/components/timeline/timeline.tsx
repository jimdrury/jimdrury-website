import type { FC, ReactNode } from "react";
import type { ComponentPropsWithoutChildren } from "@/lib/component-props";
import { cn } from "@/lib/utils";

export interface TimelineProps extends ComponentPropsWithoutChildren<"ol"> {
  children?: ReactNode;
}

export const Timeline: FC<TimelineProps> = ({
  className,
  children,
  ...props
}) => {
  return (
    <ol
      className={cn("relative border-l-4 border-black", className)}
      {...props}
    >
      {children}
    </ol>
  );
};

export interface TimelineItemProps extends ComponentPropsWithoutChildren<"li"> {
  children?: ReactNode;
  date?: string;
  title: string;
}

export const TimelineItem: FC<TimelineItemProps> = ({
  className,
  date,
  title,
  children,
  ...props
}) => {
  return (
    <li className={cn("mb-6 ml-6", className)} {...props}>
      <span className="absolute -left-3 flex size-6 items-center justify-center border-2 border-black bg-yellow-300" />
      {date && (
        <time className="text-xs font-semibold uppercase text-gray-500">
          {date}
        </time>
      )}
      <h3 className="text-lg font-bold">{title}</h3>
      {children && <div className="mt-1 text-sm">{children}</div>}
    </li>
  );
};
