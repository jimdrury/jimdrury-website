import Link from "next/link";
import type { FC } from "react";
import type { IconType } from "react-icons";
import { FaGithub, FaLinkedinIn } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { Icon } from "@/components/icon";
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
        "border-t-2 border-black bg-slate-900 text-zinc-100",
        className,
      )}
      {...props}
    >
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-3 px-4 py-6 sm:px-6">
        <nav aria-label="Social links">
          <ul className="flex items-center gap-6">
            {SOCIAL_LINKS.map(({ href, label, IconComponent }) => (
              <li key={href} className="list-none">
                <a
                  href={href}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 text-xs font-semibold text-zinc-100 transition-opacity hover:opacity-80 focus-visible:focus-ring"
                >
                  <Icon size="sm">
                    <IconComponent className="size-3.5" />
                  </Icon>
                  <span>{label}</span>
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <p className="text-xs text-zinc-300">
          &copy; {currentYear} Jim Drury. All rights reserved.
        </p>
        <div className="flex items-center text-xs font-medium text-zinc-400">
          <Link
            href="/legal/privacy-policy"
            className="transition-colors hover:text-zinc-200 focus-visible:focus-ring"
          >
            Privacy Policy
          </Link>
        </div>
      </div>
    </footer>
  );
};
