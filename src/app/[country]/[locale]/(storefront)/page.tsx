import type { Metadata } from "next";
import { FeaturedProductsSection } from "@/components/home/FeaturedProductsSection";
import { HeroSection } from "@/components/home/HeroSection";
import { HomePageSections } from "@/components/home/sections";
import { TrustBadges } from "@/components/home/TrustBadges";
import { WholesaleSection } from "@/components/home/WholesaleSection";
import { getHomePageSections } from "@/lib/data/home-page";
import { resolveCurrency } from "@/lib/data/markets";
import { generateHomeMetadata } from "@/lib/metadata/home";

interface HomePageProps {
  params: Promise<{
    country: string;
    locale: string;
  }>;
}

export async function generateMetadata({
  params,
}: HomePageProps): Promise<Metadata> {
  const { country, locale } = await params;
  return generateHomeMetadata({ country, locale });
}

export default async function HomePage({ params }: HomePageProps) {
  const { country, locale } = await params;
  const basePath = `/${country}/${locale}`;
  const currency = await resolveCurrency(country);
  const homePageSections = await getHomePageSections();

  return (
    <div className="relative container max-w-347.5 mx-auto z-0 px-0 md:px-0 my-5">
      <HeroSection basePath={basePath} locale={locale} />
      <TrustBadges locale={locale} />
      <HomePageSections sections={homePageSections} basePath={basePath} />
      <FeaturedProductsSection
        basePath={basePath}
        locale={locale}
        country={country}
        currency={currency}
      />
      <WholesaleSection basePath={basePath} locale={locale} />
    </div>
  );
}
