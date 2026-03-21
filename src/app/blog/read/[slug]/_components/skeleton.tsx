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
  const preContentKeys = ["pre-1", "pre-2"] as const;
  const postContentKeys = ["post-1", "post-2"] as const;

  return (
    <main className="animate-pulse py-8 md:py-12" aria-busy="true">
      <section className="mx-auto max-w-5xl px-4" aria-hidden="true">
        <div className="h-64 w-full rounded bg-zinc-200 md:h-96" />
        <div className="mt-6 h-10 w-4/5 rounded bg-zinc-200" />
        <div className="mt-3 h-4 w-64 rounded bg-zinc-100" />
      </section>

      <div
        className="mx-auto mt-8 max-w-6xl gap-y-6 px-4 md:grid md:gap-x-10 md:[grid-template-columns:minmax(0,3fr)_minmax(0,1fr)] lg:gap-x-12 lg:[grid-template-columns:minmax(0,5fr)_minmax(0,2fr)]"
        aria-hidden="true"
      >
        <aside className="order-1 space-y-4 md:order-none md:col-start-2 md:row-start-1">
          {preContentKeys.map((key) => (
            <div
              key={`article-skeleton-${key}`}
              className="rounded border-2 border-black bg-zinc-100 p-4 shadow-[4px_4px_0_0]"
            >
              <div className="h-4 w-2/3 rounded bg-zinc-200" />
              <div className="mt-3 h-4 w-full rounded bg-zinc-200" />
              <div className="mt-2 h-4 w-5/6 rounded bg-zinc-200" />
            </div>
          ))}
        </aside>

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

        <aside className="order-3 space-y-4 md:col-start-2">
          {postContentKeys.map((key) => (
            <div
              key={`article-skeleton-${key}`}
              className="rounded border-2 border-black bg-zinc-100 p-4 shadow-[4px_4px_0_0]"
            >
              <div className="h-24 w-full rounded bg-zinc-200" />
              <div className="mt-3 h-4 w-3/4 rounded bg-zinc-200" />
            </div>
          ))}
        </aside>
      </div>
    </main>
  );
};
