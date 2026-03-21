"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { FC } from "react";
import { HeaderNavLink } from "./header";

const links = [
  { href: "/blog", label: "Blog" },
  { href: "/projects", label: "Projects" },
  { href: "/about", label: "About", prefetch: false },
];

export const HeaderNavLinks: FC = () => {
  const pathname = usePathname();

  return (
    <>
      {links.map(({ href, label, prefetch }) => (
        <HeaderNavLink key={href} asChild active={pathname.startsWith(href)}>
          <Link href={href} prefetch={prefetch}>
            {label}
          </Link>
        </HeaderNavLink>
      ))}
    </>
  );
};
