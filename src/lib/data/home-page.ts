"use server";

import { cacheLife, cacheTag } from "next/cache";
import { getClient, getLocaleOptions } from "@/lib/spree";
import type { HomePageResponse, HomePageSection } from "@/types/home-page";

const HOME_PAGE_EXPAND = "items.taxon,items.variant,items.product";

async function cachedGetHomePage(options: {
  locale?: string;
  country?: string;
}) {
  "use cache: remote";
  cacheLife("tenMinutes");
  cacheTag("home_page");
  const response = await getClient().request<HomePageResponse>(
    "GET",
    `/home_page?expand=${HOME_PAGE_EXPAND}`,
    options,
  );
  return response.data;
}

/** Enabled home page sections (with their items), in display order. */
export async function getHomePageSections(): Promise<HomePageSection[]> {
  const options = await getLocaleOptions();
  return cachedGetHomePage(options);
}
