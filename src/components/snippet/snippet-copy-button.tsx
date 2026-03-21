"use client";

import type { FC } from "react";
import { useEffect, useState } from "react";
import { Button } from "@/components/button";

type SnippetCopyButtonProps = {
  code: string;
};

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

export const SnippetCopyButton: FC<SnippetCopyButtonProps> = ({ code }) => {
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

  const handleClick = async (): Promise<void> => {
    try {
      await copyText(code);
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
      onClick={handleClick}
      aria-live="polite"
    >
      {copied ? "Copied" : "Copy"}
    </Button>
  );
};
