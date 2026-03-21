import "server-only";

import type { FC } from "react";

export const Skeleton: FC = () => {
  const cardKeys = ["card-1", "card-2", "card-3"] as const;

  return (
    <main
      className="mx-auto w-full max-w-5xl animate-pulse px-4 py-10"
      aria-busy="true"
    >
      <div className="h-10 w-72 rounded bg-zinc-200" />
      <div className="mt-6 h-64 w-full rounded border-2 border-black bg-zinc-100" />
      <section className="mt-6 grid gap-4 md:grid-cols-3" aria-hidden="true">
        {cardKeys.map((cardKey) => (
          <div
            key={`home-skeleton-${cardKey}`}
            className="h-40 rounded border-2 border-black bg-zinc-100"
          />
        ))}
      </section>
    </main>
  );
};
