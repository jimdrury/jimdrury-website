import "server-only";
import { type SbBlokData, storyblokEditable } from "@storyblok/react/rsc";
import type { FC } from "react";
import { TableOfContents } from "@/components/table-of-contents";

type TableOfContentsBlokProps = {
  blok: SbBlokData;
};

export const TableOfContentsBlok: FC<TableOfContentsBlokProps> = ({ blok }) => {
  return (
    <div {...storyblokEditable(blok)}>
      <TableOfContents />
    </div>
  );
};
