"use client";

import { useApplicationsFilters } from "../../hooks/use-applications-filters";
import { DEFAULT_PAGE } from "@/constants";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import {
  SearchIcon,
  XCircle,
  Filter,
  Check,
  X,
} from "lucide-react";
import {
  APPLICATION_STATUSES,
  APPLICATION_STATUS_COLORS,
  APPLICATION_STATUS_LABELS,
  ApplicationStatus,
} from "../../types";

export const ApplicationsFilterBar = () => {
  const [filters, setFilters] = useApplicationsFilters();

  const isAnyFilterModified =
    !!filters.search || filters.status.length > 0 || !!filters.platform;

  const onClearFilters = () => {
    setFilters({
      search: "",
      status: [],
      platform: "",
      page: DEFAULT_PAGE,
    });
  };

  const handleStatusToggle = (statusKey: ApplicationStatus) => {
    const current = filters.status;
    const exists = current.includes(statusKey);
    const updated = exists
      ? current.filter((s) => s !== statusKey)
      : [...current, statusKey];

    setFilters({
      status: updated,
      page: DEFAULT_PAGE,
    });
  };

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 p-1">
      {/* Search & Select Controls */}
      <div className="flex flex-wrap items-center gap-2 flex-1">
        {/* Search Input */}
        <div className="relative w-full sm:w-[260px]">
          <Input
            placeholder="Cari perusahaan atau posisi..."
            value={filters.search}
            className="h-9 pl-8 pr-7 text-sm bg-background shadow-2xs"
            onChange={(e) =>
              setFilters({ search: e.target.value, page: DEFAULT_PAGE })
            }
          />
          <SearchIcon className="size-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
          {filters.search && (
            <button
              type="button"
              onClick={() => setFilters({ search: "", page: DEFAULT_PAGE })}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              <X className="size-3.5" />
            </button>
          )}
        </div>

        {/* Multi-Select Status Filter */}
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className={`h-9 gap-1.5 shadow-2xs bg-background ${
                filters.status.length > 0 ? "border-primary/50 text-primary font-medium" : ""
              }`}
            >
              <Filter className="size-3.5" />
              <span>Status</span>
              {filters.status.length > 0 && (
                <Badge
                  variant="secondary"
                  className="rounded-full px-1.5 py-0 text-[10px] font-semibold bg-primary/10 text-primary"
                >
                  {filters.status.length}
                </Badge>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent align="start" className="w-56 p-2 shadow-lg">
            <div className="space-y-1">
              <div className="flex items-center justify-between px-2 py-1 text-xs font-semibold text-muted-foreground">
                <span>Filter Status</span>
                {filters.status.length > 0 && (
                  <button
                    onClick={() => setFilters({ status: [], page: DEFAULT_PAGE })}
                    className="text-[11px] text-primary hover:underline font-normal"
                  >
                    Reset
                  </button>
                )}
              </div>
              <div className="max-h-60 overflow-y-auto space-y-0.5">
                {APPLICATION_STATUSES.map((statusKey) => {
                  const checked = filters.status.includes(statusKey);
                  const color = APPLICATION_STATUS_COLORS[statusKey];
                  return (
                    <label
                      key={statusKey}
                      className="flex items-center gap-2 px-2 py-1.5 rounded-sm hover:bg-muted/70 cursor-pointer text-xs"
                    >
                      <Checkbox
                        checked={checked}
                        onCheckedChange={() => handleStatusToggle(statusKey)}
                      />
                      <span
                        className={`size-2 rounded-full shrink-0 ${color.bg.split(" ")[0]}`}
                      />
                      <span className={`flex-1 ${checked ? "font-medium text-foreground" : "text-muted-foreground"}`}>
                        {APPLICATION_STATUS_LABELS[statusKey]}
                      </span>
                      {checked && <Check className="size-3.5 text-primary" />}
                    </label>
                  );
                })}
              </div>
            </div>
          </PopoverContent>
        </Popover>

        {/* Platform Input Filter */}
        <div className="relative w-full sm:w-[180px]">
          <Input
            placeholder="Filter platform..."
            value={filters.platform}
            className="h-9 pr-7 text-sm bg-background shadow-2xs"
            onChange={(e) =>
              setFilters({ platform: e.target.value, page: DEFAULT_PAGE })
            }
          />
          {filters.platform && (
            <button
              type="button"
              onClick={() => setFilters({ platform: "", page: DEFAULT_PAGE })}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              <X className="size-3.5" />
            </button>
          )}
        </div>

        {/* Reset Filter Button */}
        {isAnyFilterModified && (
          <Button
            onClick={onClearFilters}
            variant="ghost"
            size="sm"
            className="h-9 text-xs text-muted-foreground hover:text-foreground"
          >
            <XCircle className="size-3.5 mr-1" />
            Reset
          </Button>
        )}
      </div>
    </div>
  );
};
