import "server-only";

import type { FC } from "react";

export const Skeleton: FC = () => {
  return (
    <main
      className="mx-auto w-full max-w-3xl animate-pulse px-4 py-14 md:py-16"
      aria-busy="true"
    >
      <div className="h-10 w-3/4 rounded bg-zinc-200" />
      <div className="mt-2 h-4 w-32 rounded bg-zinc-100" />

      <div className="mt-10 space-y-3" aria-hidden="true">
        <div className="h-4 w-full rounded bg-zinc-100" />
        <div className="h-4 w-11/12 rounded bg-zinc-100" />
        <div className="h-4 w-10/12 rounded bg-zinc-100" />
        <div className="h-4 w-full rounded bg-zinc-100" />
        <div className="h-4 w-9/12 rounded bg-zinc-100" />
      </div>

      <div className="mt-12 space-y-3" aria-hidden="true">
        <div className="h-4 w-full rounded bg-zinc-100" />
        <div className="h-4 w-full rounded bg-zinc-100" />
        <div className="h-4 w-8/12 rounded bg-zinc-100" />
      </div>
    </main>
  );
};
