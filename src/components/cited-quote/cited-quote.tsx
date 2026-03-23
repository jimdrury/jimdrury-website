import type { FC, ReactNode } from "react";
import { FaQuoteLeft } from "react-icons/fa";
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
        "relative rounded-md border-2 border-black bg-zinc-100 px-5 pt-5 pb-4 shadow-[4px_4px_0_0_#000]",
        className,
      )}
      {...props}
    >
      <FaQuoteLeft
        aria-hidden
        className="-top-3 -left-2 absolute size-9 rotate-[-8deg] text-yellow-500"
      />
      <blockquote className="font-[family-name:var(--font-patrick-hand)] text-2xl font-bold leading-none text-black">
        <div className="richtext-external-link-indicator [&_a]:underline [&_a]:underline-offset-2 [&_p]:m-0 [&_p+p]:mt-3">
          {quote}
        </div>
      </blockquote>
      <figcaption className="mt-3 text-sm font-semibold text-zinc-700">
        - {citation}
        {citation_context ? <span>, {citation_context}</span> : null}
      </figcaption>
    </figure>
  );
};
