import { format, isValid, parseISO } from "date-fns";
import type { FC, ReactNode } from "react";
import { Link } from "@/components/link";
import { getSafeHref } from "@/lib/assert-safe-href";
import type { ComponentPropsWithoutChildren } from "@/lib/component-props";
import { cn } from "@/lib/utils";

export type CareerHistoryColour =
  | "yellow"
  | "blue"
  | "green"
  | "pink"
  | "orange"
  | "purple";

export interface CareerHistoryItemProps
  extends ComponentPropsWithoutChildren<"div"> {
  from: string;
  to?: string;
  role: string;
  company: string;
  companyWebsiteUrl?: string;
  colour?: CareerHistoryColour;
  description: ReactNode;
}

const formatDateLabel = (value: string): string => {
  const normalized = value.trim();
  if (!normalized) {
    return value;
  }

  const parsed = parseISO(normalized);
  if (!isValid(parsed)) {
    return normalized;
  }

  return format(parsed, "MMM yyyy");
};

const colourClasses: Record<CareerHistoryColour, string> = {
  yellow: "border-l-[var(--bg-accent-yellow)]",
  blue: "border-l-[var(--bg-accent-blue)]",
  green: "border-l-[var(--bg-accent-green)]",
  pink: "border-l-[var(--bg-accent-pink)]",
  orange: "border-l-[var(--bg-accent-orange)]",
  purple: "border-l-[var(--bg-accent-purple)]",
};

export const CareerHistoryItem: FC<CareerHistoryItemProps> = ({
  from,
  to,
  role,
  company,
  companyWebsiteUrl,
  colour = "yellow",
  description,
  className,
  ...props
}) => {
  const fromLabel = formatDateLabel(from);
  const toLabel = to?.trim() ? formatDateLabel(to) : "Present";
  const safeCompanyWebsiteUrl = getSafeHref(companyWebsiteUrl);

  return (
    <div
      className={cn(
        "flex flex-col gap-8 rounded-none border border-[var(--color-border)] border-l-2 bg-[var(--bg-primary)] p-6 md:flex-row md:gap-8 md:p-8",
        colourClasses[colour],
        className,
      )}
      {...props}
    >
      <div className="flex shrink-0 flex-col gap-1 md:w-52">
        <p className="font-[family-name:var(--font-mono)] text-[12px] font-medium uppercase leading-tight tracking-[0.08em] text-[var(--fg-secondary)]">
          {fromLabel} &mdash; {toLabel}
        </p>
      </div>

      <div className="flex flex-col gap-2 mt-[-4px]">
        <h3 className="font-[family-name:var(--font-geist-sans)] text-2xl font-medium leading-[0.95] tracking-[-0.03em] text-[var(--fg-primary)] md:text-[32px]">
          {role}
        </h3>
        <p className="richtext-external-link-indicator font-[family-name:var(--font-inter)] text-sm font-medium tracking-[-0.01em] text-[var(--fg-primary)]">
          {safeCompanyWebsiteUrl ? (
            <Link href={safeCompanyWebsiteUrl} target="_blank" rel="noreferrer">
              {company}
            </Link>
          ) : (
            company
          )}
        </p>
        <div className="richtext-external-link-indicator mt-2 max-w-[70ch] text-pretty font-[family-name:var(--font-inter)] text-base font-normal leading-relaxed [&_a]:font-semibold [&_a]:underline [&_a]:underline-offset-2 [&_p]:m-0 [&_p+p]:mt-2">
          {description}
        </div>
      </div>
    </div>
  );
};
