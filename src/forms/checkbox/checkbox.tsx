import type { FC } from "react";
import type { ComponentPropsWithoutChildren } from "@/lib/component-props";
import { cn } from "@/lib/utils";

export interface CheckboxProps extends ComponentPropsWithoutChildren<"input"> {
  label: string;
}

export const Checkbox: FC<CheckboxProps> = ({
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
        type="checkbox"
        id={id}
        className={cn(
          "size-6 cursor-pointer rounded-sm border-2 border-black shadow-[2px_2px_0_0] shadow-black checked:bg-black focus-visible:focus-ring-sm",
          className,
        )}
        {...props}
      />
      <span className="font-semibold text-black">{label}</span>
    </label>
  );
};
