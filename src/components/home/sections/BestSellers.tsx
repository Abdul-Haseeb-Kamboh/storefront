import { ProductCard } from "@/components/products/ProductCard";
import type { SectionProps } from "./types";

/** Manually curated product picks (admin selects specific variants). Renders
 * the shared ProductCard so cards match the other homepage product sections. */
export function BestSellers({ section, basePath }: SectionProps) {
  const productItems = section.items.filter((item) => item.product);
  if (productItems.length === 0) return null;

  return (
    <section className="container mx-auto py-16">
      {section.heading && (
        <h2 className="text-2xl font-bold text-gray-900 mb-8">
          {section.heading}
        </h2>
      )}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
        {productItems.map((item) => (
          <ProductCard
            key={item.id}
            product={item.product!}
            basePath={basePath}
          />
        ))}
      </div>
    </section>
  );
}
