import { format, isValid } from "date-fns";
import type { FC, ReactNode } from "react";
import { LuArrowRight } from "react-icons/lu";
import type { ComponentPropsWithoutChildren } from "@/lib/component-props";
import { cn } from "@/lib/utils";

export interface PublicEventProps
  extends ComponentPropsWithoutChildren<"article"> {
  eventDate: string;
  endDate?: string;
  organizer?: string;
  address?: string;
  performer?: string;
  eventStatus?: string;
  title: string;
  description: string;
  badge?: ReactNode;
  linkText?: string;
  linkUrl?: string;
}

const DATE_PATTERN = /^(\d{4})-(\d{2})-(\d{2})/;

/**
 * Parse the YYYY-MM-DD portion only, ignoring any timezone Storyblok appends.
 * Returns a local-timezone Date so `format()` never shifts the day.
 */
const parseGMTDate = (value: string): Date | null => {
  const match = value.match(DATE_PATTERN);
  if (!match) {
    return null;
  }
  const date = new Date(
    Number(match[1]),
    Number(match[2]) - 1,
    Number(match[3]),
  );
  return isValid(date) ? date : null;
};

const formatEventDate = (value: string): string => {
  const parsed = parseGMTDate(value);
  if (!parsed) {
    return value;
  }
  return format(parsed, "d MMM yyyy");
};

const formatDateRange = (start: string, end?: string): string => {
  const label = formatEventDate(start);
  if (!end) {
    return label;
  }
  const parsedEnd = parseGMTDate(end);
  if (!parsedEnd) {
    return label;
  }
  const parsedStart = parseGMTDate(start);
  if (!parsedStart || parsedStart.getTime() === parsedEnd.getTime()) {
    return label;
  }
  return `${label} – ${formatEventDate(end)}`;
};

export const PublicEvent: FC<PublicEventProps> = ({
  eventDate,
  endDate,
  organizer,
  address,
  performer,
  eventStatus,
  title,
  description,
  badge,
  linkText,
  linkUrl,
  className,
  ...props
}) => {
  const safeOrganizer = organizer?.trim();
  const safeAddress = address?.trim();
  const safePerformer = performer?.trim() || safeOrganizer;
  const safeEventStatus =
    eventStatus?.trim() || "https://schema.org/EventScheduled";
  const safeLinkUrl = linkUrl?.trim();
  const safeLinkText = linkText?.trim() || "View event details";
  const dateLabel = formatDateRange(eventDate, endDate);
  const startTimestamp = Date.parse(eventDate);
  const endTimestamp = endDate ? Date.parse(endDate) : Number.NaN;
  const hasDistinctEndDate =
    Number.isFinite(startTimestamp) &&
    Number.isFinite(endTimestamp) &&
    startTimestamp !== endTimestamp;
  const safeEndDate = hasDistinctEndDate ? endDate?.trim() : undefined;

  const dateClassName =
    "shrink-0 font-[family-name:var(--font-geist-mono)] text-base font-bold tracking-[2px] text-[var(--bg-accent-pink)]";

  const header = (
    <div className="flex w-full flex-col gap-2">
      <div className="flex items-center justify-between gap-3">
        <span className={dateClassName}>{dateLabel}</span>
        {badge}
      </div>
      <span className="font-[family-name:var(--font-anton)] text-2xl font-normal leading-tight tracking-[1px] text-[var(--fg-primary)]">
        {title}
      </span>
      {safeOrganizer || safeAddress ? (
        <span className="font-[family-name:var(--font-inter)] text-[13px] font-medium text-[var(--fg-secondary)]">
          {[safeOrganizer, safeAddress].filter(Boolean).join(" · ")}
        </span>
      ) : null}
    </div>
  );

  return (
    <article
      className={cn(
        "w-full border-b-2 border-black pb-12 last:border-b-0 last:pb-0",
        className,
      )}
      itemScope
      itemType="https://schema.org/Event"
      {...props}
    >
      {/* Microdata only — must not sit in the same flex column as the body or gap stacks between every meta/span. */}
      <div className="sr-only">
        <meta itemProp="name" content={title} />
        <meta itemProp="startDate" content={eventDate} />
        {safeEndDate ? <meta itemProp="endDate" content={safeEndDate} /> : null}
        <meta itemProp="eventStatus" content={safeEventStatus} />
        {safeLinkUrl ? <meta itemProp="url" content={safeLinkUrl} /> : null}
        {safeOrganizer ? (
          <span
            itemProp="organizer"
            itemScope
            itemType="https://schema.org/Organization"
          >
            <meta itemProp="name" content={safeOrganizer} />
          </span>
        ) : null}
        {safePerformer ? (
          <span
            itemProp="performer"
            itemScope
            itemType="https://schema.org/Person"
          >
            <meta itemProp="name" content={safePerformer} />
          </span>
        ) : null}
        {safeAddress ? (
          <span
            itemProp="location"
            itemScope
            itemType="https://schema.org/Place"
          >
            <meta itemProp="name" content={safeAddress} />
            <meta itemProp="address" content={safeAddress} />
          </span>
        ) : null}
        {safeLinkUrl ? (
          <span itemProp="offers" itemScope itemType="https://schema.org/Offer">
            <meta itemProp="url" content={safeLinkUrl} />
            <meta
              itemProp="availability"
              content="https://schema.org/InStock"
            />
          </span>
        ) : null}
      </div>

      <div className="flex flex-col gap-4">
        {header}
        <p
          itemProp="description"
          className="max-w-prose whitespace-pre-wrap text-pretty text-[17px] leading-[1.4] text-slate-700"
        >
          {description}
        </p>
        {safeLinkUrl ? (
          <a
            href={safeLinkUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 text-base leading-normal text-[var(--fg-primary)]"
          >
            <span className="underline decoration-[var(--fg-primary)] decoration-1 underline-offset-4">
              {safeLinkText}
            </span>
            <LuArrowRight aria-hidden className="size-[18px] shrink-0" />
          </a>
        ) : null}
      </div>
    </article>
  );
};
