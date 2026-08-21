"use client";

import type { Product } from "@spree/sdk";
import { IconShoppingBagPlus } from "@tabler/icons-react";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { type MouseEvent, memo, useEffect, useState } from "react";
import { HiddenPricePrompt } from "@/components/products/HiddenPricePrompt";
import { Button } from "@/components/ui/button";
import { ProductImage } from "@/components/ui/product-image";
import { WishlistButton } from "@/components/wishlist/WishlistButton";
import { useCart } from "@/contexts/CartContext";
import { trackAddToCart, trackSelectItem } from "@/lib/analytics/gtm";

interface ProductCardProps {
  product: Product;
  basePath?: string;
  categoryId?: string;
  index?: number;
  listId?: string;
  listName?: string;
  fetchPriority?: "high" | "low" | "auto";
  /** Optional currency used for analytics; omit to skip the select_item event. */
  currency?: string;
}

export const ProductCard = memo(function ProductCard({
  product,
  basePath = "",
  categoryId,
  index,
  listId,
  listName,
  fetchPriority,
  currency,
}: ProductCardProps) {
  const t = useTranslations("products");
  const { addItem } = useCart();
  const imageUrl = product.thumbnail_url || null;
  const [isAdding, setIsAdding] = useState(false);
  const [justAdded, setJustAdded] = useState(false);

  // Current display price
  const displayPrice = product.price?.display_amount;

  const currentAmountCents = product.price?.amount_in_cents;
  const originalAmountCents = product.original_price?.amount_in_cents;
  const compareAtAmountCents = product.price?.compare_at_amount_in_cents;
  const onSale =
    (currentAmountCents != null &&
      originalAmountCents != null &&
      currentAmountCents < originalAmountCents) ||
    (compareAtAmountCents != null &&
      currentAmountCents != null &&
      currentAmountCents < compareAtAmountCents);

  const strikethroughPrice = onSale
    ? ((product.original_price?.display_amount &&
      product.original_price.display_amount !== displayPrice
        ? product.original_price.display_amount
        : product.price?.display_compare_at_amount) ?? null)
    : null;

  const handleClick = () => {
    if (index != null && listId && listName && currency) {
      trackSelectItem(product, listId, listName, index, currency);
    }
  };

  useEffect(() => {
    if (!justAdded) return;
    const timeout = setTimeout(() => setJustAdded(false), 900);
    return () => clearTimeout(timeout);
  }, [justAdded]);

  const handleAddToCart = async (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    event.stopPropagation();

    const variantId = product.default_variant?.id || product.default_variant_id;
    if (!variantId || !product.purchasable || !displayPrice) return;

    setIsAdding(true);
    try {
      await addItem(variantId, 1);
      setJustAdded(true);

      if (currency) {
        trackAddToCart(product, product.default_variant || null, 1, currency);
      }
    } finally {
      setIsAdding(false);
    }
  };

  const canQuickAdd = Boolean(product.purchasable && displayPrice);

  return (
    <div className="group relative aspect-4/5 sm:aspect-square overflow-hidden rounded-3xl bg-card">
      {/* Stretched link: the whole card is clickable via this absolutely
          positioned anchor — WishlistButton/add-to-cart sit above it (z-10). */}
      <Link
        href={`${basePath}/products/${product.slug}${categoryId ? `?category_id=${categoryId}` : ""}`}
        aria-label={product.name}
        className="absolute inset-0"
        onClick={handleClick}
      >
        <span className="absolute inset-2 bottom-17 sm:inset-3 sm:bottom-24 block overflow-hidden rounded-2xl">
          <ProductImage
            src={imageUrl}
            alt={product.name}
            fill
            className="object-contain"
            sizes="(max-width: 768px) 50vw, (max-width: 1280px) 33vw, 320px"
            iconClassName="w-16 h-16"
            fetchPriority={fetchPriority}
          />
        </span>
      </Link>

      <div className="absolute top-3 inset-s-3 sm:top-5 sm:inset-s-5 flex flex-col gap-2">
        <WishlistButton
          variantId={product.default_variant_id}
          size="icon-sm"
          showLabel={false}
          className="relative z-10 h-9 w-9 rounded-full bg-muted text-foreground hover:bg-primary hover:text-primary-foreground max-sm:h-7 max-sm:w-7 [&_svg]:h-4.5 [&_svg]:w-4.5 max-sm:[&_svg]:h-3.75 max-sm:[&_svg]:w-3.75"
        />
      </div>

      <div className="pointer-events-none absolute bottom-3 inset-s-3 inset-e-14 sm:bottom-4 sm:inset-s-4 sm:inset-e-16 min-w-0">
        <p className="truncate text-xs leading-tight text-muted-foreground">
          {product.name}
        </p>
        <div className="mt-0.5 flex items-baseline gap-1.5">
          {displayPrice ? (
            <span className="text-base font-semibold text-foreground">
              {displayPrice}
            </span>
          ) : (
            // Null price: a deliberate hide inside a HiddenPricingProvider
            // (renders a sign-in prompt), otherwise renders nothing.
            <HiddenPricePrompt />
          )}
          {onSale && strikethroughPrice && (
            <span className="text-xs text-muted-foreground line-through">
              {strikethroughPrice}
            </span>
          )}
          {onSale && (
            <span className="rounded-full px-2 py-0.5 text-[10px] font-semibold tracking-wide text-white backdrop-blur-xl bg-destructive ">
              {t("sale")}
            </span>
          )}
        </div>
        {!product.purchasable && (
          <span className="text-xs text-muted-foreground">
            {t("outOfStock")}
          </span>
        )}
      </div>

      {/* Corner accent that scales in from bottom-end on hover; pure CSS so it
          can't get stuck if a scroll event fires without a mouseleave. */}
      <div
        data-card-wedge="true"
        aria-hidden="true"
        className="pointer-events-none absolute bottom-0 inset-e-0 h-24 w-24 origin-bottom-right scale-0 rounded-ss-full bg-primary transition-transform duration-300 ease-out group-hover:scale-100"
      />

      {canQuickAdd && (
        <Button
          type="button"
          variant="default"
          size="icon-sm"
          onClick={handleAddToCart}
          disabled={isAdding}
          aria-label={isAdding ? t("adding") : t("addToCart")}
          className="absolute bottom-2 inset-e-2 sm:bottom-4 sm:inset-e-4 z-10 h-8 w-8 sm:h-10 sm:w-10 bg-transparent rounded-full transition-all duration-300 hover:scale-110 active:scale-95 "
        >
          {isAdding ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <IconShoppingBagPlus
              className={`size-6 text-foreground transition-transform duration-300 group-hover:text-white ${justAdded ? "scale-125" : "scale-100"}`}
            />
          )}
        </Button>
      )}
    </div>
  );
});
