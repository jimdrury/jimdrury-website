import type { Metadata } from "next";
import Link from "next/link";
import type { FC } from "react";
import { BlogCardCompact } from "@/components/blog-card-compact";
import { Button } from "@/components/button";
import { Ticker } from "@/components/ticker";
import { Typography } from "@/components/typography";
import {
  formatStoryDate,
  getBlogIndexArchive,
  getDefaultStoryCategory,
  getStoryDateTime,
} from "@/lib/blog";
import { SITE_NAME } from "@/lib/seo";

export const metadata: Metadata = {
  title: SITE_NAME,
};

const ROLE_WORDS = [
  { id: "speaker", label: "Speaker" },
  { id: "creator", label: "Creator" },
  { id: "strategist", label: "Strategist" },
  { id: "technologist", label: "Technologist" },
];

const Page: FC = async () => {
  const { stories } = await getBlogIndexArchive({
    page: 1,
    version: "published",
  });

  const recentStories = stories.slice(0, 3);

  return (
    <>
      <section className="w-full bg-[var(--bg-primary)] py-8 md:py-12 lg:py-16">
        <div className="mx-auto w-full max-w-[1400px] px-5 lg:px-12">
          <div className="rounded-xl border-[3px] border-[var(--fg-primary)] bg-[var(--bg-primary)] p-6 shadow-[8px_8px_0_0_var(--fg-primary)] md:p-8 lg:p-12">
            <div className="max-w-[800px]">
              <Typography size="7xl" asChild>
                <h1 className="mb-6 text-balance text-[var(--fg-primary)]">
                  JIM
                  <br />
                  DRURY.
                </h1>
              </Typography>
              <div className="text-pretty font-[family-name:var(--font-inter)] text-base leading-[1.6] text-[var(--fg-secondary)] md:text-lg">
                <p className="mb-4">
                  Award-winning creative technologist, speaker, and digital
                  strategist with over 15 years experience pushing the
                  boundaries of design and technology.
                </p>
                <p>
                  I believe in building bold, breaking rules, and creating
                  experiences that leave a lasting impact.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

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

      <section className="w-full bg-[var(--bg-primary)] py-4 md:py-6">
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
        <section className="w-full bg-[var(--bg-primary)] py-8 md:py-12">
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
              {recentStories.map((story) => {
                const category = getDefaultStoryCategory(story);
                const dateTime = getStoryDateTime(story);
                const formattedDate = formatStoryDate(story);

                return (
                  <BlogCardCompact
                    key={story.uuid}
                    href={`/blog/${category}/${story.slug}`}
                    title={story.name}
                    category={category ?? undefined}
                    excerpt={story.content?.excerpt}
                    date={formattedDate}
                    dateTime={dateTime}
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
