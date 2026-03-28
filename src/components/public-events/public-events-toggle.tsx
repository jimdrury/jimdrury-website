"use client";

import type { FC, ReactNode } from "react";
import { useMemo, useState } from "react";
import { Button } from "@/components/button";

export interface PublicEventsToggleProps {
  children?: ReactNode;
  initialVisibleCount?: number;
}

export const PublicEventsToggle: FC<PublicEventsToggleProps> = ({
  children,
  initialVisibleCount = 3,
}) => {
  const items = useMemo(() => {
    return Array.isArray(children) ? children : [children];
  }, [children]);
  const visibleCount = Math.max(1, Math.trunc(initialVisibleCount));
  const [expanded, setExpanded] = useState(false);
  const visibleItems = expanded ? items : items.slice(0, visibleCount);

  return (
    <div className="space-y-4">
      {visibleItems}
      {items.length > visibleCount ? (
        <div>
          <Button
            type="button"
            variant="secondary"
            onClick={() => setExpanded((prev) => !prev)}
          >
            {expanded
              ? "Show fewer events"
              : `Show more events (${items.length - visibleCount})`}
          </Button>
        </div>
      ) : null}
    </div>
  );
};
