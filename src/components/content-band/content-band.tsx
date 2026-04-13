import type { FC, ReactNode } from "react";

import { HERO_CONTENT_INNER_CLASS } from "@/components/hero";
import type { ComponentPropsWithoutChildren } from "@/lib/component-props";
import { cn } from "@/lib/utils";

export type ContentBandContentLayout = "grid" | "stack";

export interface ContentBandInnerProps {
  children: ReactNode;
  className?: string;
}

export const ContentBandInner: FC<ContentBandInnerProps> = ({
  children,
  className,
}) => (
  <div
    className={cn(
      "@container space-y-8 lg:space-y-12",
      HERO_CONTENT_INNER_CLASS,
      className,
    )}
  >
    {children}
  </div>
);

export interface ContentBandHeaderRowProps {
  heading: ReactNode | null;
  aside: ReactNode | null;
  className?: string;
}

export const ContentBandHeaderRow: FC<ContentBandHeaderRowProps> = ({
  heading,
  aside,
  className,
}) => {
  if (!heading && !aside) {
    return null;
  }

  if (heading && !aside) {
    return <header className={className}>{heading}</header>;
  }

  if (!heading && aside) {
    return (
      <header className={cn("flex justify-end", className)}>{aside}</header>
    );
  }

  return (
    <header
      className={cn(
        "flex flex-col gap-4 md:flex-row md:items-end md:justify-between",
        className,
      )}
    >
      <div className="min-w-0 flex-1">{heading}</div>
      <div className="min-w-0 shrink-0 md:max-w-md md:text-right">{aside}</div>
    </header>
  );
};

const gridLayoutClassName = cn(
  "grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3",
);

export interface ContentBandBodyRegionProps {
  contentLayout: ContentBandContentLayout;
  children: ReactNode;
  className?: string;
}

export const ContentBandBodyRegion: FC<ContentBandBodyRegionProps> = ({
  contentLayout,
  children,
  className,
}) => {
  if (contentLayout === "grid") {
    return <div className={cn(gridLayoutClassName, className)}>{children}</div>;
  }

  return (
    <div className={cn("flex flex-col space-y-4", className)}>{children}</div>
  );
};

export interface ContentBandSurfaceProps
  extends ComponentPropsWithoutChildren<"section"> {
  children: ReactNode;
}

export const ContentBandSurface: FC<ContentBandSurfaceProps> = ({
  children,
  className,
  style,
  ...props
}) => (
  <section className={cn("w-full", className)} style={style} {...props}>
    {children}
  </section>
);
