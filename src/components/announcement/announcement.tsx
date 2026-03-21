import { Slot } from "@radix-ui/react-slot";
import type { FC, ReactNode } from "react";
import type { ComponentPropsWithoutChildren } from "@/lib/component-props";
import { cn } from "@/lib/utils";

export interface AnnouncementProps
  extends ComponentPropsWithoutChildren<"div"> {
  children?: ReactNode;
  asChild?: boolean;
}

export const Announcement: FC<AnnouncementProps> = ({
  asChild,
  className,
  children,
  ...props
}) => {
  const Comp = asChild ? Slot : "div";
  return (
    <Comp
      className={cn(
        "block w-full border-b-2 border-black bg-yellow-300 px-4 py-2 text-center text-sm font-semibold text-black",
        asChild && "underline decoration-black decoration-2 underline-offset-2",
        className,
      )}
      {...props}
    >
      {children}
    </Comp>
  );
};
