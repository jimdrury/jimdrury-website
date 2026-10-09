"use client";

import type { FC } from "react";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

export const BackToTop: FC = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const SHOW_THRESHOLD = window.innerHeight * 0.5;
    const HIDE_THRESHOLD = window.innerHeight * 0.4;

    const onScroll = () => {
      setVisible((prev) => {
        if (!prev && window.scrollY > SHOW_THRESHOLD) return true;
        if (prev && window.scrollY < HIDE_THRESHOLD) return false;
        return prev;
      });
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <button
      type="button"
      onClick={scrollToTop}
      aria-label="Back to top"
      className={cn(
        "fixed bottom-8 right-8 z-50 flex size-12 cursor-pointer items-center justify-center rounded-xl border-[3px] border-[var(--fg-primary)] bg-[var(--bg-accent-yellow)] shadow-[4px_4px_0_0_var(--fg-primary)] transition-[opacity,box-shadow] hover:bg-[#f5cf2a] hover:shadow-[2px_2px_0_0_var(--fg-primary)] focus-visible:outline-2 focus-visible:outline-transparent focus-visible:outline-offset-[4px] focus-visible:shadow-[0_0_0_2px_var(--bg-primary),0_0_0_4px_var(--fg-primary),4px_4px_0_0_var(--fg-primary)]",
        visible ? "opacity-100" : "pointer-events-none opacity-0",
      )}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M12 19V5M5 12l7-7 7 7" />
      </svg>
    </button>
  );
};
