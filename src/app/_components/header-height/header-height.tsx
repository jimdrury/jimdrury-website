"use client";

import type { FC } from "react";
import { useLayoutEffect } from "react";
import {
  applyHeaderHeight,
  SITE_HEADER_ATTRIBUTE,
} from "../../_helpers/header-height";

const siteHeaderSelector = `[${SITE_HEADER_ATTRIBUTE}]`;

export const HeaderHeight: FC = () => {
  useLayoutEffect(() => {
    const header = document.querySelector(siteHeaderSelector);
    if (!(header instanceof HTMLElement)) {
      return;
    }

    const sync = () => {
      applyHeaderHeight(
        document.documentElement.style,
        header.getBoundingClientRect().height,
      );
    };

    sync();

    if (typeof ResizeObserver === "undefined") {
      return;
    }

    const observer = new ResizeObserver(sync);
    observer.observe(header);
    return () => observer.disconnect();
  }, []);

  return null;
};
