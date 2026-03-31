"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { FC } from "react";
import { HeaderCta, HeaderNavLink } from "./header";

const links = [{ href: "/blog", label: "Blog" }];

export const HeaderNavLinks: FC = () => {
  const pathname = usePathname();

  return (
    <>
      {links.map(({ href, label }) => (
        <HeaderNavLink key={href} asChild active={pathname.startsWith(href)}>
          <Link href={href}>{label}</Link>
        </HeaderNavLink>
      ))}
      <HeaderCta asChild>
        <Link href="/about" prefetch={false}>
          About
        </Link>
      </HeaderCta>
    </>
  );
};
