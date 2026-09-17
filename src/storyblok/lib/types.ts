import type { StoryblokRichTextNode } from "@storyblok/js";
import type { FC } from "react";

export type SbBlokData = {
  _uid?: string;
  component: string;
  _editable?: string;
  [key: string]: unknown;
};

export type StoryData = {
  id?: number;
  uuid?: string;
  name?: string;
  slug?: string;
  full_slug?: string;
  content: unknown;
};

export type StoryRenderProps = {
  pathname: string;
  story: StoryData;
};

export type BlokRendererProps = {
  blok: SbBlokData;
} & StoryRenderProps;

export type BlokComponent<T extends SbBlokData = SbBlokData> = FC<
  {
    blok: T;
  } & StoryRenderProps
>;

export type BlokComponentMap = Record<string, BlokComponent>;

export type { StoryblokRichTextNode };
