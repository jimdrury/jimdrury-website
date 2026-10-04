import { format, isValid, parseISO } from "date-fns";
import type { FC, ReactNode } from "react";
import { Link } from "@/components/link";
import { Spine } from "@/components/spine";
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
  yellow: "bg-[var(--bg-accent-yellow)]",
  blue: "bg-[var(--bg-accent-blue)]",
  green: "bg-[var(--bg-accent-green)]",
  pink: "bg-[var(--bg-accent-pink)]",
  orange: "bg-[var(--bg-accent-orange)]",
  purple: "bg-[var(--bg-accent-purple)]",
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
        "flex flex-col gap-8 overflow-visible bg-[var(--bg-primary)] py-4 md:flex-row md:gap-8 md:py-6",
        className,
      )}
      {...props}
    >
      <Spine
        label={`${fromLabel} — ${toLabel}`}
        ruleClassName={colourClasses[colour]}
      >
        <div className="flex flex-col gap-2">
          <h3 className="font-[family-name:var(--font-geist-sans)] text-2xl font-medium leading-[0.95] tracking-[-0.03em] text-[var(--fg-primary)] md:text-[32px]">
            {role}
          </h3>
          <p className="richtext-external-link-indicator font-[family-name:var(--font-inter)] text-sm font-medium tracking-[-0.01em] text-[var(--fg-primary)]">
            {safeCompanyWebsiteUrl ? (
              <Link
                href={safeCompanyWebsiteUrl}
                target="_blank"
                rel="noreferrer"
              >
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
      </Spine>
    </div>
  );
};
