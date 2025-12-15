"use client";

import * as React from "react";
import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface FilterOption {
  label: string;
  value: string;
}

interface SearchFilterBarProps {
  title?: string;
  placeholder?: string;
  filters: FilterOption[];
  query?: string;
  onSearchChange?: (query: string) => void;
  onFilterChange?: (activeFilters: string[]) => void;
  className?: string;
}

export function SearchFilterBar({
  title,
  placeholder = "Search...",
  filters,
  query: controlledQuery,
  onSearchChange,
  onFilterChange,
  className,
}: SearchFilterBarProps) {
  const isControlled = controlledQuery !== undefined;
  const [query, setQuery] = React.useState(controlledQuery ?? "");
  const [activeFilters, setActiveFilters] = React.useState<string[]>([]);

  React.useEffect(() => {
    if (!isControlled) return;
    setQuery(controlledQuery ?? "");
  }, [controlledQuery, isControlled]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setQuery(val);
    onSearchChange?.(val);
  };

  const toggleFilter = (value: string) => {
    const newFilters = activeFilters.includes(value)
      ? activeFilters.filter((f) => f !== value)
      : [...activeFilters, value];
    setActiveFilters(newFilters);
    onFilterChange?.(newFilters);
  };

  const clearAll = () => {
    setQuery("");
    setActiveFilters([]);
    onSearchChange?.("");
    onFilterChange?.([]);
  };

  return (
    <div
      className={cn(
        `w-full bg-card border border-border/50 rounded-2xl shadow-sm p-4
        md:p-6`,
        className,
      )}
    >
      <div
        className="flex flex-col md:flex-row gap-6 items-center justify-between"
      >
        {/* Title & Search */}
        <div className="w-full md:w-1/3 space-y-3">
          {title && (
            <h3 className="text-lg font-bold text-foreground">{title}</h3>
          )}
          <div className="relative">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4
                text-muted-foreground"
            />
            <Input
              value={isControlled ? (controlledQuery ?? "") : query}
              onChange={handleSearch}
              placeholder={placeholder}
              className="pl-9 bg-background/50"
            />
            {(isControlled ? controlledQuery : query) && (
              <button
                onClick={() => {
                  setQuery("");
                  onSearchChange?.("");
                }}
                className="absolute right-3 top-1/2 -translate-y-1/2
                  text-muted-foreground hover:text-foreground"
              >
                <X className="h-3 w-3" />
              </button>
            )}
          </div>
        </div>

        {/* Filters */}
        <div className="w-full md:w-2/3">
          <div className="flex flex-wrap gap-2 justify-center md:justify-end">
            {filters.map((filter) => {
              const isActive = activeFilters.includes(filter.value);
              return (
                <Badge
                  key={filter.value}
                  variant={isActive ? "default" : "outline"}
                  className={cn(
                    `cursor-pointer px-4 py-2 text-sm transition-all
                    hover:scale-105 select-none`,
                    isActive
                      ? "bg-primary text-primary-foreground hover:bg-primary/90"
                      : "bg-background hover:bg-muted hover:border-primary/50",
                  )}
                  onClick={() => toggleFilter(filter.value)}
                >
                  {filter.label}
                </Badge>
              );
            })}
            {(activeFilters.length > 0 || query) && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearAll}
                className="text-muted-foreground hover:text-destructive ml-2"
              >
                Clear
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
