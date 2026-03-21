import "server-only";

import type { FC } from "react";

type SkeletonProps = {
  showCategorySidebar?: boolean;
};

export const Skeleton: FC<SkeletonProps> = ({ showCategorySidebar = true }) => {
  const cardKeys = [
    "card-1",
    "card-2",
    "card-3",
    "card-4",
    "card-5",
    "card-6",
    "card-7",
    "card-8",
    "card-9",
    "card-10",
    "card-11",
    "card-12",
  ] as const;

  const storyGridClassName = showCategorySidebar
    ? "grid gap-6 md:grid-cols-2"
    : "grid gap-6 md:grid-cols-2 lg:grid-cols-3";

  return (
    <>
      <section className="w-full bg-black" aria-hidden="true">
        <div className="aspect-[32/9] md:aspect-[40/7] lg:aspect-[48/7]" />
      </section>
      <div className="relative z-10 mx-auto -mt-12 w-full max-w-6xl px-4">
        <div className="rounded-md border-4 border-black bg-yellow-300 p-6 shadow-[8px_8px_0_0] shadow-black">
          <div className="h-9 w-40 rounded bg-yellow-200" />
          <div className="mt-3 h-4 w-80 rounded bg-yellow-200" />
        </div>
      </div>

      <main
        className="mx-auto w-full max-w-6xl animate-pulse px-4 pb-12 pt-8 md:pb-14 md:pt-10"
        aria-busy="true"
      >
        <section
          className={
            showCategorySidebar
              ? "grid gap-8 lg:grid-cols-[minmax(0,3fr)_minmax(0,1fr)]"
              : "grid gap-8"
          }
        >
          <div className={storyGridClassName} aria-hidden="true">
            {cardKeys.map((cardKey) => (
              <article
                key={`blog-index-skeleton-${cardKey}`}
                className="overflow-hidden rounded-md border-2 border-black bg-white shadow-[4px_4px_0_0]"
              >
                <div className="h-55 border-b-2 border-black bg-zinc-200" />
                <div className="space-y-3 p-4">
                  <div className="h-3 w-24 rounded bg-zinc-200" />
                  <div className="h-6 w-full rounded bg-zinc-100" />
                  <div className="h-3 w-full rounded bg-zinc-100" />
                  <div className="h-3 w-11/12 rounded bg-zinc-100" />
                  <div className="h-3 w-2/3 rounded bg-zinc-100" />
                  <div className="flex justify-end p-2">
                    <div className="h-13 w-32 rounded-md border-2 border-black bg-zinc-200 shadow-[4px_4px_0_0]" />
                  </div>
                </div>
              </article>
            ))}
          </div>

          {showCategorySidebar ? (
            <aside className="space-y-3" aria-hidden="true">
              <div className="rounded-md border-2 border-black bg-zinc-100 p-4 shadow-[4px_4px_0_0]">
                <div className="mb-3 h-8 w-28 rounded bg-zinc-200" />
                <div className="space-y-2">
                  <div className="h-10 w-full rounded-md border-2 border-black bg-white" />
                  <div className="h-10 w-full rounded-md border-2 border-black bg-white" />
                  <div className="h-10 w-full rounded-md border-2 border-black bg-white" />
                </div>
              </div>
            </aside>
          ) : null}
        </section>

        <div className="mt-8 flex items-center gap-3" aria-hidden="true">
          <div className="h-9 w-24 rounded-md border-2 border-black bg-zinc-200 shadow-[4px_4px_0_0]" />
          <div className="h-9 w-10 rounded-md border-2 border-black bg-zinc-200 shadow-[4px_4px_0_0]" />
          <div className="h-9 w-10 rounded-md border-2 border-black bg-zinc-200 shadow-[4px_4px_0_0]" />
          <div className="h-9 w-10 rounded-md border-2 border-black bg-zinc-200 shadow-[4px_4px_0_0]" />
          <div className="h-9 w-20 rounded-md border-2 border-black bg-zinc-200 shadow-[4px_4px_0_0]" />
        </div>
      </main>
    </>
  );
};
