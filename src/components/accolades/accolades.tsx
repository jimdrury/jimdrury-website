import type { FC, ReactNode } from "react";
import { Typography } from "@/components/typography";
import type { ComponentPropsWithoutChildren } from "@/lib/component-props";
import { cn } from "@/lib/utils";

export interface AccoladesProps
  extends ComponentPropsWithoutChildren<"section"> {
  title?: string;
  children?: ReactNode;
}

export const Accolades: FC<AccoladesProps> = ({
  title = "Accolades",
  children,
  className,
  ...props
}) => {
  return (
    <section
      className={cn(
        "w-full bg-[var(--bg-secondary)] py-10 lg:py-14",
        className,
      )}
      {...props}
    >
      <div className="mx-auto w-full max-w-[1400px] px-5 lg:px-12">
        <Typography size="5xl" asChild>
          <h2 className="mb-6 uppercase text-[var(--fg-primary)]">{title}</h2>
        </Typography>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">{children}</div>
      </div>
    </section>
  );
};
