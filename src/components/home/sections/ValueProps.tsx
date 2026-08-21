import { resolveIcon } from "./icon-map";
import { Eyebrow, SplitHeading } from "./SectionHeader";
import type { SectionProps } from "./types";

/** Icon + title + short description value props (e.g. "The Lux Difference").
 * Text-only layout — no product/image references. */
export function ValueProps({ section }: SectionProps) {
  if (section.items.length === 0) return null;

  return (
    <section className="py-16 sm:py-20">
      {(section.eyebrow || section.heading || section.subheading) && (
        <div className="mb-10 text-center sm:mb-12">
          {section.eyebrow && (
            <Eyebrow className="mb-3">{section.eyebrow}</Eyebrow>
          )}
          {section.heading && (
            <SplitHeading
              heading={section.heading}
              className="text-3xl sm:text-4xl"
            />
          )}
          {section.subheading && (
            <p className="mt-3 text-muted-foreground">{section.subheading}</p>
          )}
        </div>
      )}
      <div className="grid grid-cols-1 gap-10 sm:grid-cols-3">
        {section.items.map((item) => {
          const Icon = resolveIcon(item.icon);
          return (
            <div key={item.id} className="px-4 text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-orange-50 text-orange-700">
                <Icon className="h-5.5 w-5.5" strokeWidth={1.5} />
              </div>
              {item.title && (
                <h3 className="mt-5 font-semibold text-foreground">
                  {item.title}
                </h3>
              )}
              {item.description && (
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {item.description}
                </p>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
