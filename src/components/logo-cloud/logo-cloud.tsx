import type { FC, ReactNode } from "react";
import type { ComponentPropsWithoutChildren } from "@/lib/component-props";
import { cn } from "@/lib/utils";

export interface LogoCloudProps extends ComponentPropsWithoutChildren<"div"> {
  children?: ReactNode;
  title?: string;
}

export const LogoCloud: FC<LogoCloudProps> = ({
  className,
  title,
  children,
  ...props
}) => {
  return (
    <div className={cn("py-8 text-center", className)} {...props}>
      {title && (
        <h2 className="mb-6 text-lg font-bold text-gray-600">{title}</h2>
      )}
      <div className="flex flex-wrap items-center justify-center gap-8">
        {children}
      </div>
    </div>
  );
};
