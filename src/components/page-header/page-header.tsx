import type { FC, ReactNode } from "react";

import { Typography } from "@/components/typography";

type PageHeaderProps = {
  badge?: ReactNode;
  title: string;
  subtitle?: ReactNode;
};

export const PageHeader: FC<PageHeaderProps> = ({ badge, title, subtitle }) => {
  return (
    <section className="flex w-full flex-col items-center gap-4 border-b-[3px] border-[var(--fg-primary)] bg-[var(--bg-secondary)] px-6 py-12 md:px-20 md:py-16">
      {badge}
      <Typography asChild size="6xl">
        <h1>{title}</h1>
      </Typography>
      {subtitle ? (
        <div className="max-w-lg text-center text-[var(--fg-secondary)]">
          {subtitle}
        </div>
      ) : null}
    </section>
  );
};
