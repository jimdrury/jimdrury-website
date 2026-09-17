import type { FC, ReactNode } from "react";
import { Typography } from "@/components/typography";
import type { ComponentPropsWithoutChildren } from "@/lib/component-props";

export interface SectionTitleProps extends ComponentPropsWithoutChildren<"h2"> {
  children?: ReactNode;
}

export const SectionTitle: FC<SectionTitleProps> = ({
  children,
  className,
  ...props
}) => {
  return (
    <Typography asChild size="4xl">
      <h2 className={className} {...props}>
        {children}
      </h2>
    </Typography>
  );
};
