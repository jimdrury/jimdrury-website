"use client";

import { usePathname } from "next/navigation";
import type { FC } from "react";

export const HeaderStatus: FC = () => {
  const pathname = usePathname();
  const path = pathname === "/" ? "/" : pathname;

  return (
    <span className="hidden min-w-0 truncate font-[family-name:var(--font-mono)] text-[11px] font-medium tracking-[0.08em] text-[var(--fg-muted)] sm:inline">
      {path}
      <span className="mx-2 text-[var(--color-border-soft)]" aria-hidden>
        /
      </span>
      JIM.OS
    </span>
  );
};
