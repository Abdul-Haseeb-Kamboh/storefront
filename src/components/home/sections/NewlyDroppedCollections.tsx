import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { ProductCard } from "@/components/products/ProductCard";
import { Button } from "@/components/ui/button";
import { Eyebrow, resolveHref, SplitHeading } from "./SectionHeader";
import type { SectionProps } from "./types";

/** Grid of curated product cards with a centered header and a "see more"
 * button. Admins pick the products per item (falls back to nothing if an item
 * has no product reference). */
export function NewlyDroppedCollections({ section, basePath }: SectionProps) {
  const productItems = section.items.filter((item) => item.product);
  if (productItems.length === 0) return null;

  return (
    <section className="py-16 sm:py-20">
      {/* Centered header */}
      {(section.eyebrow || section.heading || section.subheading) && (
        <div className="mx-auto mb-10 max-w-2xl text-center sm:mb-12">
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
            <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
              {section.subheading}
            </p>
          )}
        </div>
      )}

      <div className="grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-3">
        {productItems.map((item) => (
          <ProductCard
            key={item.id}
            product={item.product!}
            basePath={basePath}
          />
        ))}
      </div>

      {section.cta_text && section.cta_url && (
        <div className="mt-10 flex justify-center sm:mt-12">
          <Button variant="outline" size="lg" className="rounded-full" asChild>
            <Link href={resolveHref(basePath, section.cta_url)}>
              {section.cta_text}
              <ArrowRight className="ms-2 h-3.5 w-3.5 rtl:-scale-x-100" />
            </Link>
          </Button>
        </div>
      )}
    </section>
  );
}
