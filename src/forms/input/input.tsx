import type { FC } from "react";
import type { ComponentPropsWithoutChildren } from "@/lib/component-props";
import { cn } from "@/lib/utils";

export interface InputProps extends ComponentPropsWithoutChildren<"input"> {
  label?: string;
}

export const Input: FC<InputProps> = ({ className, label, id, ...props }) => {
  return (
    <label htmlFor={id}>
      {label && (
        <span className="text-sm font-semibold text-black">{label}</span>
      )}
      <input
        id={id}
        className={cn(
          "mt-0.5 w-full rounded-md border-2 border-black shadow-[4px_4px_0_0] focus-visible:focus-ring sm:text-sm",
          className,
        )}
        {...props}
      />
    </label>
  );
};
