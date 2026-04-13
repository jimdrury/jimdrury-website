import type { FC } from "react";

import { buildOrganizationJsonLd, serializeJsonLd } from "@/lib/seo";

interface OrganizationJsonLdProps {
  storySlug: string;
}

export const OrganizationJsonLd: FC<OrganizationJsonLdProps> = ({
  storySlug,
}) => {
  if (storySlug !== "home") {
    return null;
  }

  const jsonLd = serializeJsonLd(buildOrganizationJsonLd());

  return <script type="application/ld+json">{jsonLd}</script>;
};
