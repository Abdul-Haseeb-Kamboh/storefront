import type { ComponentType } from "react";
import type { HomePageSection, HomePageSectionType } from "@/types/home-page";
import { BestSellers } from "./BestSellers";
import { CategoriesGrid } from "./CategoriesGrid";
import { EditorialSlider } from "./EditorialSlider";
import { EditorialSplit } from "./EditorialSplit";
import { NewlyDroppedCollections } from "./NewlyDroppedCollections";
import { SpotlightGallery } from "./SpotlightGallery";
import { ThreeQuietObsessions } from "./ThreeQuietObsessions";
import type { SectionProps } from "./types";
import { ValueProps } from "./ValueProps";

/** Maps each admin-managed section_type to the component that renders it.
 * `categories_grid` renders taxon cards; `newly_dropped_collections` renders a
 * curated product grid; `lux_difference` uses the icon/title/description
 * value-prop layout. */
const SECTION_COMPONENTS: Record<
  HomePageSectionType,
  ComponentType<SectionProps>
> = {
  three_quiet_obsessions: ThreeQuietObsessions,
  editorial_split: EditorialSplit,
  categories_grid: CategoriesGrid,
  newly_dropped_collections: NewlyDroppedCollections,
  best_sellers: BestSellers,
  spotlight_gallery: SpotlightGallery,
  lux_difference: ValueProps,
  editorial_slider: EditorialSlider,
};

interface HomePageSectionsProps {
  sections: HomePageSection[];
  basePath: string;
}

/** Renders the enabled, ordered home page sections returned by the Store API. */
export function HomePageSections({
  sections,
  basePath,
}: HomePageSectionsProps) {
  return (
    <>
      {sections.map((section) => {
        const Component = SECTION_COMPONENTS[section.section_type];
        if (!Component) return null;
        return (
          <Component key={section.id} section={section} basePath={basePath} />
        );
      })}
    </>
  );
}
