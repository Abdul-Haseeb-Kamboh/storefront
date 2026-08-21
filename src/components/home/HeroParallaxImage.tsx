"use client";

import { gsap } from "gsap";
import Image from "next/image";
import { useEffect, useRef } from "react";

interface HeroParallaxImageProps {
  src: string;
  alt: string;
}

export function HeroParallaxImage({ src, alt }: HeroParallaxImageProps) {
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = wrapperRef.current;
    if (!el) return;

    const handleScroll = () => {
      // Subtle upward drift as the hero scrolls out of view, capped so the
      // image never reveals the wrapper's edges.
      const offset = Math.min(window.scrollY * 0.15, 60);
      gsap.to(el, {
        y: offset,
        duration: 0.6,
        ease: "power1.out",
        overwrite: "auto",
      });
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div
      ref={wrapperRef}
      data-hero-parallax="false"
      className="absolute inset-0 scale-105"
    >
      <Image
        src={src}
        alt={alt}
        fill
        priority
        sizes="(max-width: 1390px) 100vw, 1390px"
        className="object-cover object-center"
      />
    </div>
  );
}
