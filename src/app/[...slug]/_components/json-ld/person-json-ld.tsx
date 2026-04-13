import type { FC } from "react";

import { buildPersonJsonLd, serializeJsonLd } from "@/lib/seo";

interface PersonJsonLdProps {
  storySlug: string;
}

export const PersonJsonLd: FC<PersonJsonLdProps> = ({ storySlug }) => {
  if (storySlug !== "about") {
    return null;
  }

  const jsonLd = serializeJsonLd(buildPersonJsonLd());

  return <script type="application/ld+json">{jsonLd}</script>;
};
