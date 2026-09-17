"use client";

import type { FC } from "react";
import { useEffect } from "react";

const REFRESH_INTERVAL_MS = 60 * 1000;
const REFRESH_URL = "/api/storyblok/refresh-draft";

export interface DraftModeRefreshProps {
  isEnabled: boolean;
}

export const DraftModeRefresh: FC<DraftModeRefreshProps> = ({ isEnabled }) => {
  useEffect(() => {
    if (!isEnabled) return;

    const refresh = () => {
      fetch(REFRESH_URL, { credentials: "include" }).catch(() => {
        // Ignore errors; draft mode may have been disabled
      });
    };

    refresh(); // Initial refresh shortly after mount
    const id = setInterval(refresh, REFRESH_INTERVAL_MS);
    return () => clearInterval(id);
  }, [isEnabled]);

  return null;
};
