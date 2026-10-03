import type { FC, ReactNode } from "react";
import { FaQuoteLeft } from "react-icons/fa";
import { RuleMarks } from "@/components/rule-box";
import type { ComponentPropsWithoutChildren } from "@/lib/component-props";
import { cn } from "@/lib/utils";

export interface CitedQuoteProps
  extends ComponentPropsWithoutChildren<"figure"> {
  quote: ReactNode;
  citation: string;
  citation_context?: string;
}

export const CitedQuote: FC<CitedQuoteProps> = ({
  quote,
  citation,
  citation_context,
  className,
  ...props
}) => {
  return (
    <figure
      className={cn(
        "rule-box relative overflow-visible bg-[var(--bg-primary)] px-5 pt-5 pb-4",
        className,
      )}
      {...props}
    >
      <RuleMarks />
      <FaQuoteLeft
        aria-hidden
        className="-top-2 left-4 absolute size-6 text-[var(--bg-accent-pink)]"
      />
      <blockquote className="font-[family-name:var(--font-geist-sans)] text-2xl font-medium leading-[1.15] tracking-[-0.03em] text-[var(--fg-primary)]">
        <div className="richtext-external-link-indicator [&_a]:underline [&_a]:underline-offset-2 [&_p]:m-0 [&_p+p]:mt-3">
          {quote}
        </div>
      </blockquote>
      <figcaption className="mt-3 font-[family-name:var(--font-mono)] text-[12px] font-medium tracking-[0.04em] text-[var(--fg-secondary)]">
        - {citation}
        {citation_context ? <span>, {citation_context}</span> : null}
      </figcaption>
    </figure>
  );
};
