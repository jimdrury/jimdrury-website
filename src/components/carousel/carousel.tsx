"use client";

import type { FC, ReactNode } from "react";
import { useState } from "react";
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
        "rounded-md border-2 border-black bg-lime-200 p-4 shadow-[6px_6px_0_0] sm:p-6",
        className,
      )}
      {...props}
    >
      <header className="mb-4 flex flex-wrap items-end justify-between gap-3">
        <h2 className="text-balance font-mono text-lg font-black uppercase tracking-wide sm:text-xl">
          {title}
        </h2>
        <p className="rounded-md border-2 border-black bg-yellow-300 px-2 py-1 font-mono text-xs font-bold uppercase tracking-wide">
          Slide {activeIndex + 1} / {totalSlides}
        </p>
      </header>

      <div className="overflow-hidden rounded-md border-2 border-black bg-white shadow-[4px_4px_0_0]">
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
              className="cursor-pointer rounded-md border-2 border-black bg-blue-300 px-4 py-2 font-mono text-xs font-bold uppercase tracking-wide shadow-[4px_4px_0_0] transition-transform hover:-translate-y-0.5"
              aria-label="Show previous slide"
            >
              Prev
            </button>
            <button
              type="button"
              onClick={goToNext}
              className="cursor-pointer rounded-md border-2 border-black bg-pink-300 px-4 py-2 font-mono text-xs font-bold uppercase tracking-wide shadow-[4px_4px_0_0] transition-transform hover:-translate-y-0.5"
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
                    "size-4 cursor-pointer rounded-sm border-2 border-black transition-transform hover:-translate-y-0.5",
                    isActive ? "bg-black" : "bg-white",
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
