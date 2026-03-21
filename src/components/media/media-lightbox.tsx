"use client";

import NextImage from "next/image";
import type { FC, MouseEventHandler, ReactNode } from "react";
import { useEffect, useState } from "react";
import { FaSearchPlus } from "react-icons/fa";
import { Modal, ModalBody, ModalHeader } from "@/components/modal";
import type { ComponentPropsWithoutChildren } from "@/lib/component-props";
import { cn } from "@/lib/utils";
import type { StoryblokImageDimensions } from "@/storyblok/image-dimensions";

export interface MediaLightboxProps
  extends ComponentPropsWithoutChildren<"button"> {
  children: ReactNode;
  src: string;
  alt: string;
  caption?: string;
  imageDimensions: StoryblokImageDimensions | null;
}

export const MediaLightbox: FC<MediaLightboxProps> = ({
  children,
  src,
  alt,
  caption,
  imageDimensions,
  className,
  onClick,
  ...props
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleOpen: MouseEventHandler<HTMLButtonElement> = (event) => {
    onClick?.(event);
    if (!event.defaultPrevented) {
      setIsOpen(true);
    }
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  return (
    <>
      <button
        type="button"
        className={cn(
          "block w-full cursor-zoom-in text-left",
          isMounted ? "relative" : undefined,
          className,
        )}
        aria-haspopup="dialog"
        aria-label={`Open image in lightbox: ${alt}`}
        onClick={handleOpen}
        {...props}
      >
        {children}
        {isMounted ? (
          <span
            aria-hidden
            className="pointer-events-none absolute right-3 top-3 inline-flex items-center gap-1.5 rounded-md border-2 border-black bg-yellow-300 px-2 py-1 text-[10px] font-black uppercase tracking-wide text-black shadow-[2px_2px_0_0]"
          >
            <FaSearchPlus className="size-3" />
            <span>Zoom</span>
          </span>
        ) : null}
      </button>
      <Modal open={isOpen} onClose={handleClose} className="max-w-6xl">
        <ModalHeader onClose={handleClose}>Image Preview</ModalHeader>
        <ModalBody className="bg-black p-3 sm:p-4">
          {imageDimensions ? (
            <NextImage
              src={src}
              alt={alt}
              width={imageDimensions.width}
              height={imageDimensions.height}
              sizes="90vw"
              className="mx-auto h-auto max-h-[80dvh] w-auto max-w-full object-contain"
            />
          ) : (
            // biome-ignore lint/performance/noImgElement: fallback when intrinsic size is unknown
            <img
              src={src}
              alt={alt}
              className="mx-auto max-h-[80dvh] w-auto max-w-full object-contain"
            />
          )}
          {caption ? (
            <p className="mt-3 text-center text-sm font-medium text-white">
              {caption}
            </p>
          ) : null}
        </ModalBody>
      </Modal>
    </>
  );
};
