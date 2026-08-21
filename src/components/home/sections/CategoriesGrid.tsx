import Link from "next/link";
import { CategoryImage } from "@/components/ui/category-image";
import { SectionHeader } from "./SectionHeader";
import type { SectionProps } from "./types";

/** Row of category cards. Backs both "Categories Grid" and "Newly Dropped
 * Collections" — both reference taxons, they just differ in curation. */
export function CategoriesGrid({ section, basePath }: SectionProps) {
  const items = section.items.filter((item) => item.taxon);
  if (items.length === 0) return null;

  return (
    <section className="py-16 sm:py-20">
      <SectionHeader
        eyebrow={section.eyebrow}
        heading={section.heading}
        ctaText={section.cta_text}
        ctaUrl={section.cta_url}
        basePath={basePath}
      />

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7">
        {items.map((item) => {
          const taxon = item.taxon!;
          return (
            <Link
              key={item.id}
              href={`${basePath}/c/${taxon.permalink}`}
              className="group"
            >
              <div className="relative aspect-square overflow-hidden rounded-2xl bg-card">
                <CategoryImage
                  src={
                    item.image_url ?? taxon.square_image_url ?? taxon.image_url
                  }
                  alt={item.title ?? taxon.name}
                  fill
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 200px"
                  className="object-contain p-3 transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <p className="mt-3 text-center text-sm font-medium text-foreground">
                {item.title ?? taxon.name}
              </p>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
