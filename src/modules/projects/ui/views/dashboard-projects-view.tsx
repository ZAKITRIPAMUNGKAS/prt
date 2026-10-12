"use client";

import { useTRPC } from "@/trpc/client";
import { useProjectsFilters } from "../../hooks/use-projects-filters";
import { useSuspenseQuery } from "@tanstack/react-query";
import { DataTable } from "@/components/data-table";
import { columns } from "../components/columns";
import { DataPagination } from "@/components/data-pagination";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { IconBriefcaseOff } from "@tabler/icons-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";

export const DashboardProjectsView = () => {
  const trpc = useTRPC();
  const [filters, setFilters] = useProjectsFilters();

  const { data } = useSuspenseQuery(
    trpc.projects.getManyAdmin.queryOptions({ ...filters })
  );

  return (
    <div className="flex-1 pb-4 px-4 md:px-8 flex flex-col gap-y-4">
      {data.items.length === 0 ? (
        <EmptyStatus />
      ) : (
        <>
          <DataTable columns={columns} data={data.items} />
          <DataPagination
            page={filters.page}
            totalPages={data.totalPages}
            onPageChange={(page) => {
              setFilters({ page });
            }}
          />
        </>
      )}
    </div>
  );
};

const EmptyStatus = () => {
  return (
    <Empty className="border border-dashed">
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <IconBriefcaseOff />
        </EmptyMedia>
        <EmptyTitle>Belum ada proyek</EmptyTitle>
        <EmptyDescription>
          Mulai tambahkan proyek web atau sistem Anda ke portofolio.
        </EmptyDescription>
      </EmptyHeader>
      <EmptyContent />
    </Empty>
  );
};

export const ErrorStatus = () => {
  return <div className="p-8 text-center text-destructive">Terjadi kesalahan saat memuat data proyek</div>;
};

export const LoadingStatus = () => {
  return (
    <div className="flex-1 pb-4 px-4 md:px-8 flex flex-col gap-y-4">
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="pl-6">Cover</TableHead>
              <TableHead>Judul</TableHead>
              <TableHead>Stack</TableHead>
              <TableHead>Tahun</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right pr-6">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {Array.from({ length: 5 }).map((_, i) => (
              <TableRow key={i}>
                <TableCell className="pl-6">
                  <Skeleton className="size-12 rounded-md" />
                </TableCell>
                <TableCell>
                  <div className="flex flex-col gap-2">
                    <Skeleton className="h-4 w-[160px]" />
                    <Skeleton className="h-3 w-[100px]" />
                  </div>
                </TableCell>
                <TableCell>
                  <Skeleton className="h-5 w-24 rounded" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-4 w-12" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-6 w-16 rounded-full" />
                </TableCell>
                <TableCell className="text-right pr-6">
                  <div className="flex justify-end gap-2">
                    <Skeleton className="size-8 rounded" />
                    <Skeleton className="size-8 rounded" />
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};
