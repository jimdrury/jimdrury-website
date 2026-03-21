import type { FC } from "react";
import type { ComponentPropsWithoutChildren } from "@/lib/component-props";
import { cn } from "@/lib/utils";

export interface DividerProps extends ComponentPropsWithoutChildren<"hr"> {
  label?: string;
}

export const Divider: FC<DividerProps> = ({ className, label, ...props }) => {
  if (label) {
    return (
      <div className="flex items-center gap-4">
        <hr
          className={cn("flex-1 border-t-2 border-black", className)}
          {...props}
        />
        <span className="font-semibold text-sm">{label}</span>
        <hr className={cn("flex-1 border-t-2 border-black", className)} />
      </div>
    );
  }
  return <hr className={cn("border-t-2 border-black", className)} {...props} />;
};
