import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { ProductCard } from "@/components/products/ProductCard";
import { ProductImage } from "@/components/ui/product-image";
import { Eyebrow, resolveHref, SplitHeading } from "./SectionHeader";
import type { SectionProps } from "./types";

/** Editorial hero image paired with a heading block and a couple of curated
 * product cards (e.g. "New Arrivals"). The first item with an image becomes the
 * hero; items that reference a product render as product cards. */
export function EditorialSplit({ section, basePath }: SectionProps) {
  const hero = section.items.find((item) => item.image_url) ?? section.items[0];
  const productItems = section.items.filter((item) => item.product);

  if (!section.heading && !hero && productItems.length === 0) return null;

  const heroImage = hero?.image_url ?? hero?.product?.thumbnail_url ?? null;

  return (
    <section className="py-16 sm:py-20">
      <div className="grid gap-6 lg:grid-cols-2 lg:gap-10">
        {/* Hero image */}
        {hero && (
          <div className="relative aspect-4/5 overflow-hidden rounded-3xl bg-card sm:aspect-square lg:aspect-auto">
            <ProductImage
              src={heroImage}
              alt={hero.title ?? section.heading ?? ""}
              fill
              className="object-contain p-6"
              sizes="(max-width: 1024px) 100vw, 45vw"
            />
            <div className="absolute inset-x-0 bottom-0 p-6 sm:p-8">
              {hero.subtitle && (
                <Eyebrow className="mb-2">{hero.subtitle}</Eyebrow>
              )}
              {hero.title && (
                <SplitHeading
                  heading={hero.title}
                  className="text-3xl sm:text-4xl"
                />
              )}
            </div>
          </div>
        )}

        {/* Content + product cards */}
        <div className="flex flex-col justify-center">
          {section.eyebrow && (
            <Eyebrow className="mb-3">{section.eyebrow}</Eyebrow>
          )}
          {section.heading && (
            <SplitHeading
              heading={section.heading}
              className="text-3xl sm:text-4xl md:text-5xl"
            />
          )}
          {section.subheading && (
            <p className="mt-4 max-w-md text-muted-foreground">
              {section.subheading}
            </p>
          )}
          {section.cta_text && section.cta_url && (
            <Link
              href={resolveHref(basePath, section.cta_url)}
              className="group mt-6 inline-flex items-center gap-1.5 text-sm font-medium text-foreground"
            >
              {section.cta_text}
              <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
          )}

          {productItems.length > 0 && (
            <div className="mt-8 grid grid-cols-2 gap-4 sm:gap-6">
              {productItems.slice(0, 2).map((item) => (
                <ProductCard
                  key={item.id}
                  product={item.product!}
                  basePath={basePath}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
