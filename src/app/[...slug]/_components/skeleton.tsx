import "server-only";

import type { FC } from "react";

import { HERO_CONTENT_INNER_CLASS } from "@/components/hero";
import { cn } from "@/lib/utils";

const SKEL = "rounded bg-[#C8BBAA]";
const SKEL_LIGHT = "rounded bg-[#DDD5C4]";
const PILL = "rounded-full bg-[#C8BBAA]";
const IMG = "bg-[#D5CCBA]";
const TICKER_ITEM = "rounded bg-[#333]";

export const Skeleton: FC = () => {
  return (
    <div className="animate-pulse bg-[var(--bg-primary)]" aria-busy="true">
      {/* Hero — mirrors flex-col-reverse lg:flex-row from Hero component */}
      <div
        className={cn(
          "flex flex-col-reverse gap-6 py-10 lg:flex-row lg:items-start lg:gap-[60px] lg:py-20",
          HERO_CONTENT_INNER_CLASS,
        )}
      >
        {/* Text column */}
        <div className="flex flex-1 flex-col gap-5 lg:gap-6">
          <div className={`${PILL} h-[26px] w-24`} />
          <div className="flex flex-col gap-3">
            <div className={`${SKEL} h-16 w-full lg:h-20`} />
            <div className={`${SKEL} h-16 w-4/5 lg:h-20 lg:w-3/5`} />
          </div>
          <div className="flex flex-col gap-2.5">
            <div className={`${SKEL} h-4 w-full`} />
            <div className={`${SKEL} h-4 w-full`} />
            <div className={`${SKEL} h-4 w-3/4 lg:w-1/2`} />
          </div>
        </div>

        {/* Portrait column */}
        <div className="w-full shrink-0 lg:w-[480px]">
          <div
            className={cn(
              IMG,
              "h-[300px] w-full rounded-xl border-[3px] border-[var(--fg-primary)] shadow-[6px_6px_0_0_var(--fg-primary)] lg:h-[352px] lg:shadow-[8px_8px_0_0_var(--fg-primary)]",
            )}
          />
        </div>
      </div>

      {/* Ticker — dark band with word + star placeholders */}
      <div className="overflow-hidden bg-[var(--fg-primary)] px-5 py-3 lg:px-12 lg:py-4">
        <div className="flex items-center gap-4 lg:gap-12">
          <div className={`${TICKER_ITEM} h-4 w-20 lg:h-5 lg:w-24`} />
          <div className={`${TICKER_ITEM} h-2.5 w-2.5 rounded-full`} />
          <div className={`${TICKER_ITEM} h-4 w-14 lg:h-5 lg:w-16`} />
          <div className={`${TICKER_ITEM} h-2.5 w-2.5 rounded-full`} />
          <div className={`${TICKER_ITEM} h-4 w-24 lg:h-5 lg:w-28`} />
          <div className={`${TICKER_ITEM} h-2.5 w-2.5 rounded-full`} />
          <div className={`${TICKER_ITEM} hidden h-5 w-20 lg:block`} />
          <div
            className={`${TICKER_ITEM} hidden h-2.5 w-2.5 rounded-full lg:block`}
          />
        </div>
      </div>

      {/* Content Band 1 — grid layout (e.g. award cards) */}
      <div className="w-full py-[48px] lg:py-[80px]">
        <div
          className={cn("space-y-8 lg:space-y-12", HERO_CONTENT_INNER_CLASS)}
        >
          <div className="flex flex-col gap-3">
            <div className={`${SKEL} h-9 w-52 lg:h-11 lg:w-72`} />
            <div className={`${SKEL_LIGHT} h-4 w-64 lg:w-80`} />
          </div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {(["a", "b", "c"] as const).map((key) => (
              <div
                key={key}
                className={cn(
                  `${IMG} h-44 rounded-xl lg:h-52`,
                  key === "c" && "hidden lg:block",
                )}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Content Band 2 — stack layout with secondary bg (e.g. video list) */}
      <div className="w-full bg-[var(--bg-secondary)] py-[48px] lg:py-[80px]">
        <div
          className={cn("space-y-8 lg:space-y-12", HERO_CONTENT_INNER_CLASS)}
        >
          <div className="flex items-end justify-between">
            <div className={`${SKEL} h-9 w-52 lg:h-11 lg:w-72`} />
            <div className={`${SKEL} h-8 w-16 rounded lg:w-20`} />
          </div>
          <div className="flex flex-col gap-4">
            {(["a", "b"] as const).map((key) => (
              <div key={key} className="flex items-start gap-4">
                <div
                  className={`${IMG} h-24 w-36 shrink-0 rounded-lg lg:h-28 lg:w-44`}
                />
                <div className="flex flex-1 flex-col gap-2.5">
                  <div className={`${SKEL} h-4 w-full lg:h-[18px]`} />
                  <div className={`${SKEL} h-4 w-3/4 lg:h-[18px]`} />
                  <div className={`${SKEL_LIGHT} h-3 w-full`} />
                  <div className={`${SKEL_LIGHT} h-3 w-2/3`} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Content Band 3 — stack layout (e.g. career history / events) */}
      <div className="w-full py-[48px] lg:py-[80px]">
        <div
          className={cn("space-y-8 lg:space-y-12", HERO_CONTENT_INNER_CLASS)}
        >
          <div className={`${SKEL} h-9 w-52 lg:h-11 lg:w-72`} />
          <div className="flex flex-col gap-6">
            {(["a", "b", "c"] as const).map((key) => (
              <div
                key={key}
                className="flex flex-col gap-2.5 lg:flex-row lg:gap-12"
              >
                <div className={`${SKEL_LIGHT} h-4 w-32 shrink-0 lg:w-40`} />
                <div className="flex flex-1 flex-col gap-2">
                  <div className={`${SKEL} h-5 w-full lg:w-3/5`} />
                  <div className={`${SKEL_LIGHT} h-3.5 w-1/2 lg:w-1/4`} />
                  <div className={`${SKEL_LIGHT} h-3 w-full`} />
                  <div className={`${SKEL_LIGHT} h-3 w-5/6`} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
