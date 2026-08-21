import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { ProductImage } from "@/components/ui/product-image";
import type { HomePageItem } from "@/types/home-page";
import { resolveHref, SectionHeader } from "./SectionHeader";
import type { SectionProps } from "./types";

const ROMAN = ["I", "II", "III", "IV", "V", "VI"];

function itemImage(item: HomePageItem): string | null {
  return item.image_url ?? item.product?.thumbnail_url ?? null;
}

function itemHref(item: HomePageItem, basePath: string): string | undefined {
  if (item.cta_url) return resolveHref(basePath, item.cta_url);
  if (item.product?.slug) return `${basePath}/products/${item.product.slug}`;
  return undefined;
}

function EditCard({
  item,
  index,
  basePath,
}: {
  item: HomePageItem;
  index: number;
  basePath: string;
}) {
  const href = itemHref(item, basePath);
  const image = itemImage(item);
  const productName = item.product?.name ?? null;
  const numeral = ROMAN[index] ?? `${index + 1}`;
  const wrapperClassName =
    "group transition-[flex-grow] duration-500 ease-out md:min-w-0 md:flex-1 md:hover:grow-[2.4]";

  const body = (
    <div className="relative flex h-full min-h-96 flex-col overflow-hidden rounded-3xl bg-card p-6 sm:p-8 md:min-h-0">
      {/* Roman numeral */}
      <span className="pointer-events-none absolute end-6 top-6 font-serif text-4xl italic text-orange-200 sm:text-5xl">
        {numeral}
      </span>

      {/* Image */}
      <div className="relative flex-1">
        <ProductImage
          src={image}
          alt={item.title ?? productName ?? ""}
          fill
          className="object-contain p-2"
          sizes="(max-width: 768px) 100vw, 40vw"
        />
      </div>

      {/* Caption */}
      <div className="mt-4 shrink-0">
        <p className="text-[0.65rem] font-medium uppercase tracking-[0.2em] text-muted-foreground">
          Edit {numeral}
        </p>
        <h3 className="mt-1 text-2xl font-semibold text-foreground sm:text-3xl">
          {item.title}
        </h3>

        {/* Reveal-on-hover: description + shown-here + shop */}
        <div className="grid grid-rows-[0fr] opacity-0 transition-all duration-500 ease-out group-hover:mt-3 group-hover:grid-rows-[1fr] group-hover:opacity-100">
          <div className="overflow-hidden">
            {item.description && (
              <p className="max-w-sm text-sm leading-relaxed text-muted-foreground">
                {item.description}
              </p>
            )}
            {(productName || href) && (
              <div className="mt-5 flex items-end justify-between gap-4 border-t border-border pt-4">
                {productName && (
                  <div className="min-w-0">
                    <p className="text-[0.6rem] font-semibold uppercase tracking-[0.2em] text-orange-700">
                      Shown here
                    </p>
                    <p className="mt-1 truncate text-sm text-foreground">
                      {productName}
                    </p>
                  </div>
                )}
                {href && (
                  <span className="inline-flex shrink-0 items-center gap-1 text-xs font-semibold uppercase tracking-[0.15em] text-foreground">
                    {item.cta_text ?? "Shop"}
                    <ArrowUpRight className="h-3.5 w-3.5" />
                  </span>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  return href ? (
    <Link href={href} className={wrapperClassName}>
      {body}
    </Link>
  ) : (
    <div className={wrapperClassName}>{body}</div>
  );
}

/** Editorial "edit" cards with roman numerals. Cards sit side-by-side; hovering
 * one expands it (pure CSS flex) to reveal the description, the referenced
 * product ("Shown here"), and a shop link. */
export function ThreeQuietObsessions({ section, basePath }: SectionProps) {
  if (section.items.length === 0) return null;

  return (
    <section className="py-16 sm:py-20">
      <SectionHeader
        eyebrow={section.eyebrow}
        heading={section.heading}
        ctaText={section.cta_text}
        ctaUrl={section.cta_url}
        basePath={basePath}
      />

      <div className="flex flex-col gap-5 md:h-137 md:flex-row">
        {section.items.map((item, index) => (
          <EditCard
            key={item.id}
            item={item}
            index={index}
            basePath={basePath}
          />
        ))}
      </div>
    </section>
  );
}
