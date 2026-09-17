# Examples

## Cache Components ISR route (`/blog/[slug]`)

`src/app/blog/[slug]/page.tsx`

```ts
import type { FC } from "react";

import { Render } from "./_components/render/render";

export const generateStaticParams = async () => {
  return [{ slug: "hello-world" }];
};

const Page: FC<PageProps<"/blog/[slug]">> = ({ params }) => {
  return <Render params={params} />;
};

export default Page;
```

`src/app/blog/[slug]/_components/render/render.tsx`

```ts
import "server-only";

import { draftMode } from "next/headers";
import type { FC } from "react";

type RenderProps = Pick<PageProps<"/blog/[slug]">, "params">;

export const Render: FC<RenderProps> = async ({ params }) => {
  const { slug } = await params;
  const { isEnabled } = await draftMode();

  return (
    <article>
      <h1>{slug}</h1>
      <p>{isEnabled ? "Preview mode" : "Published mode"}</p>
    </article>
  );
};
```

## Static route `page.tsx` (`/blog`)

```ts
import type { FC } from "react";

const Page: FC<PageProps<"/blog">> = async () => {
  return <main>Blog index</main>;
};

export default Page;
```

## Dynamic route `page.tsx` (`/blog/[slug]`)

```ts
import type { FC } from "react";

import { Render } from "./_components/render/render";

export const generateStaticParams = async () => {
  return [{ slug: "hello-world" }];
};

const Page: FC<PageProps<"/blog/[slug]">> = ({ params }) => {
  return <Render params={params} />;
};

export default Page;
```

## Nested dynamic route `page.tsx` (`/blog/[category]/[slug]`)

```ts
import type { FC } from "react";

import { Render } from "./_components/render/render";

export const generateStaticParams = async () => {
  return [{ category: "ai", slug: "hello-world" }];
};

const Page: FC<PageProps<"/blog/[category]/[slug]">> = ({ params }) => {
  return <Render params={params} />;
};

export default Page;
```

## Route layout `layout.tsx` (`/blog`)

```ts
import type { FC } from "react";

const Layout: FC<LayoutProps<"/blog">> = ({ children }) => {
  return <section>{children}</section>;
};

export default Layout;
```

## Dynamic metadata pattern

```ts
import type { Metadata } from "next";

export const generateMetadata = async ({
  params,
}: PageProps<"/blog/[slug]">): Promise<Metadata> => {
  const { slug } = await params;

  return {
    title: `Blog: ${slug}`,
  };
};
```
