import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ProductImage } from "@/components/ui/product-image";
import type { SectionProps } from "./types";

/** Horizontally scrollable slides — image + heading/subtitle + CTA. */
export function EditorialSlider({ section }: SectionProps) {
  if (section.items.length === 0) return null;

  return (
    <section className="container mx-auto py-16">
      {section.heading && (
        <h2 className="text-2xl font-bold text-gray-900 mb-8">
          {section.heading}
        </h2>
      )}
      <div className="flex gap-4 overflow-x-auto snap-x snap-mandatory pb-2 -mx-4 px-4">
        {section.items.map((item) => (
          <div
            key={item.id}
            className="relative shrink-0 w-72 sm:w-96 aspect-3/4 rounded-2xl overflow-hidden bg-gray-100 snap-start"
          >
            <ProductImage
              src={item.image_url}
              alt={item.title ?? ""}
              fill
              className="object-cover"
            />
            <div className="absolute inset-x-0 bottom-0 bg-linear-to-t from-black/70 via-black/20 to-transparent p-6">
              {item.title && (
                <h3 className="text-white text-lg font-semibold">
                  {item.title}
                </h3>
              )}
              {item.subtitle && (
                <p className="text-white/80 text-sm mt-1">{item.subtitle}</p>
              )}
              {item.cta_text && item.cta_url && (
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-4 rounded-full bg-transparent border-white text-white hover:bg-white hover:text-gray-900"
                  asChild
                >
                  <Link href={item.cta_url}>{item.cta_text}</Link>
                </Button>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
