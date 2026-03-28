import "server-only";

import type { FC } from "react";

export const Skeleton: FC = () => {
  return (
    <main
      className="mx-auto w-full max-w-5xl animate-pulse px-4 py-10"
      aria-busy="true"
    >
      <div className="h-10 w-72 rounded bg-zinc-200" />
      <div className="mt-6 h-64 w-full rounded border-2 border-black bg-zinc-100" />
      <section className="mt-6 space-y-4" aria-hidden="true">
        <div className="h-6 w-3/4 rounded bg-zinc-200" />
        <div className="h-6 w-full rounded bg-zinc-200" />
        <div className="h-6 w-5/6 rounded bg-zinc-200" />
      </section>
    </main>
  );
};
