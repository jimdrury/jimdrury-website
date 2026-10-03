import type { FC, ReactNode } from "react";

import { RuleMarks } from "@/components/rule-box";
import { Typography } from "@/components/typography";
import { WindowFrame } from "@/components/window-frame";

type PageHeaderProps = {
  badge?: ReactNode;
  title: string;
  subtitle?: ReactNode;
  path?: string;
};

export const PageHeader: FC<PageHeaderProps> = ({
  badge,
  title,
  subtitle,
  path,
}) => {
  return (
    <section className="w-full bg-[var(--bg-primary)] px-5 py-8 md:px-12 md:py-10">
      <div className="os-desktop relative overflow-visible p-4 md:p-6">
        <RuleMarks variant="corners" />
        <WindowFrame
          title={path ?? "page.title"}
          variant="document"
          clip={false}
        >
          <div className="flex flex-col items-start gap-4 px-5 py-8 md:px-10 md:py-10">
            {badge}
            <Typography asChild size="4xl">
              <h1 className="max-w-[18ch] text-[var(--fg-primary)]">{title}</h1>
            </Typography>
            {subtitle ? (
              <div className="max-w-lg text-[var(--fg-secondary)]">
                {subtitle}
              </div>
            ) : null}
          </div>
        </WindowFrame>
      </div>
    </section>
  );
};
