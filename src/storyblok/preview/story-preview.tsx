"use client";

import type { ISbEventPayload, ISbStoryData } from "@storyblok/js";
import {
  type FC,
  type ReactNode,
  startTransition,
  useEffect,
  useRef,
  useState,
} from "react";
import { renderStoryPreview } from "@/storyblok/actions/render-story-preview";
import type { StoryData } from "@/storyblok/lib";

const INPUT_DEBOUNCE_MS = 250;
const STORYBLOK_BRIDGE_SCRIPT_URL =
  "https://app.storyblok.com/f/storyblok-v2-latest.js";
const STORYBLOK_BRIDGE_SELECTOR = 'script[data-storyblok-bridge="true"]';

export interface StoryPreviewProps {
  storyId: number;
  story: StoryData;
  children: ReactNode;
}

const toStoryData = (story: ISbStoryData | StoryData): StoryData => {
  return story as StoryData;
};

const isMatchingStory = (
  storyId: number,
  incomingStory: ISbStoryData | StoryData,
): boolean => {
  return typeof incomingStory.id === "number" && incomingStory.id === storyId;
};

const loadStoryblokBridgeScript = async (): Promise<void> => {
  if (window.StoryblokBridge) {
    return;
  }

  const existingScript = document.querySelector<HTMLScriptElement>(
    STORYBLOK_BRIDGE_SELECTOR,
  );

  if (existingScript) {
    await new Promise<void>((resolve, reject) => {
      if (window.StoryblokBridge) {
        resolve();
        return;
      }

      const handleLoad = () => resolve();
      const handleError = () =>
        reject(new Error("Failed to load Storyblok Bridge script."));

      existingScript.addEventListener("load", handleLoad, { once: true });
      existingScript.addEventListener("error", handleError, { once: true });
    });
    return;
  }

  await new Promise<void>((resolve, reject) => {
    const script = document.createElement("script");
    script.src = STORYBLOK_BRIDGE_SCRIPT_URL;
    script.async = true;
    script.dataset.storyblokBridge = "true";
    script.addEventListener("load", () => resolve(), { once: true });
    script.addEventListener(
      "error",
      () => reject(new Error("Failed to load Storyblok Bridge script.")),
      { once: true },
    );
    document.head.appendChild(script);
  });
};

export const StoryPreview: FC<StoryPreviewProps> = ({
  storyId,
  story,
  children,
}) => {
  const [renderedPreview, setRenderedPreview] = useState<ReactNode>(children);
  const latestStoryRef = useRef<StoryData>(story);
  const inputTimeoutRef = useRef<number | undefined>(undefined);
  const isUnmountedRef = useRef(false);

  useEffect(() => {
    setRenderedPreview(children);
  }, [children]);

  useEffect(() => {
    latestStoryRef.current = story;
  }, [story]);

  useEffect(() => {
    isUnmountedRef.current = false;

    const updatePreview = async (incomingStory: StoryData) => {
      const nextRender = await renderStoryPreview(incomingStory);

      if (isUnmountedRef.current || !nextRender) {
        return;
      }

      startTransition(() => {
        setRenderedPreview(nextRender);
      });
    };

    const scheduleInputUpdate = (incomingStory: StoryData) => {
      if (inputTimeoutRef.current) {
        window.clearTimeout(inputTimeoutRef.current);
      }

      inputTimeoutRef.current = window.setTimeout(() => {
        void updatePreview(incomingStory);
      }, INPUT_DEBOUNCE_MS);
    };

    const initBridge = async () => {
      await loadStoryblokBridgeScript();

      if (!window.StoryblokBridge) {
        return;
      }

      const storyblokBridge = new window.StoryblokBridge({
        preventClicks: true,
      });

      storyblokBridge.on("input", (payload?: ISbEventPayload) => {
        const bridgeStory = payload?.story;

        if (!bridgeStory || !isMatchingStory(storyId, bridgeStory)) {
          return;
        }

        const incomingStory = toStoryData(bridgeStory);
        latestStoryRef.current = incomingStory;
        scheduleInputUpdate(incomingStory);
      });

      storyblokBridge.on(
        ["change", "published"],
        (payload?: ISbEventPayload) => {
          const action = payload?.action;
          const bridgeStory = payload?.story;

          if (action !== "change" && action !== "published") {
            return;
          }

          if (bridgeStory && !isMatchingStory(storyId, bridgeStory)) {
            return;
          }

          void updatePreview(latestStoryRef.current);
        },
      );
    };

    void initBridge();

    return () => {
      isUnmountedRef.current = true;

      if (inputTimeoutRef.current) {
        window.clearTimeout(inputTimeoutRef.current);
      }
    };
  }, [storyId]);

  return renderedPreview;
};
