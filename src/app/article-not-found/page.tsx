import type { Metadata } from "next";
import { notFound } from "next/navigation";
import type { FC } from "react";

export const metadata: Metadata = {
  title: "Page not found",
  robots: {
    index: false,
    follow: false,
  },
};

const Page: FC<PageProps<"/article-not-found">> = () => {
  notFound();
};

export default Page;
