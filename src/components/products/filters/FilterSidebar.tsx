"use client";

import type { AvailabilityFilter, OptionFilter } from "@spree/sdk";
import { RotateCcw } from "lucide-react";
import { useTranslations } from "next-intl";
import { getAvailabilityLabel } from "@/lib/utils/filters";
import type { PriceBucket } from "@/lib/utils/price-buckets";
import { findMatchingBucket } from "@/lib/utils/price-buckets";
import type { ActiveFilters, AvailabilityStatus } from "@/types/filters";

interface FilterSidebarProps {
  optionFilters: OptionFilter[];
  availabilityFilter?: AvailabilityFilter;
  priceBuckets: PriceBucket[];
  activeFilters: ActiveFilters;
  hasActiveFilters: boolean;
  onOptionValueToggle: (optionValueId: string) => void;
  onPriceChange: (min?: number, max?: number) => void;
  onAvailabilityChange: (availability?: AvailabilityStatus) => void;
  onClearAll: () => void;
}

function SidebarPillButton({
  label,
  count,
  selected,
  onClick,
}: {
  label: string;
  count?: number;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex w-full items-center gap-3 rounded-full py-1.5 px-3 text-start text-sm transition-colors ${
        selected
          ? "bg-primary/10 text-foreground font-medium"
          : "text-muted-foreground hover:bg-muted hover:text-foreground"
      }`}
    >
      <span className="flex-1 truncate">{label}</span>
      {count != null && (
        <span className="text-xs text-muted-foreground">({count})</span>
      )}
    </button>
  );
}

export function FilterSidebar({
  optionFilters,
  availabilityFilter,
  priceBuckets,
  activeFilters,
  hasActiveFilters,
  onOptionValueToggle,
  onPriceChange,
  onAvailabilityChange,
  onClearAll,
}: FilterSidebarProps) {
  const t = useTranslations("products");

  if (
    optionFilters.length === 0 &&
    priceBuckets.length === 0 &&
    !availabilityFilter
  ) {
    return null;
  }

  const selectedBucket = findMatchingBucket(
    priceBuckets,
    activeFilters.priceMin,
    activeFilters.priceMax,
  );

  return (
    <aside className="hidden lg:block w-72 shrink-0 self-start rounded-3xl bg-card p-6">
      <div className="space-y-8">
        <div className="flex min-h-8 items-center justify-between gap-3">
          <h3 className="text-sm font-semibold text-foreground">
            {t("filters")}
          </h3>
          {hasActiveFilters && (
            <button
              type="button"
              onClick={onClearAll}
              className="inline-flex h-8 items-center rounded-full px-2 text-xs font-medium text-primary transition-colors hover:bg-primary/10"
            >
              <RotateCcw className="me-2 h-3.5 w-3.5" />
              {t("resetFilters")}
            </button>
          )}
        </div>

        {optionFilters.map((filter) => (
          <div key={filter.id} className="space-y-3">
            <h4 className="text-xs font-semibold tracking-widest uppercase text-foreground">
              {filter.label}
            </h4>
            <div className="space-y-1">
              {filter.options.map((option) => (
                <SidebarPillButton
                  key={option.id}
                  label={option.label}
                  count={option.count}
                  selected={activeFilters.optionValues.includes(option.id)}
                  onClick={() => onOptionValueToggle(option.id)}
                />
              ))}
            </div>
          </div>
        ))}

        {priceBuckets.length > 0 && (
          <div className="space-y-3">
            <h4 className="text-xs font-semibold tracking-widest uppercase text-foreground">
              {t("price")}
            </h4>
            <div className="space-y-1">
              {priceBuckets.map((bucket) => {
                const isSelected = selectedBucket?.id === bucket.id;
                return (
                  <SidebarPillButton
                    key={bucket.id}
                    label={bucket.label}
                    selected={isSelected}
                    onClick={() =>
                      isSelected
                        ? onPriceChange(undefined, undefined)
                        : onPriceChange(bucket.min, bucket.max)
                    }
                  />
                );
              })}
            </div>
          </div>
        )}

        {availabilityFilter && (
          <div className="space-y-3">
            <h4 className="text-xs font-semibold tracking-widest uppercase text-foreground">
              {t("availability")}
            </h4>
            <div className="space-y-1">
              {availabilityFilter.options.map((option) => {
                const isSelected = activeFilters.availability === option.id;
                return (
                  <SidebarPillButton
                    key={option.id}
                    label={getAvailabilityLabel(option.id, t)}
                    count={option.count}
                    selected={isSelected}
                    onClick={() =>
                      onAvailabilityChange(
                        isSelected
                          ? undefined
                          : (option.id as AvailabilityStatus),
                      )
                    }
                  />
                );
              })}
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}
