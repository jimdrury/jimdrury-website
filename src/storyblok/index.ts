import "server-only";
import { apiPlugin, setComponents, storyblokInit } from "@storyblok/react/rsc";
import { Feature } from "@/bloks/Feature";
import { Grid } from "@/bloks/Grid";
import { Page } from "@/bloks/Page";
import { Teaser } from "@/bloks/Teaser";
import { environment } from "@/environment";

const blokComponents = {
  page: Page,
  feature: Feature,
  grid: Grid,
  teaser: Teaser,
};

export const getStoryblokApi = () => {
  const api = storyblokInit({
    accessToken: environment.STORYBLOK_ACCESS_TOKEN,
    use: [apiPlugin],
    apiOptions: {
      region: "eu",
    },
  })();

  // storyblokInit caches a singleton and does not re-apply component maps
  // after first init; refresh the registry so blok edits are picked up in dev.
  setComponents(blokComponents);

  return api;
};
