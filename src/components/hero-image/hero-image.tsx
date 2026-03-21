import NextImage from "next/image";
import type { FC, ReactNode } from "react";
import type { ComponentPropsWithoutChildren } from "@/lib/component-props";
import { cn } from "@/lib/utils";

export interface HeroImageProps extends ComponentPropsWithoutChildren<"div"> {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  children?: ReactNode;
}

export const HeroImage: FC<HeroImageProps> = ({
  src,
  alt,
  width,
  height,
  children,
  className,
  ...props
}) => {
  return (
    <div
      className={cn("relative aspect-[16/9] w-full overflow-hidden", className)}
      {...props}
    >
      {width && height ? (
        <NextImage
          src={src}
          alt={alt}
          width={width}
          height={height}
          sizes="100vw"
          priority
          className="block h-full w-full object-cover"
        />
      ) : (
        // biome-ignore lint/performance/noImgElement: fallback when intrinsic size is unknown
        <img src={src} alt={alt} className="block h-full w-full object-cover" />
      )}
      {children && (
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent px-6 pb-6 pt-16">
          {children}
        </div>
      )}
    </div>
  );
};
