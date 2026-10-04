import type { FC, ReactNode } from "react";
import { HERO_CONTENT_INNER_CLASS } from "@/components/hero";
import { Spine } from "@/components/spine";
import type { ComponentPropsWithoutChildren } from "@/lib/component-props";
import { cn } from "@/lib/utils";

export interface StatusBandProps
  extends Omit<ComponentPropsWithoutChildren<"section">, "title"> {
  /** Optional pill label. The spine already says Now, so this is decorative only. */
  badge?: ReactNode;
  children: ReactNode;
}

export const StatusBand: FC<StatusBandProps> = ({
  badge: _badge,
  children,
  className,
  ...props
}) => {
  return (
    <section
      className={cn(
        "w-full bg-[var(--bg-primary)] pt-8 pb-10 lg:pt-10 lg:pb-8",
        className,
      )}
      {...props}
    >
      <div className={HERO_CONTENT_INNER_CLASS}>
        <Spine label="Now">
          <div className="min-w-0 max-w-[80ch] text-[var(--fg-primary)] [&_*]:m-0">
            {children}
          </div>
        </Spine>
      </div>
    </section>
  );
};
