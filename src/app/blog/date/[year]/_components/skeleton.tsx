import "server-only";

import type { FC } from "react";

export const Skeleton: FC = () => {
  const cardKeys = [
    "card-1",
    "card-2",
    "card-3",
    "card-4",
    "card-5",
    "card-6",
  ] as const;

  return (
    <main
      className="mx-auto w-full max-w-5xl animate-pulse px-4 py-10"
      aria-busy="true"
    >
      <div className="h-10 w-64 rounded bg-zinc-200" />

      <section className="mt-6 grid gap-4 md:grid-cols-3" aria-hidden="true">
        {cardKeys.map((cardKey) => (
          <article
            key={`year-skeleton-${cardKey}`}
            className="overflow-hidden rounded-md border-2 border-black bg-white p-4 shadow-[4px_4px_0_0] sm:p-6"
          >
            <div className="-mx-4 -mt-4 mb-3 border-b-2 border-black bg-zinc-100 sm:-mx-6 sm:-mt-6">
              <div className="h-48 w-full bg-zinc-200" />
            </div>
            <div className="h-3 w-24 rounded bg-zinc-200" />
            <div className="mt-3 h-6 w-3/4 rounded bg-zinc-200" />
            <div className="mt-3 h-4 w-full rounded bg-zinc-100" />
            <div className="mt-2 h-4 w-11/12 rounded bg-zinc-100" />
            <div className="mt-2 h-4 w-2/3 rounded bg-zinc-100" />
            <div className="mt-4 flex justify-end">
              <div className="h-11 w-28 rounded-md border-2 border-black bg-zinc-200 shadow-[4px_4px_0_0]" />
            </div>
          </article>
        ))}
      </section>

      <nav
        className="mt-8 flex items-center justify-between"
        aria-hidden="true"
      >
        <div className="h-10 w-24 rounded border-2 border-black bg-zinc-100" />
        <div className="h-4 w-24 rounded bg-zinc-200" />
        <div className="h-10 w-20 rounded border-2 border-black bg-zinc-100" />
      </nav>
    </main>
  );
};
