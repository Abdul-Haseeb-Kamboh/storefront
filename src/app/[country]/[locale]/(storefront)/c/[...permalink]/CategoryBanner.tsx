import type { Category } from "@spree/sdk";
import { cacheLife, cacheTag } from "next/cache";
import Link from "next/link";

interface CategoryBannerProps {
  category: Category;
  basePath: string;
}

export async function CategoryBanner({
  category,
  basePath,
}: CategoryBannerProps) {
  "use cache: remote";
  cacheLife("minutes");
  cacheTag("category-banner");

  return (
    <section className="relative overflow-hidden rounded-3xl bg-card mb-9">
      <div
        className="relative flex min-h-55 flex-col justify-end bg-muted bg-cover bg-center sm:min-h-70"
        style={
          category.image_url
            ? { backgroundImage: `url(${category.image_url})` }
            : undefined
        }
      >
        {category.image_url && (
          <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/30 to-transparent" />
        )}
        <div
          className={`relative flex max-w-md flex-col gap-2 p-6 sm:p-10 ${
            category.image_url ? "text-white" : "text-foreground"
          }`}
        >
          <h1 className="text-2xl font-semibold leading-tight sm:text-3xl">
            {category.name}
          </h1>
          {category.description && (
            <p
              className={`text-sm leading-relaxed ${category.image_url ? "text-white/75" : "text-muted-foreground"}`}
            >
              {category.description}
            </p>
          )}
        </div>
      </div>

      {category.children && category.children.length > 0 && (
        <div className="flex flex-wrap gap-2 border-t border-border px-4 py-3 sm:px-6">
          {category.children.map((child) => (
            <Link
              key={child.id}
              href={`${basePath}/c/${child.permalink}`}
              className="rounded-full px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              {child.name}
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}
