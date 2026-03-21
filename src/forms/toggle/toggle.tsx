"use client";

import type { FC } from "react";
import type { ComponentPropsWithoutChildren } from "@/lib/component-props";
import { cn } from "@/lib/utils";

export interface ToggleProps extends ComponentPropsWithoutChildren<"input"> {
  label: string;
}

export const Toggle: FC<ToggleProps> = ({ className, label, id, ...props }) => {
  return (
    <label
      htmlFor={id}
      className="inline-flex cursor-pointer items-center gap-3"
    >
      <div className="relative">
        <input type="checkbox" id={id} className="peer sr-only" {...props} />
        <div
          className={cn(
            "h-8 w-14 border-2 border-black bg-white shadow-[2px_2px_0_0] peer-checked:bg-yellow-300 peer-focus-visible:focus-ring-sm",
            className,
          )}
        />
        <div className="absolute top-1 left-1 size-6 border-2 border-black bg-white transition-all peer-checked:translate-x-6" />
      </div>
      <span className="font-semibold text-black">{label}</span>
    </label>
  );
};
