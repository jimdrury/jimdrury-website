import "server-only";

import type { FC } from "react";

export const Skeleton: FC = () => {
  return (
    <main aria-busy="true">
      <section className="w-full bg-black" aria-hidden="true">
        <div className="aspect-[32/9] md:aspect-[40/7] lg:aspect-[48/7]" />
      </section>

      <div className="relative z-10 mx-auto -mt-12 w-full max-w-6xl px-4">
        <div className="animate-pulse rounded-md border-4 border-black bg-yellow-300 p-6 shadow-[8px_8px_0_0] shadow-black">
          <div className="h-9 w-64 rounded bg-yellow-200" />
          <div className="mt-2 h-4 w-48 rounded bg-yellow-200" />
        </div>
      </div>

      <div className="mx-auto mt-8 grid w-full max-w-6xl animate-pulse gap-y-6 px-4 pb-12 md:grid-cols-[minmax(0,3fr)_minmax(0,1fr)] md:gap-x-10 md:gap-y-0 md:pb-14 lg:gap-x-12 lg:[grid-template-columns:minmax(0,5fr)_minmax(0,2fr)]">
        <section className="space-y-4 pb-0 md:col-start-1 md:row-start-1 md:pb-4">
          <div className="h-6 w-3/4 rounded bg-zinc-200" />
          <div className="h-6 w-full rounded bg-zinc-200" />
          <div className="h-6 w-5/6 rounded bg-zinc-200" />
          <div className="h-40 w-full rounded border-2 border-black bg-zinc-100" />
          <div className="h-6 w-2/3 rounded bg-zinc-200" />
          <div className="h-6 w-11/12 rounded bg-zinc-200" />
        </section>
        <aside
          aria-hidden="true"
          className="hidden md:col-start-2 md:row-start-1 md:block md:self-start"
        />
      </div>
    </main>
  );
};
