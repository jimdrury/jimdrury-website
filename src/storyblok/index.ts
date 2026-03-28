import "server-only";
import { apiPlugin, storyblokInit } from "@storyblok/js";
import { cache } from "react";
import { environment } from "@/environment";

export const getStoryblokApi = () => {
  const api = storyblokInit({
    accessToken: environment.STORYBLOK_ACCESS_TOKEN,
    use: [apiPlugin],
    apiOptions: {
      region: "eu",
    },
  }).storyblokApi;

  if (!api) {
    throw new Error("Storyblok API failed to initialize.");
  }

  return api;
};

export const getStoryblokCv = cache((): number => {
  return Date.now();
});
