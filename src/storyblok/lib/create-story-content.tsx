import { notFound } from "next/navigation";
import type { FC, ReactNode } from "react";
import type { BlokRendererProps, SbBlokData, StoryData } from "./types";

type StoryRenderMode = "draft" | "published";

type StoryContentProps = {
  story: StoryData;
  pathname: string;
  mode: StoryRenderMode;
};

const isSbBlokData = (value: unknown): value is SbBlokData => {
  return (
    typeof value === "object" &&
    value !== null &&
    "component" in value &&
    typeof value.component === "string"
  );
};

export const parseStoryContent = (story: StoryData): SbBlokData | null => {
  if (typeof story.content !== "string") {
    return isSbBlokData(story.content) ? story.content : null;
  }

  try {
    const parsedContent = JSON.parse(story.content) as unknown;
    return isSbBlokData(parsedContent) ? parsedContent : null;
  } catch (error) {
    console.error(
      "An error occurred while trying to parse the story content",
      error,
    );
    return null;
  }
};

type StoryContentParseErrorProps = {
  name?: string;
};

const StoryContentParseError: FC<StoryContentParseErrorProps> = ({ name }) => {
  return (
    <div
      role="alert"
      className="mx-auto my-12 max-w-2xl rounded-md border-[3px] border-black bg-yellow-300 p-6 shadow-[4px_4px_0_0_#000]"
    >
      <p className="text-lg font-bold">This draft could not be rendered.</p>
      <p className="mt-2 text-zinc-800">
        The story content is missing or invalid. Check the fields in Storyblok
        and try again.
      </p>
      {name ? <p className="mt-2 font-mono text-sm">{name}</p> : null}
    </div>
  );
};

const handleInvalidStoryContent = (
  story: StoryData,
  mode: StoryRenderMode,
): ReactNode => {
  console.error("Story content is missing or invalid", {
    name: story.name,
    mode,
  });

  switch (mode) {
    case "draft":
      return <StoryContentParseError name={story.name} />;
    case "published":
      return notFound();
    default: {
      const exhaustive: never = mode;
      throw new Error(`Unhandled story render mode: ${exhaustive}`);
    }
  }
};

export const createStoryContent = (
  BlokRenderer: FC<BlokRendererProps>,
): FC<StoryContentProps> => {
  const StoryContent: FC<StoryContentProps> = ({ story, pathname, mode }) => {
    const content = parseStoryContent(story);

    if (!content) {
      return handleInvalidStoryContent(story, mode);
    }

    const resolvedStory = {
      ...story,
      content,
    };

    return (
      <BlokRenderer blok={content} pathname={pathname} story={resolvedStory} />
    );
  };

  StoryContent.displayName = "StoryContent";

  return StoryContent;
};
