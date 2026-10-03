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
        "flex flex-col items-center gap-4 border-t border-[var(--color-border)] bg-[var(--bg-primary)] px-5 py-6 text-[var(--fg-primary)] lg:flex-row lg:justify-between lg:gap-6 lg:px-12",
        className,
      )}
      {...props}
    >
      <nav aria-label="Social links">
        <ul className="flex items-center gap-4 sm:gap-5">
          {SOCIAL_LINKS.map(({ href, label, IconComponent }) => (
            <li key={href} className="list-none">
              <a
                href={href}
                target="_blank"
                rel="noreferrer"
                aria-label={label}
                className="inline-flex text-[var(--fg-primary)] transition-opacity hover:opacity-60 focus-visible:focus-ring-sm"
              >
                <IconComponent className="size-[16px] sm:size-[18px]" />
              </a>
            </li>
          ))}
        </ul>
      </nav>
      <div className="flex flex-col items-center gap-1 text-center lg:flex-1">
        <p className="font-[family-name:var(--font-mono)] text-[11px] font-medium tracking-[0.08em] text-[var(--fg-secondary)] sm:text-xs">
          Jim Drury &copy; {currentYear}
        </p>
        <p className="font-[family-name:var(--font-geist-sans)] text-sm font-medium tracking-[-0.02em]">
          Built with boldness.
        </p>
      </div>
      <Link
        href="/legal/privacy-policy"
        className="font-[family-name:var(--font-mono)] text-[11px] font-medium tracking-[0.06em] text-[var(--fg-secondary)] transition-opacity hover:opacity-70 focus-visible:focus-ring-sm sm:text-xs"
      >
        Privacy Policy
      </Link>
    </footer>
  );
};
