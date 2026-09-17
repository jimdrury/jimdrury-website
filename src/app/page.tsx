import type { Metadata } from "next";
import Link from "next/link";
import type { FC } from "react";
import { Award } from "@/components/award";
import { Badge } from "@/components/badge";
import { BlogCardCompact } from "@/components/blog-card-compact";
import { Button } from "@/components/button";
import { Hero } from "@/components/hero";
import { StatusBand } from "@/components/status-band";
import { Ticker } from "@/components/ticker";
import { Typography } from "@/components/typography";
import {
  formatStoryDate,
  getBlogIndexArchive,
  getDefaultStoryCategory,
  getFeaturedImageAsset,
  getStoryDateTime,
  parseStoryblokImageDimensions,
} from "@/lib/blog";
import { getArticlesWithPath, SITE_NAME } from "@/lib/seo";

export const metadata: Metadata = {
  title: SITE_NAME,
  alternates: {
    canonical: "/",
  },
  openGraph: {
    url: "/",
  },
};

const ROLE_WORDS = [
  { id: "speaker", label: "Speaker" },
  { id: "creator", label: "Creator" },
  { id: "strategist", label: "Strategist" },
  { id: "technologist", label: "Technologist" },
];

/** Reuses the About / profile portrait asset (Storyblok image service, square crop). */
const HOME_PORTRAIT_SRC =
  "https://a.storyblok.com/f/291093583118629/1348x1348/d76f7ae056/profile-picture.jpg/m/720x720/filters:quality(80)";

const Page: FC<PageProps<"/">> = async () => {
  const { stories } = await getBlogIndexArchive({
    page: 1,
    version: "published",
  });

  const recentStories = getArticlesWithPath(stories).slice(0, 3);

  return (
    <>
      <Hero
        density="compact"
        badge={<Badge variant="primary">Start here</Badge>}
        title={
          <Typography size="7xl" asChild>
            <h1 className="text-[var(--fg-primary)]">
              JIM
              <br />
              DRURY.
            </h1>
          </Typography>
        }
        blurb={
          <>
            <p>
              Award-winning creative technologist, speaker, and digital
              strategist with over 15 years experience pushing the boundaries of
              design and technology.
            </p>
            <p>
              I believe in building bold, breaking rules, and creating
              experiences that leave a lasting impact.
            </p>
          </>
        }
        portraitSrc={HOME_PORTRAIT_SRC}
        portraitAlt="Jim Drury speaking into a microphone."
        portraitWidth={720}
        portraitHeight={720}
      />

      <Ticker
        items={ROLE_WORDS.map((word) => ({
          id: word.id,
          node: (
            <span className="font-[family-name:var(--font-anton)] text-[18px] font-bold uppercase tracking-[2px] lg:text-[24px]">
              {word.label}
            </span>
          ),
        }))}
      />

      <StatusBand badge={<Badge variant="primary">Now</Badge>}>
        <p className="font-[family-name:var(--font-inter)] text-[15px] font-medium leading-snug text-[var(--fg-secondary)] lg:text-base">
          Head of Platform Innovation at Virgin Media O2 — shipping agentic
          engineering with humans in the loop.
        </p>
      </StatusBand>

      <section className="w-full bg-[var(--bg-secondary)] py-10 lg:py-14">
        <div className="mx-auto w-full max-w-[1400px] px-5 lg:px-12">
          <Typography size="5xl" asChild>
            <h2 className="mb-6 uppercase text-[var(--fg-primary)]">
              Accolades
            </h2>
          </Typography>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <Award icon="star" title="MVP" company="Storyblok" colour="yellow">
              <p>Storyblok Most Valued Professional 2025.</p>
            </Award>
            <Award
              icon="flower"
              title="Innovation of the Year"
              company="Storyblok"
              colour="blue"
            >
              <p>Innovation of the Year 2025 — Storyblok React Native Live.</p>
            </Award>
          </div>
        </div>
      </section>

      <section className="w-full bg-[var(--bg-primary)] py-8 md:py-10">
        <div className="mx-auto w-full max-w-[1400px] px-5 lg:px-12">
          <div className="flex flex-wrap gap-4">
            <Button variant="highlight" asChild>
              <Link href="/blog">Read the blog</Link>
            </Button>
            <Button variant="secondary" asChild>
              <Link href="/about">About</Link>
            </Button>
          </div>
        </div>
      </section>

      {recentStories.length > 0 && (
        <section className="w-full bg-[var(--bg-secondary)] pt-8 pb-2 md:pt-12">
          <div className="mx-auto w-full max-w-[1400px] px-5 lg:px-12">
            <div className="mb-6 flex items-end justify-between">
              <Typography size="4xl" asChild>
                <h2 className="text-[var(--fg-primary)]">Recent Writing</h2>
              </Typography>
              <Link
                href="/blog"
                className="font-[family-name:var(--font-inter)] text-sm font-bold tracking-[0.5px] text-[var(--fg-primary)] underline underline-offset-2 hover:text-[var(--fg-secondary)]"
              >
                View all →
              </Link>
            </div>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-3 lg:gap-10">
              {recentStories.map(({ story, path }, index) => {
                const featuredImage = getFeaturedImageAsset(
                  story.content?.featured_image,
                );
                const imageSrc = featuredImage?.filename;
                const imageDimensions = parseStoryblokImageDimensions(imageSrc);

                return (
                  <BlogCardCompact
                    key={story.uuid}
                    href={path}
                    title={story.name}
                    category={getDefaultStoryCategory(story) ?? undefined}
                    excerpt={story.content?.excerpt}
                    date={formatStoryDate(story)}
                    dateTime={getStoryDateTime(story)}
                    imageSrc={imageSrc}
                    imageAlt={featuredImage?.alt || story.name}
                    imageWidth={imageDimensions?.width}
                    imageHeight={imageDimensions?.height}
                    imageLoading={index < 3 ? "eager" : "lazy"}
                    imageFetchPriority={index === 0 ? "high" : "auto"}
                  />
                );
              })}
            </div>
          </div>
        </section>
      )}
    </>
  );
};

export default Page;
