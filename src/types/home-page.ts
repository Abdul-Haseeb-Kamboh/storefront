/** The 8 admin-managed storefront homepage content zones. */
import type { Product } from "@spree/sdk";

export type HomePageSectionType =
  | "three_quiet_obsessions"
  | "editorial_split"
  | "categories_grid"
  | "newly_dropped_collections"
  | "best_sellers"
  | "spotlight_gallery"
  | "lux_difference"
  | "editorial_slider";

/** Minimal taxon shape returned when a home page item expands `taxon`. */
export interface HomePageItemTaxon {
  id: string;
  name: string;
  permalink: string;
  image_url: string | null;
  square_image_url: string | null;
}

/** Minimal variant shape returned when a home page item expands `variant`. */
export interface HomePageItemVariant {
  id: string;
  product_id: string;
  sku: string | null;
  thumbnail_url: string | null;
  purchasable: boolean;
  in_stock: boolean;
  price: {
    display_amount: string;
    display_compare_at_amount: string;
    amount: string;
    currency: string;
  } | null;
}

export interface HomePageItem {
  id: string;
  title: string | null;
  subtitle: string | null;
  description: string | null;
  cta_text: string | null;
  cta_url: string | null;
  icon: string | null;
  position: number;
  image_url: string | null;
  taxon_id: string | null;
  variant_id: string | null;
  product_id: string | null;
  taxon: HomePageItemTaxon | null;
  variant: HomePageItemVariant | null;
  product: Product | null;
}

export interface HomePageSection {
  id: string;
  section_type: HomePageSectionType;
  name: string;
  eyebrow: string | null;
  heading: string | null;
  subheading: string | null;
  cta_text: string | null;
  cta_url: string | null;
  position: number;
  items: HomePageItem[];
}

export interface HomePageResponse {
  data: HomePageSection[];
}
