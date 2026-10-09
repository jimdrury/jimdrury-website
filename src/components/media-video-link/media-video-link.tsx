import type { FC } from "react";
import type { ComponentPropsWithoutChildren } from "@/lib/component-props";
import { cn } from "@/lib/utils";

export interface MediaVideoLinkProps
  extends ComponentPropsWithoutChildren<"figure"> {
  title: string;
  youtubeUrl: string;
  description?: string;
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
  description,
  className,
  ...props
}) => {
  const videoId = getYouTubeVideoId(youtubeUrl);

  if (!videoId) {
    return null;
  }

  return (
    <figure className={cn("flex flex-col gap-4", className)} {...props}>
      <div className="overflow-hidden rounded-xl border-[3px] border-[var(--fg-primary)] shadow-[6px_6px_0_0_var(--fg-primary)]">
        <iframe
          src={`https://www.youtube-nocookie.com/embed/${videoId}`}
          title={title}
          className="aspect-video w-full"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          loading="lazy"
        />
      </div>
      <figcaption className="font-[family-name:var(--font-anton)] text-[22px] font-normal uppercase leading-tight tracking-[0.5px] text-[var(--fg-primary)]">
        {title}
      </figcaption>
      {description && (
        <p className="font-[family-name:var(--font-inter)] text-sm leading-[1.5] text-[var(--fg-secondary)]">
          {description}
        </p>
      )}
    </figure>
  );
};
