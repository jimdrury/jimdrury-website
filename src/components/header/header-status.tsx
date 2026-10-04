"use client";

import { usePathname } from "next/navigation";
import type { FC } from "react";

export const HeaderStatus: FC = () => {
  const pathname = usePathname();
  const path = pathname === "/" ? "~/" : `~${pathname}`;

  return (
    <span className="hidden min-w-0 truncate font-[family-name:var(--font-pixel),var(--font-mono)] text-[13px] leading-none text-[var(--fg-primary)]/70 sm:inline">
      {path}
      <span className="mx-2 text-[var(--fg-muted)]" aria-hidden>
        ·
      </span>
      JD.OS1
    </span>
  );
};
