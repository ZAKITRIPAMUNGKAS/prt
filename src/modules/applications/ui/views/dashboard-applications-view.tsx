"use client";

import { useState } from "react";
import { useTRPC } from "@/trpc/client";
import { useApplicationsFilters } from "../../hooks/use-applications-filters";
import { useSuspenseQuery } from "@tanstack/react-query";
import { DataTable } from "@/components/data-table";
import { getColumns } from "../components/columns";
import { ApplicationsMobileCards } from "../components/applications-mobile-cards";
import { ApplicationsPageHeader } from "../components/applications-page-header";
import { ApplicationsFilterBar } from "../components/applications-filter-bar";
import { ApplicationFormDialog } from "../components/application-form-dialog";
import { SummaryCards, SummaryCardsSkeleton } from "../components/summary-cards";
import { DataPagination } from "@/components/data-pagination";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { IconFileCv } from "@tabler/icons-react";
import { JobApplication } from "@/db/schema";

export const DashboardApplicationsView = () => {
  const trpc = useTRPC();
  const [filters, setFilters] = useApplicationsFilters();

  const [formOpen, setFormOpen] = useState(false);
  const [editingApplication, setEditingApplication] =
    useState<JobApplication | null>(null);

  const { data } = useSuspenseQuery(
    trpc.applications.getMany.queryOptions({
      page: filters.page,
      search: filters.search || undefined,
      status: filters.status.length > 0 ? filters.status : undefined,
      platform: filters.platform || undefined,
    })
  );

  const handleAddNew = () => {
    setEditingApplication(null);
    setFormOpen(true);
  };

  const handleEdit = (application: JobApplication) => {
    setEditingApplication(application);
    setFormOpen(true);
  };

  const columns = getColumns({ onEdit: handleEdit });

  return (
    <div className="py-4 px-4 md:px-8 flex flex-col gap-6">
      {/* 1. Header (Judul, Deskripsi & Tombol Tambah Lamaran) */}
      <ApplicationsPageHeader onAddNew={handleAddNew} />

      {/* 2. Kartu Ringkasan Statistik */}
      <SummaryCards />

      {/* 3. Bar Filter & Pencarian */}
      <ApplicationsFilterBar />

      {/* 4. Daftar Lamaran (Tabel Desktop + Kartu Mobile) */}
      {data.items.length === 0 ? (
        <EmptyStatus onAddNew={handleAddNew} />
      ) : (
        <div className="flex flex-col gap-y-4">
          {/* Desktop Table View */}
          <div className="hidden md:block rounded-md border bg-card shadow-2xs overflow-hidden">
            <DataTable columns={columns} data={data.items} />
          </div>

          {/* Mobile Card View */}
          <ApplicationsMobileCards
            items={data.items}
            onEdit={handleEdit}
          />

          {/* Pagination */}
          <DataPagination
            page={filters.page}
            totalPages={data.totalPages}
            onPageChange={(page) => {
              setFilters({ page });
            }}
          />
        </div>
      )}

      {/* Modal / Drawer Form */}
      <ApplicationFormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        application={editingApplication}
      />
    </div>
  );
};

const EmptyStatus = ({ onAddNew }: { onAddNew: () => void }) => {
  return (
    <Empty className="border border-dashed py-12 bg-card/50">
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <IconFileCv className="size-8 text-muted-foreground" />
        </EmptyMedia>
        <EmptyTitle>Belum ada lamaran kerja</EmptyTitle>
        <EmptyDescription>
          Mulai catat lowongan dan pantau proses lamaran pekerjaan Anda di sini.
        </EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <Button onClick={onAddNew} size="sm" className="shadow-xs">
          Tambah Lamaran Pertama
        </Button>
      </EmptyContent>
    </Empty>
  );
};

export const ApplicationsErrorStatus = () => {
  return (
    <div className="py-12 px-4 text-center text-destructive">
      Terjadi kesalahan saat memuat data lamaran kerja. Silakan coba lagi nanti.
    </div>
  );
};

export const ApplicationsLoadingStatus = () => {
  return (
    <div className="py-4 px-4 md:px-8 flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="space-y-1.5">
          <Skeleton className="h-8 w-44" />
          <Skeleton className="h-4 w-72" />
        </div>
        <Skeleton className="h-9 w-36" />
      </div>

      <SummaryCardsSkeleton />

      <div className="flex gap-2">
        <Skeleton className="h-9 w-64" />
        <Skeleton className="h-9 w-24" />
        <Skeleton className="h-9 w-44" />
      </div>

      <div className="rounded-md border bg-card shadow-2xs overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="pl-6">Perusahaan</TableHead>
              <TableHead>Posisi</TableHead>
              <TableHead>Platform</TableHead>
              <TableHead>Tanggal Lamar</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Langkah Berikutnya</TableHead>
              <TableHead className="text-right pr-6">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {Array.from({ length: 5 }).map((_, i) => (
              <TableRow key={i}>
                <TableCell className="pl-6">
                  <Skeleton className="h-4 w-32" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-4 w-40" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-5 w-20 rounded" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-4 w-24" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-6 w-20 rounded-full" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-4 w-28" />
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
