import type { FC } from "react";
import { Link } from "@/components/link";
import type { ComponentPropsWithoutChildren } from "@/lib/component-props";
import { cn } from "@/lib/utils";

export interface MediaVideoLinkProps
  extends ComponentPropsWithoutChildren<"article"> {
  title: string;
  youtubeUrl: string;
  meta?: string;
  description?: string;
  ctaText?: string;
  channel?: string;
}

const getYouTubeVideoId = (value: string): string | null => {
  try {
    const url = new URL(value);
    const host = url.hostname.replace(/^www\./, "");

    if (host === "youtu.be") {
      const id = url.pathname.replace("/", "").trim();
      return id || null;
    }

    if (host === "youtube.com" || host === "m.youtube.com") {
      if (url.pathname === "/watch") {
        const id = url.searchParams.get("v")?.trim();
        return id || null;
      }

      if (
        url.pathname.startsWith("/shorts/") ||
        url.pathname.startsWith("/embed/")
      ) {
        const id = url.pathname.split("/")[2]?.trim();
        return id || null;
      }
    }

    return null;
  } catch {
    return null;
  }
};

export const MediaVideoLink: FC<MediaVideoLinkProps> = ({
  title,
  youtubeUrl,
  meta,
  description,
  ctaText,
  channel,
  className,
  ...props
}) => {
  const videoId = getYouTubeVideoId(youtubeUrl);
  const thumbnailUrl = videoId
    ? `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`
    : null;
  const metaLabel = meta?.trim() || channel?.trim() || "YouTube";
  const actionLabel = ctaText?.trim() || "Watch on YouTube ▶";

  return (
    <article
      className={cn(
        "rounded-md border-[3px] border-black bg-white p-5 shadow-[8px_8px_0_0_#000]",
        className,
      )}
      {...props}
    >
      <Link
        href={youtubeUrl}
        target="_blank"
        rel="noreferrer"
        className="relative block overflow-hidden rounded-md border-2 border-black bg-slate-900"
      >
        {thumbnailUrl ? (
          <>
            {/* biome-ignore lint/performance/noImgElement: external thumbnail URL without known intrinsic metadata */}
            <img
              src={thumbnailUrl}
              alt={`${title} thumbnail`}
              className="h-[120px] w-full object-cover md:h-[170px]"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-slate-900/55" />
          </>
        ) : (
          <div className="h-[120px] w-full md:h-[170px]" />
        )}
        <p className="absolute inset-0 flex items-center justify-center text-xl font-extrabold text-white">
          ▶ Watch Preview
        </p>
      </Link>
      <p className="mt-2 text-sm font-bold text-slate-600">{metaLabel}</p>
      <h3 className="mt-0.5 text-[22px] leading-[1.2] font-extrabold text-slate-900">
        <Link
          href={youtubeUrl}
          target="_blank"
          rel="noreferrer"
          className="no-underline"
        >
          {title}
        </Link>
      </h3>
      {description ? (
        <p className="mt-1 text-[15px] leading-[1.45] text-slate-700">
          {description}
        </p>
      ) : null}
      <p className="mt-1 text-[14px] font-bold text-red-600">
        <Link
          href={youtubeUrl}
          target="_blank"
          rel="noreferrer"
          className="no-underline"
        >
          {actionLabel}
        </Link>
      </p>
    </article>
  );
};
