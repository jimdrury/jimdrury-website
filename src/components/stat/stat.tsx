import type { FC, ReactNode } from "react";
import type { ComponentPropsWithoutChildren } from "@/lib/component-props";
import { cn } from "@/lib/utils";

export interface StatProps extends ComponentPropsWithoutChildren<"div"> {
  children?: ReactNode;
  value: ReactNode;
  label: string;
  change?: string;
  trend?: "up" | "down";
  trendUpSymbol?: ReactNode;
  trendDownSymbol?: ReactNode;
  trendClassName?: string;
  trendUpClassName?: string;
  trendDownClassName?: string;
  trendNeutralClassName?: string;
}

export const Stat: FC<StatProps> = ({
  className,
  value,
  label,
  change,
  trend,
  trendUpSymbol = "↑",
  trendDownSymbol = "↓",
  trendClassName,
  trendUpClassName = "text-green-700",
  trendDownClassName = "text-red-700",
  trendNeutralClassName = "text-gray-700",
  children,
  ...props
}) => {
  return (
    <div
      className={cn(
        "border-2 border-black bg-white text-black p-6 shadow-[4px_4px_0_0]",
        className,
      )}
      {...props}
    >
      <p className="text-sm font-semibold text-gray-600">{label}</p>
      <p className="mt-1 text-3xl font-bold">{value}</p>
      {change && (
        <p
          className={cn(
            "mt-2 text-sm font-semibold",
            trend === "up"
              ? trendUpClassName
              : trend === "down"
                ? trendDownClassName
                : trendNeutralClassName,
            trendClassName,
          )}
        >
          {trend === "up"
            ? trendUpSymbol
            : trend === "down"
              ? trendDownSymbol
              : ""}{" "}
          {change}
        </p>
      )}
      {children}
    </div>
  );
};
