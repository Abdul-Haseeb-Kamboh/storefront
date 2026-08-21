import { ProductImage } from "@/components/ui/product-image";
import type { SectionProps } from "./types";

/** Image-forward masonry-ish grid, no product/category tie-in required. */
export function SpotlightGallery({ section }: SectionProps) {
  if (section.items.length === 0) return null;

  return (
    <section className="container mx-auto py-16">
      {section.heading && (
        <h2 className="text-2xl font-bold text-gray-900 mb-8">
          {section.heading}
        </h2>
      )}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {section.items.map((item) => (
          <div
            key={item.id}
            className="relative aspect-3/4 rounded-2xl overflow-hidden bg-gray-100"
          >
            <ProductImage
              src={item.image_url}
              alt={item.title ?? ""}
              fill
              className="object-cover"
            />
            {item.title && (
              <div className="absolute inset-x-0 bottom-0 bg-linear-to-t from-black/60 to-transparent p-4">
                <p className="text-white text-sm font-medium">{item.title}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
