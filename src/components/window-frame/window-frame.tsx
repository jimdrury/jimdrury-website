import type { FC, ReactNode } from "react";
import type { ComponentPropsWithoutChildren } from "@/lib/component-props";
import { cn } from "@/lib/utils";

export type WindowFrameTone = "light" | "dark";

export interface WindowFrameProps extends ComponentPropsWithoutChildren<"div"> {
  children?: ReactNode;
  title?: ReactNode;
  actions?: ReactNode;
  tone?: WindowFrameTone;
}

const toneClasses: Record<WindowFrameTone, string> = {
  light:
    "border-[var(--color-border)] bg-[var(--bg-primary)] text-[var(--fg-primary)]",
  dark: "border-[var(--color-border)] bg-[var(--bg-dark)] text-[var(--fg-inverse)]",
};

const titleBarClasses: Record<WindowFrameTone, string> = {
  light:
    "border-[var(--color-border)] bg-[var(--bg-secondary)] text-[var(--fg-primary)]",
  dark: "border-white/10 bg-[#161616] text-[#abbab9]",
};

export const WindowFrame: FC<WindowFrameProps> = ({
  className,
  children,
  title,
  actions,
  tone = "light",
  ...props
}) => {
  const hasTitleBar = Boolean(title) || Boolean(actions);

  return (
    <div
      className={cn(
        "overflow-hidden rounded-none border",
        toneClasses[tone],
        className,
      )}
      {...props}
    >
      {hasTitleBar ? (
        <div
          className={cn(
            "flex items-center justify-between gap-3 border-b px-3 py-2",
            titleBarClasses[tone],
          )}
        >
          <div className="flex min-w-0 items-center gap-2">
            <span className="flex shrink-0 items-center gap-1" aria-hidden>
              <span className="size-1.5 rounded-full bg-[#abbab9]" />
              <span className="size-1.5 rounded-full bg-[#abbab9]" />
              <span className="size-1.5 rounded-full bg-[#abbab9]" />
            </span>
            {title ? (
              <div className="min-w-0 truncate font-[family-name:var(--font-mono)] text-[11px] font-medium tracking-[0.04em]">
                {title}
              </div>
            ) : null}
          </div>
          {actions ? <div className="shrink-0">{actions}</div> : null}
        </div>
      ) : null}
      {children}
    </div>
  );
};
