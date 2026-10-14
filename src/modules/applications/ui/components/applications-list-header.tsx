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
  PlusIcon,
  SearchIcon,
  XCircle,
  Filter,
  Check,
} from "lucide-react";
import {
  APPLICATION_STATUSES,
  APPLICATION_STATUS_LABELS,
  ApplicationStatus,
} from "../../types";

interface ApplicationsListHeaderProps {
  onAddNew: () => void;
}

export const ApplicationsListHeader = ({
  onAddNew,
}: ApplicationsListHeaderProps) => {
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
    <div className="flex flex-col gap-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Lamaran Kerja</h1>
          <p className="text-muted-foreground text-sm">
            Pantau progress, status seleksi, dan tindak lanjut seluruh lamaran kerja Anda
          </p>
        </div>
        <Button onClick={onAddNew} className="shrink-0 self-start sm:self-auto">
          <PlusIcon className="size-4 mr-1.5" />
          Tambah Lamaran
        </Button>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-wrap items-center gap-2">
        {/* Search Input */}
        <div className="relative flex-1 min-w-[200px] max-w-sm">
          <Input
            placeholder="Cari perusahaan atau posisi..."
            value={filters.search}
            className="h-9 pl-8 pr-3"
            onChange={(e) =>
              setFilters({ search: e.target.value, page: DEFAULT_PAGE })
            }
          />
          <SearchIcon className="size-4 absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
        </div>

        {/* Multi-Select Status Filter */}
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" size="sm" className="h-9 gap-1.5">
              <Filter className="size-3.5 text-muted-foreground" />
              <span>Status</span>
              {filters.status.length > 0 && (
                <Badge
                  variant="secondary"
                  className="rounded-full px-1.5 py-0 text-[10px] font-semibold"
                >
                  {filters.status.length}
                </Badge>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent align="start" className="w-56 p-2">
            <div className="space-y-1">
              <div className="text-xs font-semibold px-2 py-1 text-muted-foreground">
                Filter Status Lamaran
              </div>
              {APPLICATION_STATUSES.map((statusKey) => {
                const checked = filters.status.includes(statusKey);
                return (
                  <label
                    key={statusKey}
                    className="flex items-center gap-2 px-2 py-1.5 rounded-sm hover:bg-muted cursor-pointer text-sm"
                  >
                    <Checkbox
                      checked={checked}
                      onCheckedChange={() => handleStatusToggle(statusKey)}
                    />
                    <span className="flex-1">
                      {APPLICATION_STATUS_LABELS[statusKey]}
                    </span>
                    {checked && <Check className="size-3.5 text-primary" />}
                  </label>
                );
              })}
              {filters.status.length > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full text-xs mt-1 h-7"
                  onClick={() => setFilters({ status: [], page: DEFAULT_PAGE })}
                >
                  Bersihkan status
                </Button>
              )}
            </div>
          </PopoverContent>
        </Popover>

        {/* Platform Input Filter */}
        <div className="w-[160px]">
          <Input
            placeholder="Filter platform..."
            value={filters.platform}
            className="h-9 text-sm"
            onChange={(e) =>
              setFilters({ platform: e.target.value, page: DEFAULT_PAGE })
            }
          />
        </div>

        {/* Reset Filters Button */}
        {isAnyFilterModified && (
          <Button
            onClick={onClearFilters}
            variant="ghost"
            size="sm"
            className="h-9 text-muted-foreground hover:text-foreground"
          >
            <XCircle className="size-4 mr-1" />
            Reset Filter
          </Button>
        )}
      </div>
    </div>
  );
};
