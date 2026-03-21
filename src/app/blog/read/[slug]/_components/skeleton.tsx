import "server-only";

import type { FC } from "react";

export const Skeleton: FC = () => {
  const bodyLineKeys = [
    "line-1",
    "line-2",
    "line-3",
    "line-4",
    "line-5",
    "line-6",
    "line-7",
    "line-8",
  ] as const;
  const sidebarLinkKeys = ["link-1", "link-2", "link-3"] as const;

  return (
    <main className="animate-pulse" aria-busy="true" aria-hidden="true">
      <header>
        <div className="aspect-[16/9] w-full bg-zinc-200 md:aspect-[20/7] lg:aspect-[24/7]" />
        <div className="relative z-10 mx-auto -mt-12 w-full max-w-6xl px-4">
          <div className="border-4 border-black bg-yellow-300 px-6 py-6 shadow-[8px_8px_0_0] shadow-black">
            <div className="h-8 w-4/5 rounded bg-yellow-200 md:h-10" />
            <div className="mt-4 flex flex-col gap-3">
              <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
                <div className="h-4 w-48 rounded bg-yellow-200" />
                <div className="h-4 w-20 rounded bg-yellow-200" />
              </div>
              <div className="flex items-center gap-2">
                <div className="h-7 w-16 rounded bg-yellow-200" />
                <div className="h-7 w-20 rounded bg-yellow-200" />
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="mx-auto mt-8 max-w-6xl gap-y-6 px-4 flex flex-col md:grid md:gap-x-10 md:[grid-template-columns:minmax(0,3fr)_minmax(0,1fr)] lg:gap-x-12 lg:[grid-template-columns:minmax(0,5fr)_minmax(0,2fr)]">
        <section className="order-2 space-y-4 pb-4 md:order-none md:col-start-1 md:row-start-1">
          <div className="h-8 w-2/3 rounded bg-zinc-200" />
          {bodyLineKeys.map((key, index) => (
            <div
              key={`article-skeleton-body-${key}`}
              className={`h-4 rounded bg-zinc-100 ${
                index % 3 === 2 ? "w-10/12" : "w-full"
              }`}
            />
          ))}
        </section>

        <aside className="contents md:col-start-2 md:row-start-1 md:block md:space-y-4">
          <div className="order-1 space-y-4 md:order-none">
            <div className="rounded border-2 border-black bg-zinc-100 p-4 shadow-[4px_4px_0_0]">
              <div className="h-5 w-2/3 rounded bg-zinc-200" />
              <div className="mt-3 space-y-2">
                {sidebarLinkKeys.map((key) => (
                  <div
                    key={`article-skeleton-sidebar-${key}`}
                    className="h-4 w-full rounded bg-zinc-200"
                  />
                ))}
              </div>
            </div>
          </div>
        </aside>
      </div>
    </main>
  );
};
