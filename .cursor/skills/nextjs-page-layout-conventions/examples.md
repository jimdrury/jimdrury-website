# Examples

## Cache Components route composition (`/blog/[slug]`)

`src/app/blog/[slug]/page.tsx`

```ts
import type { FC } from "react";
import { Suspense } from "react";

import { Render } from "./_components/render";
import { Skeleton } from "./_components/skeleton";

const BlogPostPage: FC<AppRoutes<"/blog/[slug]">> = ({ params, searchParams }) => {
  return (
    <Suspense fallback={<Skeleton />}>
      <Render params={params} searchParams={searchParams} />
    </Suspense>
  );
};

export default BlogPostPage;
```

`src/app/blog/[slug]/_components/skeleton.tsx`

```ts
import "server-only";

import type { FC } from "react";

export const Skeleton: FC = () => {
  return <div aria-busy="true">Loading post...</div>;
};
```

`src/app/blog/[slug]/_components/render.tsx`

```ts
import "server-only";

import { draftMode } from "next/headers";
import type { FC } from "react";

type RenderProps = Pick<AppRoutes<"/blog/[slug]">, "params" | "searchParams">;

export const Render: FC<RenderProps> = async ({ params, searchParams }) => {
  const { slug } = await params;
  const query = await searchParams;
  const { isEnabled } = await draftMode();

  const preview = query?.preview === "1" || isEnabled;

  return (
    <article>
      <h1>{slug}</h1>
      <p>{preview ? "Preview mode" : "Published mode"}</p>
    </article>
  );
};
```

## Static route `page.tsx` (`/blog`)

```ts
import type { FC } from "react";

const BlogPage: FC<AppRoutes<"/blog">> = async () => {
  return <main>Blog index</main>;
};

export default BlogPage;
```

## Dynamic route `page.tsx` (`/blog/[slug]`)

```ts
import type { FC } from "react";
import { Suspense } from "react";

import { Render } from "./_components/render";
import { Skeleton } from "./_components/skeleton";

const BlogPostPage: FC<AppRoutes<"/blog/[slug]">> = ({ params, searchParams }) => {
  return (
    <Suspense fallback={<Skeleton />}>
      <Render params={params} searchParams={searchParams} />
    </Suspense>
  );
};

export default BlogPostPage;
```

## Nested dynamic route `page.tsx` (`/blog/category/[category]/[slug]`)

```ts
import type { FC } from "react";
import { Suspense } from "react";

import { Render } from "./_components/render";
import { Skeleton } from "./_components/skeleton";

const CategoryPostPage: FC<AppRoutes<"/blog/category/[category]/[slug]">> = ({
  params,
  searchParams,
}) => {
  return (
    <Suspense fallback={<Skeleton />}>
      <Render params={params} searchParams={searchParams} />
    </Suspense>
  );
};

export default CategoryPostPage;
```

## Route layout `layout.tsx` (`/blog`)

```ts
import type { FC, ReactNode } from "react";

type BlogLayoutProps = AppRoutes<"/blog"> & {
  children: ReactNode;
};

const BlogLayout: FC<BlogLayoutProps> = ({ children }) => {
  return <section>{children}</section>;
};

export default BlogLayout;
```

## Dynamic metadata pattern

```ts
import type { Metadata } from "next";

export const generateMetadata = async ({
  params,
}: AppRoutes<"/blog/[slug]">): Promise<Metadata> => {
  const { slug } = await params;

  return {
    title: `Blog: ${slug}`,
  };
};
```
