import type { FC, ReactNode } from "react";
import { RuleMarks } from "@/components/rule-box";
import type { ComponentPropsWithoutChildren } from "@/lib/component-props";
import { cn } from "@/lib/utils";

export type WindowFrameTone = "light" | "dark";

export interface WindowFrameProps
  extends Omit<ComponentPropsWithoutChildren<"div">, "title"> {
  children?: ReactNode;
  title?: ReactNode;
  actions?: ReactNode;
  tone?: WindowFrameTone;
  /** Clip inner media. Leave false when the frame only wraps text. */
  clip?: boolean;
  grow?: boolean;
}

const toneClasses: Record<WindowFrameTone, string> = {
  light: "bg-[var(--bg-primary)] text-[var(--fg-primary)]",
  dark: "bg-[var(--bg-dark)] text-[var(--fg-inverse)]",
};

const titleBarClasses: Record<WindowFrameTone, string> = {
  light:
    "border-[var(--color-border)] bg-[var(--chrome-bar-bg)] text-[var(--fg-primary)]",
  dark: "border-white/10 bg-[var(--chrome-bar-bg-dark)] text-[#abbab9]",
};

export const OsDots: FC<{ className?: string }> = ({ className }) => {
  return (
    <span
      className={cn("flex shrink-0 items-center gap-1", className)}
      aria-hidden
    >
      <span className="size-1.5 rounded-full bg-[var(--chrome-dot-color)]" />
      <span className="size-1.5 rounded-full bg-[var(--chrome-dot-color)]" />
      <span className="size-1.5 rounded-full bg-[var(--chrome-dot-color)]" />
    </span>
  );
};

export interface OsTitleBarProps {
  title?: ReactNode;
  actions?: ReactNode;
  tone?: WindowFrameTone;
}

export const OsTitleBar: FC<OsTitleBarProps> = ({
  title,
  actions,
  tone = "light",
}) => {
  return (
    <div
      className={cn(
        "flex h-[var(--chrome-bar-height)] items-center justify-between gap-3 border-b px-3",
        titleBarClasses[tone],
      )}
    >
      <div className="flex min-w-0 items-center gap-2">
        <OsDots />
        {title ? (
          <div className="min-w-0 truncate font-[family-name:var(--font-mono)] text-[length:var(--chrome-title-size)] font-medium tracking-[var(--chrome-title-tracking)]">
            {title}
          </div>
        ) : null}
      </div>
      {actions ? <div className="shrink-0">{actions}</div> : null}
    </div>
  );
};

export const OsGrowBox: FC = () => {
  return (
    <span
      aria-hidden
      className="pointer-events-none absolute -right-px -bottom-px z-[3] size-2.5 border-t border-l border-[var(--color-border)] bg-[var(--bg-secondary)]"
    />
  );
};

export const toChromeFilename = (
  label: string | undefined,
  ext = "md",
): string => {
  if (!label?.trim()) {
    return `untitled.${ext}`;
  }

  const slug = label
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  return `${slug || "untitled"}.${ext}`;
};

export const WindowFrame: FC<WindowFrameProps> = ({
  className,
  children,
  title,
  actions,
  tone = "light",
  clip = true,
  grow = false,
  ...props
}) => {
  const hasTitleBar = Boolean(title) || Boolean(actions);

  return (
    <div
      className={cn(
        "rule-box relative overflow-visible rounded-none",
        toneClasses[tone],
        className,
      )}
      data-grow={grow ? "true" : undefined}
      {...props}
    >
      <RuleMarks />
      {hasTitleBar ? (
        <OsTitleBar title={title} actions={actions} tone={tone} />
      ) : null}
      {clip ? <div className="overflow-hidden">{children}</div> : children}
      <OsGrowBox />
    </div>
  );
};
