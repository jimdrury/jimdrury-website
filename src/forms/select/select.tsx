import type { FC, ReactNode } from "react";
import type { ComponentPropsWithoutChildren } from "@/lib/component-props";
import { cn } from "@/lib/utils";

export interface SelectProps extends ComponentPropsWithoutChildren<"select"> {
  children?: ReactNode;
  label?: string;
}

export const Select: FC<SelectProps> = ({
  className,
  label,
  id,
  children,
  ...props
}) => {
  return (
    <label htmlFor={id}>
      {label && (
        <span className="text-sm font-semibold text-black">{label}</span>
      )}
      <select
        id={id}
        className={cn(
          "mt-0.5 w-full cursor-pointer rounded-md border-2 border-black shadow-[4px_4px_0_0] focus-visible:focus-ring sm:text-sm",
          className,
        )}
        {...props}
      >
        {children}
      </select>
    </label>
  );
};
