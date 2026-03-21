import { Slot } from "@radix-ui/react-slot";
import type { FC, ReactNode } from "react";
import type { ComponentPropsWithoutChildren } from "@/lib/component-props";
import { cn } from "@/lib/utils";

export interface BlogCardProps extends ComponentPropsWithoutChildren<"a"> {
  children?: ReactNode;
  asChild?: boolean;
  title: string;
  excerpt?: string;
  date?: string;
  dateTime?: string;
}

export const BlogCard: FC<BlogCardProps> = ({
  asChild,
  className,
  title,
  excerpt,
  date,
  dateTime,
  href,
  children,
  ...props
}) => {
  const Comp = asChild ? Slot : href ? "a" : "article";
  return (
    <Comp
      href={asChild || !href ? undefined : href}
      className={cn(
        "block cursor-pointer border-2 border-black bg-white p-4 text-black shadow-[4px_4px_0_0] hover:bg-yellow-100 focus-visible:focus-ring sm:p-6",
        className,
      )}
      {...props}
    >
      {asChild ? (
        children
      ) : children ? (
        children
      ) : (
        <>
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
        </>
      )}
    </Comp>
  );
};
