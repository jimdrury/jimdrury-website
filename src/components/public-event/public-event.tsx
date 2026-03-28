import { format, isValid, parseISO } from "date-fns";
import type { FC } from "react";
import type { ComponentPropsWithoutChildren } from "@/lib/component-props";
import { cn } from "@/lib/utils";

export interface PublicEventProps
  extends ComponentPropsWithoutChildren<"section"> {
  eventDate: string;
  meta?: string;
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
    <section
      className={cn(
        "w-full rounded-md border-[3px] border-black bg-white p-5 shadow-[8px_8px_0_0_#000]",
        className,
      )}
      itemScope
      itemType="https://schema.org/Event"
      {...props}
    >
      <meta itemProp="name" content={title} />
      <meta itemProp="description" content={description} />
      <meta itemProp="startDate" content={eventDate} />
      {safeLinkUrl ? <meta itemProp="url" content={safeLinkUrl} /> : null}

      <p className="text-sm font-bold text-slate-600">{metaLine}</p>
      <h2
        itemProp="name"
        className="mt-1 text-[26px] font-extrabold text-slate-900"
      >
        {title}
      </h2>
      <p
        itemProp="description"
        className="mt-2 whitespace-pre-wrap text-[17px] leading-[1.4] text-slate-700"
      >
        {description}
      </p>
      {safeLinkUrl ? (
        <p className="mt-2 text-[15px] font-bold">
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
    </section>
  );
};
