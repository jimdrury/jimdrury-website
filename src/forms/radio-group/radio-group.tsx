import type { FC, ReactNode } from "react";
import type { ComponentPropsWithoutChildren } from "@/lib/component-props";
import { cn } from "@/lib/utils";

export interface RadioGroupProps
  extends ComponentPropsWithoutChildren<"fieldset"> {
  children?: ReactNode;
  legend?: string;
}

export const RadioGroup: FC<RadioGroupProps> = ({
  className,
  legend,
  children,
  ...props
}) => {
  return (
    <fieldset className={cn("", className)} {...props}>
      {legend && <legend className="sr-only">{legend}</legend>}
      <div className="flex flex-col items-start gap-3">{children}</div>
    </fieldset>
  );
};

export interface RadioOptionProps
  extends ComponentPropsWithoutChildren<"input"> {
  label: string;
}

export const RadioOption: FC<RadioOptionProps> = ({
  className,
  label,
  id,
  ...props
}) => {
  return (
    <label
      htmlFor={id}
      className="inline-flex cursor-pointer items-center gap-3"
    >
      <input
        type="radio"
        id={id}
        className={cn(
          "size-6 cursor-pointer rounded-full border-2 border-black shadow-[2px_2px_0_0] shadow-black checked:bg-black focus-visible:focus-ring-sm",
          className,
        )}
        {...props}
      />
      <span className="font-semibold text-black">{label}</span>
    </label>
  );
};
