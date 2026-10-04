"use client";

import type { FC, ReactNode } from "react";
import { useState } from "react";
import { RuleMarks } from "@/components/rule-box";
import type { ComponentPropsWithoutChildren } from "@/lib/component-props";
import { cn } from "@/lib/utils";

export type CarouselSlide = {
  id: string;
  content: ReactNode;
};

export interface CarouselProps
  extends ComponentPropsWithoutChildren<"section"> {
  title: string;
  slides: CarouselSlide[];
}

export const Carousel: FC<CarouselProps> = ({
  title,
  slides,
  className,
  ...props
}) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const totalSlides = slides.length;

  if (totalSlides === 0) {
    return null;
  }

  const goToPrevious = () => {
    setActiveIndex((current) => {
      if (current === 0) {
        return totalSlides - 1;
      }

      return current - 1;
    });
  };

  const goToNext = () => {
    setActiveIndex((current) => {
      if (current === totalSlides - 1) {
        return 0;
      }

      return current + 1;
    });
  };

  const showControls = totalSlides > 1;

  return (
    <section
      className={cn(
        "rule-box relative overflow-visible bg-[var(--bg-primary)] p-4 sm:p-6",
        className,
      )}
      {...props}
    >
      <RuleMarks />
      <header className="mb-4 flex flex-wrap items-end justify-between gap-3">
        <h2 className="text-balance font-[family-name:var(--font-geist-sans)] text-lg font-medium tracking-[-0.03em] sm:text-xl">
          {title}
        </h2>
        <p className="rounded-none border border-[var(--color-border)] bg-[var(--bg-secondary)] px-2 py-1 font-[family-name:var(--font-mono)] text-[11px] font-medium tracking-[0.06em]">
          Slide {activeIndex + 1} / {totalSlides}
        </p>
      </header>

      <div className="overflow-hidden rounded-none border border-[var(--color-border)] bg-[var(--bg-primary)]">
        <div
          className="flex transition-transform duration-300 ease-out"
          style={{ transform: `translateX(-${activeIndex * 100}%)` }}
        >
          {slides.map((slide) => (
            <div className="min-w-full p-4 sm:p-6" key={slide.id}>
              {slide.content}
            </div>
          ))}
        </div>
      </div>

      {showControls ? (
        <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={goToPrevious}
              className="cursor-pointer rounded-none border border-[var(--color-border)] bg-[var(--bg-primary)] px-4 py-2 font-[family-name:var(--font-mono)] text-[11px] font-medium tracking-[0.06em] transition-colors hover:bg-[var(--bg-secondary)]"
              aria-label="Show previous slide"
            >
              Prev
            </button>
            <button
              type="button"
              onClick={goToNext}
              className="cursor-pointer rounded-none border border-transparent bg-[var(--bg-accent-pink)] px-4 py-2 font-[family-name:var(--font-mono)] text-[11px] font-medium tracking-[0.06em] text-[var(--fg-on-accent)] transition-colors hover:bg-[var(--bg-accent-magenta)]"
              aria-label="Show next slide"
            >
              Next
            </button>
          </div>
          <nav
            aria-label="Carousel slide picker"
            className="flex items-center gap-2"
          >
            {slides.map((_, index) => {
              const isActive = index === activeIndex;
              return (
                <button
                  type="button"
                  key={slides[index].id}
                  onClick={() => setActiveIndex(index)}
                  className={cn(
                    "size-3 cursor-pointer rounded-none border border-[var(--color-border)] transition-colors",
                    isActive
                      ? "bg-[var(--fg-primary)]"
                      : "bg-[var(--bg-primary)]",
                  )}
                  aria-label={`Go to slide ${index + 1}`}
                  aria-current={isActive}
                />
              );
            })}
          </nav>
        </div>
      ) : null}
    </section>
  );
};
