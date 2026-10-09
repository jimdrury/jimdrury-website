"use client";

import type { FC } from "react";
import { useEffect, useState } from "react";
import { Button } from "@/components/button";

const copyText = async (value: string): Promise<void> => {
  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(value);
    return;
  }

  const textarea = document.createElement("textarea");
  textarea.value = value;
  textarea.setAttribute("readonly", "");
  textarea.style.position = "absolute";
  textarea.style.left = "-9999px";
  document.body.appendChild(textarea);
  textarea.select();
  document.execCommand("copy");
  document.body.removeChild(textarea);
};

const getPromptText = (button: HTMLButtonElement): string | null => {
  const figure = button.closest("figure");
  const content = figure?.querySelector<HTMLElement>(
    "[data-prompt-copy-content]",
  );
  const body = content?.innerText?.trimEnd();

  if (!body) {
    return null;
  }

  const title = figure?.dataset.promptTitle;
  if (!title) {
    return body;
  }

  return `<${title}>\n${body}\n</${title}>`;
};

export const PromptCopyButton: FC = () => {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      setCopied(false);
    }, 2000);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [copied]);

  const handleClick = async (button: HTMLButtonElement): Promise<void> => {
    try {
      const promptText = getPromptText(button);

      if (!promptText) {
        setCopied(false);
        return;
      }

      await copyText(promptText);
      setCopied(true);
    } catch {
      setCopied(false);
    }
  };

  return (
    <Button
      type="button"
      size="small"
      variant="secondary"
      className="shrink-0 px-3 py-1 text-xs"
      onClick={(event) => void handleClick(event.currentTarget)}
      aria-live="polite"
      aria-label={copied ? "Copied to clipboard" : "Copy prompt to clipboard"}
      data-nosnippet=""
    >
      {copied ? "Copied" : "Copy"}
    </Button>
  );
};
