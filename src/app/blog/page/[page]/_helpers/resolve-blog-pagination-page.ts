import { draftMode } from "next/headers";
import { getBlogIndexArchive, parsePageParam } from "@/lib/blog";

export const resolveBlogPaginationPage = async (page: string) => {
  const pageNumber = parsePageParam(page);

  if (pageNumber <= 1) {
    return { pageNumber, isValid: false as const };
  }

  const { isEnabled } = await draftMode();
  const archive = await getBlogIndexArchive({
    page: pageNumber,
    version: isEnabled ? "draft" : "published",
  });

  if (pageNumber > archive.pagination.totalPages) {
    return { pageNumber, isValid: false as const };
  }

  return { pageNumber, isValid: true as const };
};
