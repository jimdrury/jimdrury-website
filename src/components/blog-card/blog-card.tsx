import Image from "next/image";
import Link from "next/link";
import type { FC, ReactNode } from "react";
import { Button } from "@/components/button";
import type { ComponentPropsWithoutChildren } from "@/lib/component-props";
import { cn } from "@/lib/utils";

export interface BlogCardProps
  extends ComponentPropsWithoutChildren<"article"> {
  children?: ReactNode;
  href?: string;
  title: string;
  category?: string;
  excerpt?: string;
  date?: string;
  dateTime?: string;
  imageSrc?: string;
  imageAlt?: string;
  imageWidth?: number;
  imageHeight?: number;
  imageLoading?: "eager" | "lazy";
  imageFetchPriority?: "high" | "low" | "auto";
}

export const BlogCard: FC<BlogCardProps> = ({
  className,
  href,
  title,
  category,
  excerpt,
  date,
  dateTime,
  imageSrc,
  imageAlt,
  imageWidth,
  imageHeight,
  imageLoading = "lazy",
  imageFetchPriority = "auto",
  children,
  ...props
}) => {
  return (
    <article
      className={cn(
        "relative flex h-full flex-col overflow-hidden rounded-md border-2 border-black bg-white p-4 text-black shadow-[4px_4px_0_0] sm:p-6",
        className,
      )}
      {...props}
    >
      {children ? (
        children
      ) : (
        <>
          {imageSrc && (
            <div className="relative -mx-4 -mt-4 mb-3 aspect-[16/9] overflow-hidden border-b-2 border-black bg-zinc-100 sm:-mx-6 sm:-mt-6">
              <Image
                src={imageSrc}
                alt={imageAlt ?? title}
                width={imageWidth ?? 1600}
                height={imageHeight ?? 1000}
                loading={imageLoading}
                fetchPriority={imageFetchPriority}
                sizes="(min-width: 768px) 33vw, 100vw"
                className="h-full w-full object-cover"
              />
              {category && (
                <span className="absolute right-2 top-2 max-w-[70%] truncate rounded-md border-2 border-black bg-white px-2 py-1 text-xs/none font-semibold uppercase shadow-[2px_2px_0_0] sm:right-3 sm:top-3">
                  {category}
                </span>
              )}
            </div>
          )}
          <div className="flex grow flex-col">
            {date && (
              <span className="inline-flex items-center gap-1.5">
                <time
                  dateTime={dateTime}
                  className="text-xs/none font-semibold uppercase"
                >
                  {date}
                </time>
              </span>
            )}
            <h3 className="mt-1 text-xl font-semibold">{title}</h3>
            {excerpt && (
              <p className="mt-2 line-clamp-2 text-pretty">{excerpt}</p>
            )}
            {href && (
              <div className="mt-auto flex justify-end pt-4">
                <Button asChild expand>
                  <Link href={href} aria-label={`Read more about ${title}`}>
                    Read more
                  </Link>
                </Button>
              </div>
            )}
          </div>
        </>
      )}
    </article>
  );
};
