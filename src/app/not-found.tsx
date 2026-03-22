import type { Metadata } from "next";
import NextLink from "next/link";
import { Button } from "@/components/button";

export const metadata: Metadata = {
  title: "Page not found",
};

export default function NotFound() {
  return (
    <main className="flex min-h-svh flex-col items-center justify-center px-6 py-24 text-center">
      <span className="mb-6 inline-flex items-center rounded-md border-2 border-black bg-yellow-300 px-4 py-2 text-sm font-bold shadow-[4px_4px_0_0_#000]">
        404
      </span>

      <h1 className="text-4xl font-black tracking-tight text-black sm:text-5xl">
        Page not found
      </h1>

      <p className="mt-4 max-w-md text-lg text-zinc-700">
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
}
