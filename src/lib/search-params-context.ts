import "server-only";
import { cache } from "react";

type SearchParamsRecord = Record<string, string | string[] | undefined>;

type SearchParamsContext = {
  params: SearchParamsRecord;
  pathname: string;
};

const getSearchParamsContext = cache((): SearchParamsContext => {
  return { params: {}, pathname: "/" };
});

export const setCurrentSearchParams = (
  params: SearchParamsRecord,
  pathname: string,
): void => {
  const context = getSearchParamsContext();
  context.params = params;
  context.pathname = pathname;
};

export const getCurrentSearchParams = (): SearchParamsRecord => {
  return getSearchParamsContext().params;
};

export const getCurrentSearchParam = (key: string): string | undefined => {
  const value = getCurrentSearchParams()[key];
  return Array.isArray(value) ? value[0] : value;
};

export const getCurrentPathname = (): string => {
  return getSearchParamsContext().pathname;
};
