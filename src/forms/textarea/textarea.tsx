import type { FC } from "react";
import type { ComponentPropsWithoutChildren } from "@/lib/component-props";
import { cn } from "@/lib/utils";

export interface TextareaProps
  extends ComponentPropsWithoutChildren<"textarea"> {
  label?: string;
}

export const Textarea: FC<TextareaProps> = ({
  className,
  label,
  id,
  rows = 4,
  ...props
}) => {
  return (
    <label htmlFor={id}>
      {label && (
        <span className="text-sm font-semibold text-black">{label}</span>
      )}
      <textarea
        id={id}
        rows={rows}
        className={cn(
          "mt-0.5 w-full resize-none rounded-md border-2 border-black shadow-[4px_4px_0_0] focus-visible:focus-ring sm:text-sm",
          className,
        )}
        {...props}
      />
    </label>
  );
};
