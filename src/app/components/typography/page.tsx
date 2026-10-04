import type { Metadata } from "next";
import type { FC } from "react";

import { TypographyScaleShowcase } from "./_components/typography-scale-showcase/typography-scale-showcase";

export const metadata: Metadata = {
  title: "Typography",
  description:
    "Typography scale: single component with size axis (Inter / Geist).",
};

const Page: FC<PageProps<"/components/typography">> = () => {
  return (
    <div className="mx-auto max-w-none px-4 py-16 pb-24">
      <TypographyScaleShowcase />
    </div>
  );
};

export default Page;
