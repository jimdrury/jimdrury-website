import type { FC } from "react";
import type { ComponentPropsWithoutChildren } from "@/lib/component-props";
import { cn } from "@/lib/utils";

export interface RangeInputProps
  extends ComponentPropsWithoutChildren<"input"> {
  label?: string;
}

export const RangeInput: FC<RangeInputProps> = ({
  className,
  label,
  id,
  ...props
}) => {
  return (
    <label htmlFor={id}>
      {label && (
        <span className="text-sm font-semibold text-black">{label}</span>
      )}
      <input
        type="range"
        id={id}
        className={cn(
          "mt-0.5 w-full cursor-pointer accent-black focus-visible:focus-ring",
          className,
        )}
        {...props}
      />
    </label>
  );
};
