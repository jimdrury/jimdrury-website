import { format, isValid, parseISO } from "date-fns";
import type { FC } from "react";
import { AccordionItem } from "@/components/accordion";
import type { ComponentPropsWithoutChildren } from "@/lib/component-props";
import { cn } from "@/lib/utils";

export interface PublicEventProps
  extends ComponentPropsWithoutChildren<"details"> {
  eventDate: string;
  endDate?: string;
  organizer?: string;
  address?: string;
  performer?: string;
  eventStatus?: string;
  imageUrl?: string;
  defaultExpanded?: boolean;
  title: string;
  description: string;
  linkText?: string;
  linkUrl?: string;
}

const formatEventDate = (value: string): string => {
  const parsed = parseISO(value);
  if (!isValid(parsed)) {
    return value;
  }
  return format(parsed, "MMM yyyy");
};

export const PublicEvent: FC<PublicEventProps> = ({
  eventDate,
  endDate,
  organizer,
  address,
  performer,
  eventStatus,
  imageUrl,
  defaultExpanded = false,
  title,
  description,
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
  const safeImageUrl = imageUrl?.trim();
  const safeLinkUrl = linkUrl?.trim();
  const safeLinkText = linkText?.trim() || "View event details ->";
  const formattedDate = formatEventDate(eventDate);
  const detailsLine = [formattedDate, safeOrganizer, safeAddress]
    .filter((value) => Boolean(value))
    .join(" - ");
  const startTimestamp = Date.parse(eventDate);
  const endTimestamp = endDate ? Date.parse(endDate) : Number.NaN;
  const hasDistinctEndDate =
    Number.isFinite(startTimestamp) &&
    Number.isFinite(endTimestamp) &&
    startTimestamp !== endTimestamp;
  const safeEndDate = hasDistinctEndDate ? endDate?.trim() : undefined;

  return (
    <AccordionItem
      title={title}
      open={defaultExpanded}
      header={
        <span className="min-w-0">
          <span className="block text-sm font-bold text-slate-600">
            {detailsLine}
          </span>
          <span className="block text-lg font-extrabold leading-tight text-slate-900">
            {title}
          </span>
        </span>
      }
      className={cn("w-full", className)}
      itemScope
      itemType="https://schema.org/Event"
      {...props}
    >
      <meta itemProp="name" content={title} />
      <meta itemProp="description" content={description} />
      <meta itemProp="startDate" content={eventDate} />
      {safeEndDate ? <meta itemProp="endDate" content={safeEndDate} /> : null}
      <meta itemProp="eventStatus" content={safeEventStatus} />
      {safeLinkUrl ? <meta itemProp="url" content={safeLinkUrl} /> : null}
      {safeImageUrl ? <meta itemProp="image" content={safeImageUrl} /> : null}
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
        <span itemProp="location" itemScope itemType="https://schema.org/Place">
          <meta itemProp="name" content={safeAddress} />
          <meta itemProp="address" content={safeAddress} />
        </span>
      ) : null}
      {safeLinkUrl ? (
        <span itemProp="offers" itemScope itemType="https://schema.org/Offer">
          <meta itemProp="url" content={safeLinkUrl} />
          <meta itemProp="availability" content="https://schema.org/InStock" />
        </span>
      ) : null}

      <p
        itemProp="description"
        className="whitespace-pre-wrap text-pretty text-[17px] leading-[1.4] text-slate-700"
      >
        {description}
      </p>
      {safeLinkUrl ? (
        <p className="mt-3 text-[15px] font-bold">
          <a
            href={safeLinkUrl}
            target="_blank"
            rel="noreferrer"
            className="underline underline-offset-2"
            style={{ color: "#1d4ed8" }}
          >
            {safeLinkText}
          </a>
        </p>
      ) : null}
    </AccordionItem>
  );
};
