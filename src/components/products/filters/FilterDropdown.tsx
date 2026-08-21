"use client";

import { ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

interface FilterDropdownProps {
  label: string;
  badgeCount?: number;
  isOpen: boolean;
  onToggle: () => void;
  onClose: () => void;
  children: React.ReactNode;
  align?: "left" | "right";
  triggerClassName?: string;
}

export function FilterDropdown({
  label,
  badgeCount,
  isOpen,
  onToggle,
  onClose,
  children,
  align = "left",
  triggerClassName,
}: FilterDropdownProps) {
  const hasActive = badgeCount !== undefined && badgeCount > 0;

  return (
    <DropdownMenu
      open={isOpen}
      onOpenChange={(open) => {
        if (open) onToggle();
        else onClose();
      }}
    >
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          aria-expanded={isOpen}
          aria-haspopup="menu"
          size="sm"
          className={cn("rounded-full", triggerClassName)}
        >
          <span>{label}</span>
          {hasActive && (
            <span className="flex items-center justify-center w-5 h-5 text-xs bg-primary text-primary-foreground rounded-full">
              {badgeCount}
            </span>
          )}
          <ChevronDown
            className={`w-4 h-4 transition-transform ${isOpen ? "rotate-180" : ""}`}
          />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align={align === "right" ? "end" : "start"}>
        {children}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
