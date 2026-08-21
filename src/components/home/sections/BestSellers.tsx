import Link from "next/link";
import { ProductImage } from "@/components/ui/product-image";
import type { SectionProps } from "./types";

/** Manually curated product picks (admin selects specific variants). */
export function BestSellers({ section }: SectionProps) {
  const items = section.items.filter((item) => item.variant);
  if (items.length === 0) return null;

  return (
    <section className="container mx-auto py-16">
      {section.heading && (
        <h2 className="text-2xl font-bold text-gray-900 mb-8">
          {section.heading}
        </h2>
      )}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
        {items.map((item) => {
          const variant = item.variant!;
          const card = (
            <>
              <div className="relative aspect-square rounded-2xl overflow-hidden bg-gray-100">
                <ProductImage
                  src={item.image_url ?? variant.thumbnail_url}
                  alt={item.title ?? ""}
                  fill
                  className="object-cover transition-transform group-hover:scale-105"
                />
              </div>
              <p className="mt-3 text-sm font-medium text-gray-900">
                {item.title}
              </p>
              {variant.price && (
                <p className="text-sm text-gray-500">
                  {variant.price.display_amount}
                </p>
              )}
            </>
          );

          return item.cta_url ? (
            <Link key={item.id} href={item.cta_url} className="group">
              {card}
            </Link>
          ) : (
            <div key={item.id} className="group">
              {card}
            </div>
          );
        })}
      </div>
    </section>
  );
}
