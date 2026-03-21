import type { FC, ReactNode } from "react";
import type { ComponentPropsWithoutChildren } from "@/lib/component-props";
import type { IconReference } from "@/lib/icon-ref";
import { cn } from "@/lib/utils";

export interface FeatureGridProps extends ComponentPropsWithoutChildren<"div"> {
  children?: ReactNode;
}

export const FeatureGrid: FC<FeatureGridProps> = ({
  className,
  children,
  ...props
}) => {
  return (
    <div
      className={cn(
        "grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
};

export interface FeatureProps extends ComponentPropsWithoutChildren<"div"> {
  children?: ReactNode;
  icon?: IconReference;
  title: string;
}

export const Feature: FC<FeatureProps> = ({
  className,
  icon: Icon,
  title,
  children,
  ...props
}) => {
  return (
    <div
      className={cn(
        "rounded-md border-2 border-black bg-white p-6 text-black shadow-[4px_4px_0_0]",
        className,
      )}
      {...props}
    >
      {Icon ? (
        <span className="mb-3 inline-flex text-black" aria-hidden>
          <Icon className="size-8" />
        </span>
      ) : null}
      <h3 className="font-bold">{title}</h3>
      {children && <p className="mt-2 text-sm text-gray-600">{children}</p>}
    </div>
  );
};
