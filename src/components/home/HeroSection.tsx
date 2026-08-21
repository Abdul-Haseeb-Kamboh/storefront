import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { HeroParallaxImage } from "@/components/home/HeroParallaxImage";
import { Button } from "@/components/ui/button";

interface HeroSectionProps {
  basePath: string;
  locale: string;
}

export async function HeroSection({ basePath, locale }: HeroSectionProps) {
  const t = await getTranslations({
    locale: locale as Locale,
    namespace: "home",
  });

  return (
    <section className="relative h-[56vh] min-h-105 max-h-135 md:h-[90vh] md:min-h-0 md:max-h-150 flex items-end overflow-hidden rounded-3xl bg-white">
      <HeroParallaxImage src="/homepage-hero-light.avif" alt="" />
      <div className="absolute inset-0 bg-linear-to-t from-white/95 via-white/65 to-white/15 md:from-white/30 md:via-transparent md:to-transparent" />
      <div className="relative z-10 w-full max-w-347.5 mx-auto px-5 sm:px-6 md:px-12 pb-20 sm:pb-28 md:pb-28">
        <p className="text-[0.65rem] sm:text-xs md:text-sm tracking-[0.35em] sm:tracking-[0.5em] rtl:tracking-normal uppercase mb-4 sm:mb-5 font-light text-black/60">
          {t("heroEyebrow")}
        </p>
        <h1 className="text-5xl sm:text-7xl md:text-8xl lg:text-9xl rtl:text-4xl sm:rtl:text-6xl md:rtl:text-7xl lg:rtl:text-8xl font-extralight tracking-[-0.03em] leading-[0.85] rtl:tracking-normal rtl:leading-tight text-black">
          {t("heroTitleLine1")}
          <br />
          <span className="font-semibold italic">{t("heroTitleLine2")}</span>
        </h1>
        <p className="mt-5 sm:mt-6 md:mt-8 text-sm sm:text-base md:text-lg max-w-md rtl:max-w-lg font-light leading-relaxed text-black/60">
          {t("heroDescription")}
        </p>
        <div className="mt-7 sm:mt-8 md:mt-10 flex flex-wrap items-center gap-3 sm:gap-4">
          <Button size="lg" className="rounded-full" asChild>
            <Link href={`${basePath}/products`}>
              {t("shopNow")}
              <ArrowRight className="ms-2 h-3.5 w-3.5 rtl:-scale-x-100" />
            </Link>
          </Button>
          <Button
            variant="outline"
            size="lg"
            className="rounded-full bg-transparent"
            asChild
          >
            <Link href={`${basePath}/products?sort=newest`}>
              {t("newArrivals")}
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
