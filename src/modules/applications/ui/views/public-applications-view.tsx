"use client";

import Link from "next/link";
import { useState } from "react";
import { useTRPC } from "@/trpc/client";
import { useApplicationsFilters } from "../../hooks/use-applications-filters";
import { useSuspenseQuery } from "@tanstack/react-query";
import { DataTable } from "@/components/data-table";
import { getColumns } from "../components/columns";
import { ApplicationsMobileCards } from "../components/applications-mobile-cards";
import { ApplicationsFilterBar } from "../components/applications-filter-bar";
import { SummaryCards, SummaryCardsSkeleton } from "../components/summary-cards";
import { DataPagination } from "@/components/data-pagination";
import { ThemeToggle } from "@/components/theme-toggle";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import {
  IconFileCv,
  IconArrowLeft,
  IconCopy,
  IconCheck,
  IconEye,
  IconBriefcase,
} from "@tabler/icons-react";
import { siteConfig } from "@/site.config";
import { toast } from "sonner";

export const PublicApplicationsView = () => {
  const trpc = useTRPC();
  const [filters, setFilters] = useApplicationsFilters();
  const [copied, setCopied] = useState(false);

  const { data } = useSuspenseQuery(
    trpc.applications.getManyPublic.queryOptions({
      page: filters.page,
      search: filters.search || undefined,
      status: filters.status.length > 0 ? filters.status : undefined,
      platform: filters.platform || undefined,
    })
  );

  const columns = getColumns({ readOnly: true });

  const handleCopyLink = async () => {
    try {
      if (typeof window !== "undefined") {
        await navigator.clipboard.writeText(window.location.href);
        setCopied(true);
        toast.success("Link berhasil disalin!");
        setTimeout(() => setCopied(false), 2000);
      }
    } catch {
      toast.error("Gagal menyalin link");
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      {/* Top Navbar */}
      <header className="sticky top-0 z-40 border-b bg-background/85 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <Link
              href="/"
              className="group flex items-center gap-2.5 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors shrink-0"
              title="Kembali ke Portofolio"
            >
              <div className="size-8 rounded-full border border-border flex items-center justify-center group-hover:bg-muted transition-colors">
                <IconArrowLeft className="size-4" />
              </div>
              <Avatar className="size-8">
                <AvatarImage src={siteConfig.avatar} alt={siteConfig.name} />
                <AvatarFallback>{siteConfig.initials}</AvatarFallback>
              </Avatar>
            </Link>

            <div className="flex flex-col min-w-0">
              <span className="text-sm font-semibold truncate leading-tight">
                {siteConfig.name}
              </span>
              <span className="text-xs text-muted-foreground truncate leading-tight">
                Pelacak Lamaran Kerja
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <Badge
              variant="secondary"
              className="hidden sm:inline-flex items-center gap-1.5 text-xs font-normal py-1 px-2.5 bg-muted/80"
            >
              <IconEye className="size-3.5 text-muted-foreground" />
              <span>Hanya Lihat (Read-Only)</span>
            </Badge>

            <Button
              variant="outline"
              size="sm"
              onClick={handleCopyLink}
              className="h-9 gap-1.5 shadow-2xs text-xs"
              title="Salin link halaman ini"
            >
              {copied ? (
                <>
                  <IconCheck className="size-4 text-emerald-500" />
                  <span className="hidden sm:inline">Tersalin</span>
                </>
              ) : (
                <>
                  <IconCopy className="size-4" />
                  <span className="hidden sm:inline">Salin Link</span>
                </>
              )}
            </Button>

            <ThemeToggle />
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8 flex flex-col gap-6 min-w-0">
        {/* Page Hero Header */}
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center gap-2 flex-wrap">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
              Pelacak Lamaran Kerja
            </h1>
            <Badge
              variant="outline"
              className="text-[11px] font-medium border-primary/30 bg-primary/5 text-primary py-0.5 px-2"
            >
              Publik
            </Badge>
          </div>
          <p className="text-muted-foreground text-sm max-w-2xl">
            Daftar perkembangan dan status lamaran pekerjaan {siteConfig.name}. Halaman ini bersifat hanya-lihat untuk keperluan transparansi proses rekrutmen.
          </p>
        </div>

        {/* 1. Summary Cards */}
        <SummaryCards isPublic={true} />

        {/* 2. Filter Bar */}
        <ApplicationsFilterBar />

        {/* 3. Table / Mobile Cards */}
        {data.items.length === 0 ? (
          <EmptyPublicStatus />
        ) : (
          <div className="flex flex-col gap-y-4 w-full min-w-0">
            {/* Desktop Table View */}
            <div className="hidden md:block rounded-xl border bg-card shadow-2xs overflow-hidden w-full min-w-0">
              <DataTable columns={columns} data={data.items} />
            </div>

            {/* Mobile Card View */}
            <ApplicationsMobileCards
              items={data.items}
              readOnly={true}
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
      </main>

      {/* Public Footer */}
      <footer className="border-t py-6 bg-card/40 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-muted-foreground">
          <p>© {new Date().getFullYear()} {siteConfig.name}. Semua data bersifat rahasia profesional.</p>
          <div className="flex items-center gap-4">
            <Link href="/" className="hover:text-foreground transition-colors">
              Portofolio Utama
            </Link>
            <span>·</span>
            <Link href="/about" className="hover:text-foreground transition-colors">
              Tentang
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

const EmptyPublicStatus = () => {
  return (
    <Empty className="border border-dashed py-12 bg-card/50">
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <IconFileCv className="size-8 text-muted-foreground" />
        </EmptyMedia>
        <EmptyTitle>Tidak ada lamaran yang ditemukan</EmptyTitle>
        <EmptyDescription>
          Tidak ada data lamaran kerja yang cocok dengan filter atau kriteria pencarian saat ini.
        </EmptyDescription>
      </EmptyHeader>
    </Empty>
  );
};

export const PublicApplicationsLoadingStatus = () => {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <header className="border-b h-16 flex items-center px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl w-full mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3">
            <Skeleton className="size-8 rounded-full" />
            <div className="space-y-1">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-3 w-24" />
            </div>
          </div>
          <Skeleton className="h-9 w-24" />
        </div>
      </header>

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8 flex flex-col gap-6">
        <div className="space-y-2">
          <Skeleton className="h-8 w-60" />
          <Skeleton className="h-4 w-96 max-w-full" />
        </div>

        <SummaryCardsSkeleton />

        <div className="flex gap-2">
          <Skeleton className="h-9 w-64" />
          <Skeleton className="h-9 w-24" />
          <Skeleton className="h-9 w-44" />
        </div>

        <div className="rounded-xl border bg-card shadow-2xs overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="pl-6">Perusahaan</TableHead>
                <TableHead>Posisi</TableHead>
                <TableHead>Platform</TableHead>
                <TableHead>Tanggal Lamar</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Langkah Berikutnya</TableHead>
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
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </main>
    </div>
  );
};

export const PublicApplicationsErrorStatus = () => {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
      <div className="text-center space-y-3 max-w-md">
        <div className="size-12 rounded-full bg-destructive/10 text-destructive flex items-center justify-center mx-auto">
          <IconBriefcase className="size-6" />
        </div>
        <h2 className="text-xl font-bold">Gagal Memuat Data</h2>
        <p className="text-sm text-muted-foreground">
          Terjadi kendala saat memuat data lamaran kerja publik. Silakan segarkan halaman atau coba lagi nanti.
        </p>
        <Button onClick={() => window.location.reload()} size="sm" variant="outline">
          Segarkan Halaman
        </Button>
      </div>
    </div>
  );
};
