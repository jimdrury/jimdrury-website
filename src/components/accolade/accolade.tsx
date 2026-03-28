import type { FC } from "react";
import { Link } from "@/components/link";
import type { ComponentPropsWithoutChildren } from "@/lib/component-props";
import { cn } from "@/lib/utils";

export interface AccoladeProps extends ComponentPropsWithoutChildren<"figure"> {
  title: string;
  year: string;
  href?: string;
}

export const Accolade: FC<AccoladeProps> = ({
  title,
  year,
  href,
  className,
  ...props
}) => {
  return (
    <figure
      className={cn(
        "rounded-md border-[3px] border-black bg-slate-50 px-[18px] py-4 shadow-[8px_8px_0_0_#000]",
        className,
      )}
      {...props}
    >
      <div className="flex items-center justify-between gap-4">
        <figcaption className="text-[22px] leading-tight font-extrabold text-slate-900">
          {href ? (
            <Link
              href={href}
              target="_blank"
              rel="noreferrer"
              className="no-underline"
            >
              {title}
            </Link>
          ) : (
            title
          )}
        </figcaption>
        <p className="shrink-0 text-base font-bold text-blue-600">{year}</p>
      </div>
    </figure>
  );
};
