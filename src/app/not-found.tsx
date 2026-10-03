import type { Metadata } from "next";
import NextLink from "next/link";
import type { FC } from "react";
import { Button } from "@/components/button";

export const metadata: Metadata = {
  title: "Page not found",
  robots: {
    index: false,
  },
};

const NotFound: FC = () => {
  return (
    <main className="flex min-h-svh flex-col items-center justify-center px-6 py-24 text-center">
      <span className="mb-6 inline-flex items-center rounded-none border border-[var(--color-border)] bg-[var(--bg-accent-pink)] px-4 py-2 font-[family-name:var(--font-mono)] text-sm font-medium text-[var(--fg-on-accent)]">
        404
      </span>

      <h1 className="font-[family-name:var(--font-geist-sans)] text-4xl font-medium tracking-[-0.04em] text-[var(--fg-primary)] sm:text-5xl">
        Page not found
      </h1>

      <p className="mt-4 max-w-md text-lg text-[var(--fg-secondary)]">
        Sorry, the page you&apos;re looking for doesn&apos;t exist or has been
        moved.
      </p>

      <div className="mt-8">
        <Button asChild>
          <NextLink href="/">Back to home</NextLink>
        </Button>
      </div>
    </main>
  );
};

export default NotFound;
