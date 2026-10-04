import Link from "next/link";
import type { FC } from "react";
import type { IconType } from "react-icons";
import { FaGithub, FaLinkedinIn } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { EdgeMarkers } from "@/components/edge-markers";
import { IconBox } from "@/components/icon-box";
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
        "relative flex flex-col items-center gap-4 border-t border-[var(--color-border-strong)] bg-[var(--bg-dark)] px-5 py-6 pt-8 text-[var(--fg-inverse)] lg:flex-row lg:justify-between lg:gap-6 lg:px-12",
        className,
      )}
      {...props}
    >
      <EdgeMarkers className="text-[var(--fg-inverse)]/50" />
      <p className="font-[family-name:var(--font-pixel),var(--font-mono)] text-[13px] leading-none text-[var(--fg-inverse)]/80">
        Jim Drury &copy; {currentYear}
        <span className="mx-2 opacity-50" aria-hidden>
          ·
        </span>
        <span>JD.OS1</span>
      </p>
      <nav aria-label="Social links">
        <ul className="flex items-center gap-3">
          {SOCIAL_LINKS.map(({ href, label, IconComponent }) => (
            <li key={href} className="list-none">
              <a
                href={href}
                target="_blank"
                rel="noreferrer"
                aria-label={label}
                className="group inline-flex focus-visible:focus-ring-sm"
              >
                <IconBox size="md" tone="inverse">
                  <IconComponent />
                </IconBox>
              </a>
            </li>
          ))}
        </ul>
      </nav>
      <Link
        href="/legal/privacy-policy"
        aria-label="Privacy Policy"
        className="font-[family-name:var(--font-pixel),var(--font-mono)] text-[13px] leading-none text-[var(--fg-inverse)]/80 transition-opacity hover:opacity-100 focus-visible:focus-ring-sm"
      >
        privacy.txt
      </Link>
    </footer>
  );
};
