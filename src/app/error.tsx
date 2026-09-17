"use client";

import NextLink from "next/link";
import { type FC, useEffect } from "react";
import { Button } from "@/components/button";

type ErrorProps = {
  error: globalThis.Error & { digest?: string };
  retry: () => void;
};

const ErrorPage: FC<ErrorProps> = ({ error, retry }) => {
  useEffect(() => {
    console.error("Route error", {
      digest: error.digest,
      message: error.message,
    });
  }, [error]);

  return (
    <div className="flex min-h-svh flex-col items-center justify-center px-6 py-24 text-center">
      <span className="mb-6 inline-flex items-center rounded-md border-2 border-black bg-yellow-300 px-4 py-2 text-sm font-bold shadow-[4px_4px_0_0_#000]">
        503
      </span>

      <h1 className="text-4xl font-black tracking-tight text-black sm:text-5xl">
        Temporarily unavailable
      </h1>

      <p className="mt-4 max-w-md text-lg text-zinc-700">
        This page couldn&apos;t be loaded right now. Please try again in a
        moment.
      </p>

      <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
        <Button type="button" onClick={() => retry()}>
          Try again
        </Button>
        <Button asChild variant="secondary">
          <NextLink href="/">Back to home</NextLink>
        </Button>
      </div>
    </div>
  );
};

export default ErrorPage;
