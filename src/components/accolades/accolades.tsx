import type { FC, ReactNode } from "react";
import { EdgeMarkers } from "@/components/edge-markers";
import { SectionTitle } from "@/components/section-title";
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
        "relative w-full bg-[var(--bg-sage)] py-10 lg:py-16",
        className,
      )}
      {...props}
    >
      <EdgeMarkers />
      <div className="mx-auto w-full max-w-[1400px] px-5 lg:px-12">
        <SectionTitle className="mb-6">{title}</SectionTitle>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 md:gap-8">
          {children}
        </div>
      </div>
    </section>
  );
};
