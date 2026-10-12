"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { PlusIcon, XCircle } from "lucide-react";
import { useProjectsFilters } from "../../hooks/use-projects-filters";
import { DEFAULT_PAGE } from "@/constants";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { ProjectsSearchFilter } from "./projects-search-filter";

export const ProjectsListHeader = () => {
  const [filters, setFilters] = useProjectsFilters();

  const isAnyFilterModified = !!filters.search;

  const onClearFilters = () => {
    setFilters({
      search: "",
      page: DEFAULT_PAGE,
    });
  };

  return (
    <div className="py-4 px-4 md:px-8 flex flex-col gap-y-8">
      <div>
        <h1 className="text-2xl font-bold">Projects</h1>
        <p className="text-muted-foreground">
          Kelola proyek software development dan studi kasus portofolio Anda
        </p>
      </div>
      <div className="flex items-center justify-between">
        <ScrollArea>
          <div className="flex items-center gap-x-2 p-1">
            <ProjectsSearchFilter />
            {isAnyFilterModified && (
              <Button onClick={onClearFilters} variant="outline" size="sm">
                <XCircle className="size-4 mr-1" />
                Reset
              </Button>
            )}
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
        <Button asChild>
          <Link href="/dashboard/projects/new">
            <PlusIcon className="size-4 mr-1" />
            Tambah Proyek
          </Link>
        </Button>
      </div>
    </div>
  );
};
