"use client";

import type {
  AvailabilityFilter,
  OptionFilter,
  PriceRangeFilter,
  ProductFiltersResponse,
} from "@spree/sdk";
import { SlidersHorizontal } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import type { JSX } from "react";
import { memo, useCallback, useMemo, useState } from "react";
import { AvailabilityDropdownContent } from "@/components/products/filters/AvailabilityDropdownContent";
import { FilterBarSkeleton } from "@/components/products/filters/FilterBarSkeleton";
import { FilterDropdown } from "@/components/products/filters/FilterDropdown";
import { FilterSidebar } from "@/components/products/filters/FilterSidebar";
import { MobileFilterDrawer } from "@/components/products/filters/MobileFilterDrawer";
import { OptionDropdownContent } from "@/components/products/filters/OptionDropdownContent";
import { PriceDropdownContent } from "@/components/products/filters/PriceDropdownContent";
import { SortDropdownContent } from "@/components/products/filters/SortDropdownContent";
import { getActiveFilterCount, getSortOptionLabel } from "@/lib/utils/filters";
import { generatePriceBuckets } from "@/lib/utils/price-buckets";
import type { ActiveFilters, AvailabilityStatus } from "@/types/filters";

interface FilterBarProps {
  filtersData: ProductFiltersResponse | null;
  filtersLoading: boolean;
  activeFilters: ActiveFilters;
  totalCount: number;
  onFilterChange: (filters: ActiveFilters) => void;
  /** Page title, shown alongside the product count on lg+ screens. */
  title?: React.ReactNode;
  /** Product grid, rendered alongside the sidebar on desktop. */
  children?: React.ReactNode;
}

export const FilterBar = memo(function FilterBar({
  filtersData,
  filtersLoading,
  activeFilters,
  totalCount,
  onFilterChange,
  title,
  children,
}: FilterBarProps): JSX.Element | null {
  const t = useTranslations("products");
  const locale = useLocale();
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);
  const [showMobileDrawer, setShowMobileDrawer] = useState(false);

  const toggleDropdown = useCallback((id: string) => {
    setOpenDropdownId((prev) => (prev === id ? null : id));
  }, []);

  const closeDropdown = useCallback(() => {
    setOpenDropdownId(null);
  }, []);

  const handleOptionValueToggle = useCallback(
    (optionValueId: string) => {
      const newOptionValues = activeFilters.optionValues.includes(optionValueId)
        ? activeFilters.optionValues.filter((id) => id !== optionValueId)
        : [...activeFilters.optionValues, optionValueId];
      onFilterChange({ ...activeFilters, optionValues: newOptionValues });
    },
    [activeFilters, onFilterChange],
  );

  const handlePriceChange = useCallback(
    (min?: number, max?: number) => {
      onFilterChange({ ...activeFilters, priceMin: min, priceMax: max });
    },
    [activeFilters, onFilterChange],
  );

  const handleAvailabilityChange = useCallback(
    (availability?: AvailabilityStatus) => {
      onFilterChange({ ...activeFilters, availability });
    },
    [activeFilters, onFilterChange],
  );

  const handleSortChange = useCallback(
    (sortBy: string) => {
      onFilterChange({ ...activeFilters, sortBy });
      closeDropdown();
    },
    [activeFilters, onFilterChange, closeDropdown],
  );

  const clearFilters = useCallback(() => {
    onFilterChange({
      optionValues: [],
      priceMin: undefined,
      priceMax: undefined,
      availability: undefined,
      sortBy: activeFilters.sortBy,
    });
  }, [onFilterChange, activeFilters.sortBy]);

  const priceBuckets = useMemo(() => {
    if (!filtersData) return [];
    const priceFilter = filtersData.filters.find(
      (f) => f.type === "price_range",
    ) as PriceRangeFilter | undefined;
    if (!priceFilter) return [];
    return generatePriceBuckets(
      priceFilter.min,
      priceFilter.max,
      priceFilter.currency,
      { t, locale },
    );
  }, [filtersData, t, locale]);

  const optionFilters = useMemo(() => {
    if (!filtersData) return [];
    return filtersData.filters.filter(
      (f) => f.type === "option",
    ) as OptionFilter[];
  }, [filtersData]);

  const badgeCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const filter of optionFilters) {
      counts[filter.id] = filter.options.filter((o) =>
        activeFilters.optionValues.includes(o.id),
      ).length;
    }
    return counts;
  }, [optionFilters, activeFilters.optionValues]);

  const priceBadge =
    activeFilters.priceMin !== undefined || activeFilters.priceMax !== undefined
      ? 1
      : 0;

  const availabilityBadge = activeFilters.availability ? 1 : 0;

  const totalActiveFilters = getActiveFilterCount(activeFilters);

  const hasActiveFilters = totalActiveFilters > 0;

  const activeSortBy = activeFilters.sortBy || filtersData?.default_sort;

  const activeSortLabel = filtersData
    ? getSortOptionLabel(
        filtersData.sort_options.find((o) => o.id === activeSortBy) ?? {
          id: activeSortBy ?? "",
        },
        t,
      )
    : t("sort");

  if (!filtersData) {
    if (filtersLoading) return <FilterBarSkeleton />;
    return <>{children}</>;
  }

  const availabilityFilter = filtersData.filters.find(
    (f) => f.type === "availability",
  ) as AvailabilityFilter | undefined;

  const hasPriceFilter =
    filtersData.filters.some((f) => f.type === "price_range") &&
    priceBuckets.length > 0;

  return (
    <div className="max-w-347.5 mx-auto w-full">
      {/* Desktop: title/count + sort spans the full width, above the sidebar + grid */}
      <div className="hidden lg:flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
        <div className="flex-1 text-start">
          <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
            {title}
            <p className="text-sm text-muted-foreground">
              {t("productCount", { count: totalCount })}
            </p>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-3 lg:shrink-0 lg:ms-auto justify-start">
          <FilterDropdown
            label={activeSortLabel}
            isOpen={openDropdownId === "sort-desktop"}
            onToggle={() => toggleDropdown("sort-desktop")}
            onClose={closeDropdown}
            align="right"
            triggerClassName="w-48 justify-between bg-card border-transparent font-normal"
          >
            <SortDropdownContent
              sortOptions={filtersData.sort_options}
              activeSortBy={activeSortBy}
              onSortChange={handleSortChange}
            />
          </FilterDropdown>
        </div>
      </div>

      <div className="flex gap-8 items-start">
        <FilterSidebar
          optionFilters={optionFilters}
          availabilityFilter={availabilityFilter}
          priceBuckets={priceBuckets}
          activeFilters={activeFilters}
          hasActiveFilters={hasActiveFilters}
          onOptionValueToggle={handleOptionValueToggle}
          onPriceChange={handlePriceChange}
          onAvailabilityChange={handleAvailabilityChange}
          onClearAll={clearFilters}
        />

        <div className="flex-1 min-w-0">
          {/* Tablet: the sidebar is hidden below lg, so keep the full dropdown bar here */}
          <div className="hidden md:flex lg:hidden items-center justify-between mb-6 rounded-3xl bg-card px-4 py-4 sm:px-6">
            <div className="flex items-center gap-3">
              {optionFilters.map((filter) => (
                <FilterDropdown
                  key={filter.id}
                  label={filter.label}
                  badgeCount={badgeCounts[filter.id]}
                  isOpen={openDropdownId === filter.id}
                  onToggle={() => toggleDropdown(filter.id)}
                  onClose={closeDropdown}
                >
                  <OptionDropdownContent
                    filter={filter}
                    selectedValues={activeFilters.optionValues}
                    onToggle={handleOptionValueToggle}
                  />
                </FilterDropdown>
              ))}

              {hasPriceFilter && (
                <FilterDropdown
                  label={t("price")}
                  badgeCount={priceBadge}
                  isOpen={openDropdownId === "price"}
                  onToggle={() => toggleDropdown("price")}
                  onClose={closeDropdown}
                >
                  <PriceDropdownContent
                    priceBuckets={priceBuckets}
                    activeFilters={activeFilters}
                    onPriceChange={handlePriceChange}
                  />
                </FilterDropdown>
              )}

              {availabilityFilter && (
                <FilterDropdown
                  label={t("availability")}
                  badgeCount={availabilityBadge}
                  isOpen={openDropdownId === "availability"}
                  onToggle={() => toggleDropdown("availability")}
                  onClose={closeDropdown}
                >
                  <AvailabilityDropdownContent
                    filter={availabilityFilter}
                    selected={activeFilters.availability}
                    onChange={handleAvailabilityChange}
                  />
                </FilterDropdown>
              )}
            </div>

            <div className="flex items-center gap-3">
              <span className="text-sm text-muted-foreground">
                {t("productCount", { count: totalCount })}
              </span>
              <FilterDropdown
                label={t("sort")}
                isOpen={openDropdownId === "sort-tablet"}
                onToggle={() => toggleDropdown("sort-tablet")}
                onClose={closeDropdown}
                align="right"
              >
                <SortDropdownContent
                  sortOptions={filtersData.sort_options}
                  activeSortBy={activeSortBy}
                  onSortChange={handleSortChange}
                />
              </FilterDropdown>
            </div>
          </div>

          <div className="flex items-center gap-3 mb-6 md:hidden">
            <button
              type="button"
              onClick={() => setShowMobileDrawer(true)}
              className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium border transition-colors ${
                hasActiveFilters
                  ? "border-primary/30 bg-primary/10 text-primary"
                  : "border-border text-foreground"
              }`}
            >
              <SlidersHorizontal className="w-4 h-4" />
              <span>{t("filters")}</span>
              {hasActiveFilters && (
                <span className="flex items-center justify-center w-5 h-5 text-xs bg-primary text-primary-foreground rounded-full">
                  {totalActiveFilters}
                </span>
              )}
            </button>

            <div className="ml-auto">
              <FilterDropdown
                label={t("sort")}
                isOpen={openDropdownId === "sort-mobile"}
                onToggle={() => toggleDropdown("sort-mobile")}
                onClose={closeDropdown}
                align="right"
              >
                <SortDropdownContent
                  sortOptions={filtersData.sort_options}
                  activeSortBy={activeSortBy}
                  onSortChange={handleSortChange}
                />
              </FilterDropdown>
            </div>
          </div>

          {/* {hasActiveFilters && (
          <FilterChips
            activeFilters={activeFilters}
            filtersData={filtersData}
            priceBuckets={priceBuckets}
            onRemoveOptionValue={(id) => handleOptionValueToggle(id)}
            onRemovePrice={() => handlePriceChange(undefined, undefined)}
            onRemoveAvailability={() => handleAvailabilityChange(undefined)}
            onClearAll={clearFilters}
          />
        )} */}

          {children}
        </div>

        <MobileFilterDrawer
          isOpen={showMobileDrawer}
          onClose={() => setShowMobileDrawer(false)}
          filtersData={filtersData}
          activeFilters={activeFilters}
          priceBuckets={priceBuckets}
          onApply={onFilterChange}
        />
      </div>
    </div>
  );
});
