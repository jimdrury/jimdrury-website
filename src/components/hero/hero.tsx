import NextImage from "next/image";
import type { FC } from "react";
import type { ComponentPropsWithoutChildren } from "@/lib/component-props";
import { cn } from "@/lib/utils";

export interface HeroProps extends ComponentPropsWithoutChildren<"section"> {
  title: string;
  blurb: string;
  portraitSrc: string;
  portraitAlt: string;
}

export const Hero: FC<HeroProps> = ({
  title,
  blurb,
  portraitSrc,
  portraitAlt,
  className,
  ...props
}) => {
  return (
    <section className={cn("w-full bg-white", className)} {...props}>
      <div
        className="mx-auto flex w-full flex-col items-center gap-5 pt-7 md:gap-8 md:pt-16 lg:flex-row lg:gap-16 lg:pt-20 pb-6"
        style={{ maxWidth: "72rem" }}
      >
        <div className="w-full shrink-0 lg:w-[26.25rem]">
          <div className="rounded-md border-4 border-black shadow-[8px_8px_0_0_#000]">
            <NextImage
              src={portraitSrc}
              alt={portraitAlt}
              width={840}
              height={840}
              sizes="(min-width: 1024px) 420px, 100vw"
              className="h-[17.5rem] w-full object-cover md:h-[26.25rem]"
            />
          </div>
        </div>
        <div className="flex w-full flex-col gap-3 lg:flex-1 lg:gap-5">
          <h1 className="text-balance text-[2.375rem] font-black leading-[1.08] text-slate-900 md:text-[3.375rem] md:leading-[1.05]">
            {title}
          </h1>
          <p className="text-pretty text-base leading-[1.45] text-slate-700 md:text-xl md:leading-[1.4]">
            {blurb}
          </p>
        </div>
      </div>
    </section>
  );
};
