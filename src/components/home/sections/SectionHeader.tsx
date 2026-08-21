import { ArrowRight } from "lucide-react";
import Link from "next/link";

/** Prefixes a relative ("/foo") CTA url with the localized basePath so
 * admin-entered links resolve under /{country}/{locale}. Absolute URLs and
 * already-prefixed links are returned untouched. */
export function resolveHref(basePath: string, url: string): string {
  if (/^https?:\/\//.test(url)) return url;
  if (!url.startsWith("/")) return url;
  if (basePath && url.startsWith(`${basePath}/`)) return url;
  return `${basePath}${url}`;
}

/** Renders a heading with its last word emphasised (bold), matching the
 * light/bold split used across the storefront (see HeroSection). */
export function SplitHeading({
  heading,
  className,
}: {
  heading: string;
  className?: string;
}) {
  const words = heading.trim().split(/\s+/);
  const last = words.pop();
  const rest = words.join(" ");
  return (
    <h2
      className={`font-extralight tracking-[-0.02em] leading-[0.95] text-foreground ${className ?? ""}`}
    >
      {rest && <span>{rest} </span>}
      <span className="font-semibold">{last}</span>
    </h2>
  );
}

/** Small uppercase, wide-tracked accent label used above section headings. */
export function Eyebrow({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <p
      className={`text-[0.7rem] font-semibold uppercase tracking-[0.28em] text-orange-700 ${className ?? ""}`}
    >
      {children}
    </p>
  );
}

/** Section header row: eyebrow + split heading on the left, optional
 * "View All" link on the right. */
export function SectionHeader({
  eyebrow,
  heading,
  ctaText,
  ctaUrl,
  basePath = "",
  headingClassName,
}: {
  eyebrow?: string | null;
  heading?: string | null;
  ctaText?: string | null;
  ctaUrl?: string | null;
  basePath?: string;
  headingClassName?: string;
}) {
  if (!eyebrow && !heading && !(ctaText && ctaUrl)) return null;

  return (
    <div className="flex items-end justify-between gap-6 mb-8 sm:mb-10">
      <div>
        {eyebrow && <Eyebrow className="mb-3">{eyebrow}</Eyebrow>}
        {heading && (
          <SplitHeading
            heading={heading}
            className={headingClassName ?? "text-3xl sm:text-4xl md:text-5xl"}
          />
        )}
      </div>
      {ctaText && ctaUrl && (
        <Link
          href={resolveHref(basePath, ctaUrl)}
          className="group hidden shrink-0 items-center gap-1.5 pb-1 text-sm text-muted-foreground transition-colors hover:text-foreground sm:inline-flex"
        >
          {ctaText}
          <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 rtl:-scale-x-100" />
        </Link>
      )}
    </div>
  );
}
