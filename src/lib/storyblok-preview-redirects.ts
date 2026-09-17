const STORYBLOK_PREVIEW_QUERY_HAS = [
  { type: "query" as const, key: "_storyblok" },
  { type: "query" as const, key: "_storyblok_tk[space_id]" },
  { type: "query" as const, key: "_storyblok_tk[timestamp]" },
  { type: "query" as const, key: "_storyblok_tk[token]" },
];

const STORYBLOK_PREVIEW_MISSING = [
  { type: "query" as const, key: "returnTo" },
  { type: "cookie" as const, key: "__prerender_bypass" },
];

const ENABLE_DRAFT_PATH = "/api/storyblok/enable-draft";

export const getStoryblokDraftEnableRedirects = () => {
  return [
    {
      source: "/",
      has: STORYBLOK_PREVIEW_QUERY_HAS,
      missing: STORYBLOK_PREVIEW_MISSING,
      destination: `${ENABLE_DRAFT_PATH}?returnTo=/`,
      permanent: false,
    },
    {
      source: "/home",
      has: STORYBLOK_PREVIEW_QUERY_HAS,
      missing: STORYBLOK_PREVIEW_MISSING,
      destination: `${ENABLE_DRAFT_PATH}?returnTo=/`,
      permanent: false,
    },
    {
      source: "/:path*",
      has: STORYBLOK_PREVIEW_QUERY_HAS,
      missing: STORYBLOK_PREVIEW_MISSING,
      destination: `${ENABLE_DRAFT_PATH}?returnTo=/:path*`,
      permanent: false,
    },
  ];
};
