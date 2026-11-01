"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { X, ChevronLeft, ChevronRight, Expand } from "lucide-react";

interface LightboxProps {
  images: string[];
  alt: string;
}

/** Full-screen image lightbox with keyboard navigation. */
export function Lightbox({ images, alt }: LightboxProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const close = useCallback(() => setOpenIndex(null), []);
  const step = useCallback(
    (direction: 1 | -1) => {
      setOpenIndex((current) => {
        if (current === null) return current;
        return (current + direction + images.length) % images.length;
      });
    },
    [images.length]
  );

  useEffect(() => {
    if (openIndex === null) return;
    document.documentElement.style.overflow = "hidden";

    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") close();
      if (event.key === "ArrowRight") step(1);
      if (event.key === "ArrowLeft") step(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      document.documentElement.style.overflow = "";
    };
  }, [openIndex, close, step]);

  return (
    <>
      {/* Thumbnails */}
      <div className="grid grid-cols-2 gap-4">
        {images.map((image, index) => (
          <button
            key={image}
            type="button"
            onClick={() => setOpenIndex(index)}
            className="group relative aspect-[16/10] overflow-hidden rounded-2xl border border-border/10"
            aria-label={`Open image ${index + 1} of ${images.length}`}
          >
            <Image
              src={image}
              alt={`${alt} — image ${index + 1}`}
              fill
              sizes="(max-width: 768px) 50vw, 30rem"
              className="object-cover transition-transform duration-700 ease-out-expo group-hover:scale-105"
            />
            <span className="absolute inset-0 flex items-center justify-center bg-background/0 opacity-0 backdrop-blur-[2px] transition-all duration-300 group-hover:bg-background/30 group-hover:opacity-100">
              <Expand className="h-6 w-6 text-white" aria-hidden />
            </span>
          </button>
        ))}
      </div>

      {/* Overlay */}
      <AnimatePresence>
        {openIndex !== null ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[96] flex items-center justify-center bg-background/90 p-6 backdrop-blur-xl"
            onClick={close}
            role="dialog"
            aria-modal="true"
            aria-label="Image lightbox"
          >
            <motion.div
              key={openIndex}
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="relative w-full max-w-5xl"
              onClick={(event) => event.stopPropagation()}
            >
              <div className="relative aspect-[16/10] overflow-hidden rounded-3xl border border-border/15">
                <Image
                  src={images[openIndex]}
                  alt={`${alt} — image ${openIndex + 1}`}
                  fill
                  sizes="90vw"
                  className="object-cover"
                  priority
                />
              </div>

              <button
                type="button"
                onClick={close}
                aria-label="Close lightbox"
                className="absolute -top-12 right-0 flex h-10 w-10 items-center justify-center rounded-full border border-border/15 bg-surface/80 text-foreground backdrop-blur-md transition-colors hover:border-accent/50"
              >
                <X className="h-5 w-5" aria-hidden />
              </button>

              {images.length > 1 ? (
                <>
                  <button
                    type="button"
                    onClick={() => step(-1)}
                    aria-label="Previous image"
                    className="absolute left-3 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-border/15 bg-surface/80 backdrop-blur-md transition-colors hover:border-accent/50"
                  >
                    <ChevronLeft className="h-5 w-5" aria-hidden />
                  </button>
                  <button
                    type="button"
                    onClick={() => step(1)}
                    aria-label="Next image"
                    className="absolute right-3 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-border/15 bg-surface/80 backdrop-blur-md transition-colors hover:border-accent/50"
                  >
                    <ChevronRight className="h-5 w-5" aria-hidden />
                  </button>
                  <p className="mt-4 text-center text-xs text-muted">
                    {openIndex + 1} / {images.length}
                  </p>
                </>
              ) : null}
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
}
