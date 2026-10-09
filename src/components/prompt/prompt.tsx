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
        className="min-w-0 flex-1 overflow-hidden rounded-md border-2 border-black bg-zinc-50 shadow-[4px_4px_0_0]"
        data-prompt-title={title}
      >
        {(title || copyText) && (
          <figcaption className="flex items-center justify-between gap-3 border-b-2 border-black bg-gradient-to-r from-purple-600 to-blue-500 px-4 py-2 font-mono text-sm font-semibold text-white">
            <span className="truncate">&lt;{title}&gt;</span>
            {copyText ? <PromptCopyButton /> : null}
          </figcaption>
        )}
        <div
          data-prompt-copy-content=""
          className={cn(
            "prose prose-sm max-w-none overflow-x-auto px-4 py-3 font-mono",
            "prose-headings:font-bold prose-headings:text-black",
            "prose-p:my-2 prose-p:leading-relaxed",
            "prose-code:rounded prose-code:bg-zinc-200 prose-code:px-1 prose-code:py-0.5 prose-code:text-xs prose-code:before:content-none prose-code:after:content-none",
            "prose-pre:rounded prose-pre:bg-zinc-200 prose-pre:text-xs",
            "prose-ul:my-2 prose-ol:my-2",
          )}
        >
          {children}
        </div>
        {title && (
          <div className="border-t-2 border-black bg-gradient-to-r from-purple-600 to-blue-500 px-4 py-2 font-mono text-sm font-semibold text-white">
            &lt;/{title}&gt;
          </div>
        )}
      </figure>
    </div>
  );
};
