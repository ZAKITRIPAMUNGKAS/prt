import { Input } from "@/components/ui/input";
import { useProjectsFilters } from "../../hooks/use-projects-filters";
import { SearchIcon } from "lucide-react";

export const ProjectsSearchFilter = () => {
  const [filters, setFilters] = useProjectsFilters();

  return (
    <div className="relative">
      <Input
        placeholder="Cari berdasarkan judul"
        value={filters.search}
        className="h-9 w-[220px] pl-7"
        onChange={(e) => setFilters({ search: e.target.value })}
      />
      <SearchIcon className="size-4 absolute left-2 top-1/2 -translate-y-1/2 text-muted-foreground" />
    </div>
  );
};
