import { format, isValid, parseISO } from "date-fns";
import type { FC } from "react";
import { AccordionItem } from "@/components/accordion";
import type { ComponentPropsWithoutChildren } from "@/lib/component-props";
import { cn } from "@/lib/utils";

export interface PublicEventProps
  extends ComponentPropsWithoutChildren<"details"> {
  eventDate: string;
  meta?: string;
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
  meta,
  defaultExpanded = false,
  title,
  description,
  linkText,
  linkUrl,
  className,
  ...props
}) => {
  const safeMeta = meta?.trim();
  const safeLinkUrl = linkUrl?.trim();
  const safeLinkText = linkText?.trim() || "View event details ->";
  const formattedDate = formatEventDate(eventDate);
  const metaLine = safeMeta ? `${formattedDate} - ${safeMeta}` : formattedDate;

  return (
    <AccordionItem
      title={title}
      open={defaultExpanded}
      header={
        <span className="min-w-0">
          <span className="block text-sm font-bold text-slate-600">
            {metaLine}
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
      {safeLinkUrl ? <meta itemProp="url" content={safeLinkUrl} /> : null}

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
