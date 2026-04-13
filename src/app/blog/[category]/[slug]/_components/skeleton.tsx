import "server-only";

import type { FC } from "react";

const relatedCardKeys = ["card-1", "card-2", "card-3"] as const;

export const Skeleton: FC = () => {
  return (
    <main className="animate-pulse" aria-busy="true" aria-hidden="true">
      {/* Hero image */}
      <div className="aspect-[3/2] w-full bg-stone-200 border-b-[3px] border-stone-300 md:aspect-[3/1]" />

      {/* Article header */}
      <div className="w-full px-5 py-8 flex flex-col gap-4 md:px-[200px] md:py-12 md:gap-5">
        <div className="h-[22px] w-20 rounded-full bg-stone-300 md:h-[26px] md:w-[90px]" />
        <div className="flex flex-col gap-3">
          <div className="h-10 w-[350px] rounded bg-stone-300 md:h-[52px] md:w-[800px]" />
          <div className="h-10 w-60 rounded bg-stone-300 md:h-[52px] md:w-[500px]" />
        </div>
        <div className="flex items-center gap-3 md:gap-4">
          <div className="h-9 w-9 shrink-0 rounded-full bg-stone-300 md:h-11 md:w-11" />
          <div className="flex flex-col gap-1.5">
            <div className="h-3 w-24 rounded bg-stone-300 md:h-3.5 md:w-[120px]" />
            <div className="h-2.5 w-32 rounded bg-stone-200 md:h-3 md:w-40" />
          </div>
        </div>
      </div>

      {/* Article body */}
      <div className="w-full px-5 pb-8 flex flex-col gap-5 md:px-[200px] md:pb-12 md:gap-6">
        <div className="h-2.5 w-full rounded bg-stone-300 md:h-3" />
        <div className="h-2.5 w-full rounded bg-stone-300 md:h-3" />
        <div className="h-2.5 w-[86%] rounded bg-stone-300 md:h-3" />
        <div className="h-2.5 w-full rounded bg-stone-300 md:h-3" />
        <div className="h-2.5 w-3/4 rounded bg-stone-300 md:h-3" />
        <div className="h-6 w-[200px] rounded bg-stone-300 md:h-7 md:w-80" />
        <div className="h-2.5 w-full rounded bg-stone-300 md:h-3" />
        <div className="h-2.5 w-full rounded bg-stone-300 md:h-3" />
        <div className="h-2.5 w-[89%] rounded bg-stone-300 md:h-3" />
        <div className="h-[200px] w-full rounded-lg border-[3px] border-stone-300 bg-stone-200 md:h-[320px]" />
        <div className="h-2.5 w-full rounded bg-stone-300 md:h-3" />
        <div className="h-2.5 w-full rounded bg-stone-300 md:h-3" />
        <div className="h-2.5 w-[83%] rounded bg-stone-300 md:h-3" />
      </div>

      {/* Related posts */}
      <div className="w-full border-t-[3px] border-stone-300 px-5 py-8 flex flex-col gap-6 md:px-20 md:py-12 md:gap-8">
        <div className="h-6 w-[180px] rounded bg-stone-300 md:h-7 md:w-[220px]" />
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3">
          {relatedCardKeys.map((key) => (
            <div
              key={`article-skeleton-related-${key}`}
              className="overflow-hidden rounded-lg border-[3px] border-stone-300 shadow-[6px_6px_0_0_#DDD5C4] last:hidden sm:last:block md:last:block"
            >
              <div className="h-40 w-full bg-stone-200 md:h-[180px]" />
              <div className="flex flex-col gap-2 p-4 md:p-5">
                <div className="h-[18px] w-12 rounded-full bg-stone-300" />
                <div className="h-[18px] w-full rounded bg-stone-300" />
                <div className="h-2.5 w-full rounded bg-stone-200" />
                <div className="h-8 w-[90px] rounded bg-stone-300" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
};
