import type { FC, ReactNode } from "react";

import { Typography } from "@/components/typography";
import { WindowFrame } from "@/components/window-frame";

type PageHeaderProps = {
  badge?: ReactNode;
  title: string;
  subtitle?: ReactNode;
};

export const PageHeader: FC<PageHeaderProps> = ({ badge, title, subtitle }) => {
  return (
    <section className="w-full bg-[var(--bg-primary)] px-5 py-8 text-[var(--fg-on-accent)] md:px-12 md:py-10">
      <WindowFrame
        title="page.title"
        clip={false}
        className="bg-[var(--bg-accent-pink)]"
      >
        <div className="flex flex-col items-start gap-4 px-5 py-8 md:px-10 md:py-10">
          {badge}
          <span className="font-[family-name:var(--font-mono)] text-[11px] font-medium tracking-[0.08em] text-[var(--fg-on-accent)]/70">
            STATUS / PAGE
          </span>
          <Typography asChild size="4xl">
            <h1 className="max-w-[18ch] text-[var(--fg-on-accent)]">{title}</h1>
          </Typography>
          {subtitle ? (
            <div className="max-w-lg text-[var(--fg-on-accent)]/80">
              {subtitle}
            </div>
          ) : null}
        </div>
      </WindowFrame>
    </section>
  );
};
