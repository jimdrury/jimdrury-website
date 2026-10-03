import type { FC, ReactNode } from "react";
import type { ComponentPropsWithoutChildren } from "@/lib/component-props";
import { cn } from "@/lib/utils";
import { PromptCopyButton } from "./prompt-copy-button";

export interface PromptProps extends ComponentPropsWithoutChildren<"div"> {
  children: ReactNode;
  title?: string;
  copyText?: string;
}

export const Prompt: FC<PromptProps> = ({
  children,
  title,
  copyText,
  className,
  ...props
}) => {
  return (
    <div className={cn("max-w-prose", className)} {...props}>
      <figure
        className="min-w-0 flex-1 overflow-hidden rounded-none border border-[var(--color-border)] bg-[var(--bg-primary)]"
        data-prompt-title={title}
      >
        {(title || copyText) && (
          <figcaption className="flex items-center justify-between gap-3 border-b border-[var(--color-border)] bg-[var(--bg-dark)] px-4 py-2 font-[family-name:var(--font-mono)] text-[11px] font-medium tracking-[0.06em] text-[#abbab9]">
            <span className="truncate">&lt;{title}&gt;</span>
            {copyText ? <PromptCopyButton /> : null}
          </figcaption>
        )}
        <div
          data-prompt-copy-content=""
          className={cn(
            "prose prose-sm max-w-none overflow-x-auto px-4 py-3 font-[family-name:var(--font-mono)]",
            "prose-headings:font-medium prose-headings:text-[var(--fg-primary)]",
            "prose-p:my-2 prose-p:leading-relaxed",
            "prose-code:rounded-none prose-code:bg-[var(--bg-secondary)] prose-code:px-1 prose-code:py-0.5 prose-code:text-xs prose-code:before:content-none prose-code:after:content-none",
            "prose-pre:rounded-none prose-pre:bg-[var(--bg-secondary)] prose-pre:text-xs",
            "prose-ul:my-2 prose-ol:my-2",
          )}
        >
          {children}
        </div>
        {title && (
          <div className="border-t border-[var(--color-border)] bg-[var(--bg-dark)] px-4 py-2 font-[family-name:var(--font-mono)] text-[11px] font-medium tracking-[0.06em] text-[#abbab9]">
            &lt;/{title}&gt;
          </div>
        )}
      </figure>
    </div>
  );
};
