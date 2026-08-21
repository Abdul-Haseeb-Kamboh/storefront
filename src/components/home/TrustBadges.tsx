import { BadgeCheck, RefreshCw, ShieldCheck, Truck } from "lucide-react";
import { getTranslations } from "next-intl/server";

interface TrustBadgesProps {
  locale: string;
}

export async function TrustBadges({ locale }: TrustBadgesProps) {
  const t = await getTranslations({
    locale: locale as Locale,
    namespace: "home",
  });

  const badges = [
    {
      icon: Truck,
      title: t("trustShippingTitle"),
      description: t("trustShippingDesc"),
    },
    {
      icon: RefreshCw,
      title: t("trustReturnsTitle"),
      description: t("trustReturnsDesc"),
    },
    {
      icon: ShieldCheck,
      title: t("trustSecureTitle"),
      description: t("trustSecureDesc"),
    },
    {
      icon: BadgeCheck,
      title: t("trustQualityTitle"),
      description: t("trustQualityDesc"),
    },
  ];

  return (
    <section className="relative z-20 h-0 px-4 md:px-8">
      <div className="max-w-275 mx-auto -translate-y-1/2 rounded-2xl bg-card overflow-hidden">
        {/* Mobile: looping marquee since 4 items don't fit one row */}
        <div className="md:hidden overflow-hidden motion-reduce:overflow-x-auto">
          <div className="flex w-max animate-marquee motion-reduce:animate-none">
            {[...badges, ...badges].map((badge, i) => (
              <div
                key={`${badge.title}-${i}`}
                aria-hidden={i >= badges.length}
                className="shrink-0 border-e border-border"
              >
                <div className="flex items-center gap-2.5 px-5 py-4">
                  <badge.icon
                    className="h-5.5 w-5.5 shrink-0 text-primary sm:h-6.5 sm:w-6.5"
                    strokeWidth={1.6}
                  />
                  <div className="min-w-0">
                    <p className="text-[0.8rem] sm:text-sm font-semibold text-foreground leading-tight whitespace-nowrap">
                      {badge.title}
                    </p>
                    <p className="mt-0.5 text-[0.68rem] sm:text-xs text-muted-foreground leading-tight whitespace-nowrap">
                      {badge.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Desktop: static grid */}
        <div className="hidden md:grid md:grid-cols-4">
          {badges.map((badge) => (
            <div
              key={badge.title}
              className="flex items-center gap-3 px-5 py-5 md:px-6 border-border not-last:border-e"
            >
              <badge.icon
                className="h-5.5 w-5.5 shrink-0 text-primary sm:h-6.5 sm:w-6.5"
                strokeWidth={1.6}
              />
              <div className="min-w-0">
                <p className="text-[0.8rem] sm:text-sm font-semibold text-foreground leading-tight">
                  {badge.title}
                </p>
                <p className="mt-0.5 text-[0.68rem] sm:text-xs text-muted-foreground leading-tight">
                  {badge.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
