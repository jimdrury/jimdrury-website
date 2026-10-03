import type { FC } from "react";
import { RuleBox } from "@/components/rule-box";
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
      <RuleBox className="overflow-visible">
        <div className="overflow-hidden">
          <iframe
            src={`https://www.youtube-nocookie.com/embed/${videoId}`}
            title={title}
            className="aspect-video w-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            loading="lazy"
          />
        </div>
      </RuleBox>
      <figcaption className="font-[family-name:var(--font-geist-sans)] text-[22px] font-medium leading-tight tracking-[-0.03em] text-[var(--fg-primary)]">
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
