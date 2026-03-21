import type { FC } from "react";
import type { ComponentPropsWithoutChildren } from "@/lib/component-props";
import { cn } from "@/lib/utils";

export interface MediaProps extends ComponentPropsWithoutChildren<"figure"> {
  src: string;
  alt: string;
  caption?: string;
}

export const Media: FC<MediaProps> = ({
  className,
  src,
  alt,
  caption,
  ...props
}) => {
  return (
    <figure
      className={cn(
        "overflow-hidden border-2 border-black shadow-[4px_4px_0_0]",
        className,
      )}
      {...props}
    >
      {/* biome-ignore lint/performance/noImgElement: generic component library, not tied to Next.js Image */}
      <img src={src} alt={alt} className="w-full object-cover" />
      {caption && (
        <figcaption className="border-t-2 border-black bg-white px-4 py-2 text-sm font-semibold">
          {caption}
        </figcaption>
      )}
    </figure>
  );
};
