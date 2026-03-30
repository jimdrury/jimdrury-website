import { format, isValid, parseISO } from "date-fns";
import type { FC, ReactNode } from "react";
import { Link } from "@/components/link";
import type { ComponentPropsWithoutChildren } from "@/lib/component-props";
import { cn } from "@/lib/utils";

export interface CareerHistoryItemProps
  extends ComponentPropsWithoutChildren<"div"> {
  from: string;
  to?: string;
  role: string;
  company: string;
  companyWebsiteUrl?: string;
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

export const CareerHistoryItem: FC<CareerHistoryItemProps> = ({
  from,
  to,
  role,
  company,
  companyWebsiteUrl,
  description,
  className,
  ...props
}) => {
  const periodLabel = `${formatDateLabel(from)} - ${
    to?.trim() ? formatDateLabel(to) : "Present"
  }`;

  return (
    <div
      className={cn(
        "grid gap-2 border-b border-black pb-3 md:grid-cols-[12rem_minmax(0,1fr)] md:gap-6 md:pb-4",
        className,
      )}
      {...props}
    >
      <p className="text-sm font-bold tracking-wide text-slate-800">
        {periodLabel}
      </p>
      <div className="space-y-1">
        <p className="text-pretty text-lg font-extrabold leading-tight text-slate-900 md:text-2xl">
          {role}
        </p>
        <p className="richtext-external-link-indicator text-sm font-semibold text-slate-800">
          {companyWebsiteUrl ? (
            <Link href={companyWebsiteUrl} target="_blank" rel="noreferrer">
              {company}
            </Link>
          ) : (
            company
          )}
        </p>
        <div className="richtext-external-link-indicator text-pretty text-base leading-relaxed text-slate-700 [&_a]:font-semibold [&_a]:underline [&_a]:underline-offset-2 [&_p]:m-0 [&_p+p]:mt-2">
          {description}
        </div>
      </div>
    </div>
  );
};
