import type { Category } from "@spree/sdk";
import { ChevronRight, Home } from "lucide-react";
import Link from "next/link";
import { getTranslations } from "next-intl/server";

interface BreadcrumbsProps {
  category: Category;
  basePath: string;
  productName?: string;
  locale: string;
}

export async function Breadcrumbs({
  category,
  basePath,
  productName,
  locale,
}: BreadcrumbsProps) {
  const t = await getTranslations({
    locale: locale as Locale,
    namespace: "navigation",
  });
  // Build breadcrumb items from ancestors + current category
  const items = [{ name: t("home"), href: basePath }];

  // Add ancestors (they come from the API in order from root to parent)
  if (category.ancestors && category.ancestors.length > 0) {
    category.ancestors.forEach((ancestor) => {
      items.push({
        name: ancestor.name,
        href: `${basePath}/c/${ancestor.permalink}`,
      });
    });
  }

  // On PDP, the category is a link and the product name is the last item.
  // On category pages, the category itself is the last (non-clickable) item.
  if (productName) {
    items.push({
      name: category.name,
      href: `${basePath}/c/${category.permalink}`,
    });
    items.push({ name: productName, href: "" });
  } else {
    items.push({ name: category.name, href: "" });
  }

  return (
    <nav aria-label={t("breadcrumb")} className="mb-4 px-1">
      <ol className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          const isFirst = index === 0;

          return (
            <li key={index} className="flex items-center">
              {index > 0 && (
                <ChevronRight className="w-4 h-4 text-muted-foreground/60 me-2 rtl:rotate-180" />
              )}
              {isLast ? (
                <span
                  className="font-medium text-foreground"
                  aria-current="page"
                >
                  {item.name}
                </span>
              ) : (
                <Link
                  href={item.href}
                  className="flex items-center text-muted-foreground transition-colors hover:text-foreground"
                >
                  {isFirst ? (
                    <>
                      <Home className="h-4 w-4" />
                      <span className="sr-only">{item.name}</span>
                    </>
                  ) : (
                    item.name
                  )}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
