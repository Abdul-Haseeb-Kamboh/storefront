import type * as React from "react";

/**
 * Skeleton placeholder for a single product card.
 * Matches the layout of `<ProductCard>` — no border, rounded image,
 * text placeholders below.
 */
export function ProductCardSkeleton(): React.JSX.Element {
  return (
    <div className="relative aspect-4/5 sm:aspect-square overflow-hidden rounded-3xl bg-card animate-pulse">
      <div className="absolute inset-2 bottom-17 sm:inset-3 sm:bottom-24 rounded-2xl bg-gray-200" />
      <div className="absolute bottom-3 inset-s-3 inset-e-14 sm:bottom-4 sm:inset-s-4 sm:inset-e-16">
        <div className="h-3 bg-gray-200 rounded w-3/4 mb-2" />
        <div className="h-4 bg-gray-200 rounded w-1/3" />
      </div>
    </div>
  );
}
