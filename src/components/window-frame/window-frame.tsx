import type { FC, ReactNode } from "react";
import { RuleMarks } from "@/components/rule-box";
import type { ComponentPropsWithoutChildren } from "@/lib/component-props";
import { cn } from "@/lib/utils";

export type WindowFrameTone = "light" | "dark";
export type WindowFrameVariant = "document" | "app";

export interface WindowFrameProps
  extends Omit<ComponentPropsWithoutChildren<"div">, "title"> {
  children?: ReactNode;
  title?: ReactNode;
  actions?: ReactNode;
  tone?: WindowFrameTone;
  variant?: WindowFrameVariant;
  /** Clip inner media. Leave false when the frame only wraps text. */
  clip?: boolean;
  grow?: boolean;
}

const toneClasses: Record<WindowFrameTone, string> = {
  light: "text-[var(--fg-primary)]",
  dark: "bg-[var(--bg-dark)] text-[var(--fg-inverse)]",
};

const variantClasses: Record<WindowFrameVariant, string> = {
  document: "bg-[var(--bg-primary)]",
  app: "bg-[var(--bg-secondary)]",
};

const titleBarClasses: Record<WindowFrameTone, string> = {
  light:
    "border-[var(--color-border-strong)] bg-[var(--chrome-bar-bg)] text-[var(--chrome-bar-fg)]",
  dark: "border-white/10 bg-[var(--chrome-bar-bg-dark)] text-[#dedede]",
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
        "flex h-[var(--chrome-bar-height)] items-center justify-between gap-2 border-b px-1.5 font-[family-name:var(--font-pixel),var(--font-mono)] text-[length:var(--chrome-title-size)] leading-none tracking-[var(--chrome-title-tracking)]",
        titleBarClasses[tone],
      )}
    >
      {title ? (
        <div className="min-w-0 truncate normal-case">{title}</div>
      ) : (
        <span />
      )}
      {actions ? <div className="shrink-0">{actions}</div> : null}
    </div>
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
  variant = "document",
  clip = true,
  grow = false,
  ...props
}) => {
  const hasTitleBar = Boolean(title) || Boolean(actions);

  return (
    <div
      className={cn(
        "rule-box relative overflow-visible rounded-none border border-[var(--color-border-strong)]",
        tone === "light" ? variantClasses[variant] : undefined,
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
    </div>
  );
};
