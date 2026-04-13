import Link from "next/link";
import type { FC } from "react";
import type { IconType } from "react-icons";
import { FaGithub, FaLinkedinIn } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import type { ComponentPropsWithoutChildren } from "@/lib/component-props";
import { cn } from "@/lib/utils";

export interface SiteFooterProps
  extends ComponentPropsWithoutChildren<"footer"> {
  currentYear: number;
}

const SOCIAL_LINKS: ReadonlyArray<{
  href: string;
  label: string;
  IconComponent: IconType;
}> = [
  {
    href: "https://linked.in/jimdrury",
    label: "LinkedIn",
    IconComponent: FaLinkedinIn,
  },
  {
    href: "https://x.com/jim_drury",
    label: "X",
    IconComponent: FaXTwitter,
  },
  {
    href: "https://github.com/jimdrury",
    label: "GitHub",
    IconComponent: FaGithub,
  },
];

export const SiteFooter: FC<SiteFooterProps> = ({
  className,
  currentYear,
  ...props
}) => {
  return (
    <footer
      className={cn(
        "flex flex-col items-center gap-2 bg-[var(--fg-primary)] px-5 py-8 text-[var(--fg-inverse)] sm:gap-6 sm:px-12 sm:py-10",
        className,
      )}
      {...props}
    >
      <p className="font-[family-name:var(--font-geist-mono)] text-xs font-semibold uppercase tracking-[2px] sm:text-sm">
        Jim Drury &copy; {currentYear}
      </p>
      <p className="font-[family-name:var(--font-anton)] text-xl uppercase tracking-[2px] sm:text-2xl">
        Built with boldness.
      </p>
      <div className="flex w-full items-center justify-between">
        <nav aria-label="Social links">
          <ul className="flex items-center gap-4 sm:gap-5">
            {SOCIAL_LINKS.map(({ href, label, IconComponent }) => (
              <li key={href} className="list-none">
                <a
                  href={href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={label}
                  className="inline-flex text-[var(--fg-inverse)] transition-opacity hover:opacity-80 focus-visible:focus-ring-sm"
                >
                  <IconComponent className="size-[18px] sm:size-5" />
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <Link
          href="/legal/privacy-policy"
          className="font-[family-name:var(--font-geist-mono)] text-xs font-semibold tracking-[2px] text-[var(--fg-inverse)] transition-opacity hover:opacity-80 focus-visible:focus-ring-sm sm:text-sm"
        >
          Privacy Policy
        </Link>
      </div>
    </footer>
  );
};
