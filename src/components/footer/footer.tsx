import type { FC, ReactNode } from "react";
import type { ComponentPropsWithoutChildren } from "@/lib/component-props";
import { cn } from "@/lib/utils";

export interface FooterProps extends ComponentPropsWithoutChildren<"footer"> {
  children?: ReactNode;
}

export const Footer: FC<FooterProps> = ({ className, children, ...props }) => {
  return (
    <footer
      className={cn(
        "border-t-2 border-black bg-white text-black px-4 py-8 sm:px-6",
        className,
      )}
      {...props}
    >
      <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">{children}</div>
    </footer>
  );
};

export interface FooterColumnProps
  extends ComponentPropsWithoutChildren<"div"> {
  children?: ReactNode;
  title: string;
}

export const FooterColumn: FC<FooterColumnProps> = ({
  className,
  title,
  children,
  ...props
}) => {
  return (
    <div className={className} {...props}>
      <h3 className="font-bold">{title}</h3>
      <ul className="mt-3 space-y-2 text-sm">{children}</ul>
    </div>
  );
};
