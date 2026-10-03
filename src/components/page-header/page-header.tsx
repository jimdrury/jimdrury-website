import type { FC, ReactNode } from "react";

import { Typography } from "@/components/typography";

type PageHeaderProps = {
  badge?: ReactNode;
  title: string;
  subtitle?: ReactNode;
};

export const PageHeader: FC<PageHeaderProps> = ({ badge, title, subtitle }) => {
  return (
    <section className="flex w-full flex-col items-start gap-4 border-b border-[var(--color-border)] bg-[var(--bg-accent-pink)] px-6 py-12 text-[var(--fg-on-accent)] md:px-20 md:py-16">
      {badge}
      <Typography asChild size="6xl">
        <h1>{title}</h1>
      </Typography>
      {subtitle ? (
        <div className="max-w-lg text-[var(--fg-on-accent)]/80">{subtitle}</div>
      ) : null}
    </section>
  );
};
