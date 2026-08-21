import type { LucideIcon } from "lucide-react";
import {
  Hammer,
  Infinity as InfinityIcon,
  Leaf,
  Package,
  Sparkles,
  Truck,
  Wrench,
} from "lucide-react";

/** Maps free-text `icon` values set by admins (e.g. "leaf", "truck") to a Lucide icon. */
const ICON_MAP: Record<string, LucideIcon> = {
  leaf: Leaf,
  hammer: Hammer,
  infinity: InfinityIcon,
  truck: Truck,
  tool: Wrench,
  wrench: Wrench,
  package: Package,
};

export function resolveIcon(icon: string | null | undefined): LucideIcon {
  if (!icon) return Sparkles;
  return ICON_MAP[icon.toLowerCase()] ?? Sparkles;
}
