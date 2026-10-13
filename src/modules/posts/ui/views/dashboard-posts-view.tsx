"use client";

import { useTRPC } from "@/trpc/client";
import { usePostsFilters } from "../../hooks/use-posts-filters";
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
import { IconNotebookOff } from "@tabler/icons-react";
import Link from "next/link";
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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpenIcon, ClockIcon, EyeIcon } from "lucide-react";

export const DashboardPostsView = () => {
  const trpc = useTRPC();
  const [filters, setFilters] = usePostsFilters();

  const { data } = useSuspenseQuery(
    trpc.posts.getMany.queryOptions({ ...filters }),
  );

  const totalViews = data.items.reduce(
    (sum, item) => sum + (item.views ?? 0),
    0,
  );
  const totalReadingSecs = data.items.reduce(
    (sum, item) => sum + (item.totalReadingTimeSeconds ?? 0),
    0,
  );
  const totalReadingCount = data.items.reduce(
    (sum, item) => sum + (item.readingCount ?? 0),
    0,
  );
  const avgReadingSecs =
    totalReadingCount > 0 ? Math.round(totalReadingSecs / totalReadingCount) : 0;

  const avgFormatted =
    avgReadingSecs > 0
      ? Math.floor(avgReadingSecs / 60) > 0
        ? `${Math.floor(avgReadingSecs / 60)}m ${avgReadingSecs % 60}s`
        : `${avgReadingSecs} dtk`
      : "-";

  return (
    <>
      <div className="flex-1 pb-4 px-4 md:px-8 flex flex-col gap-y-4">
        {/* Quick analytics summary cards */}
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <Card className="shadow-xs">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Artikel
              </CardTitle>
              <BookOpenIcon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold tabular-nums">
                {data.total}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Artikel blog terdaftar
              </p>
            </CardContent>
          </Card>

          <Card className="shadow-xs">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Dibaca (Klik)
              </CardTitle>
              <EyeIcon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold tabular-nums">
                {totalViews.toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Kunjungan pada halaman ini
              </p>
            </CardContent>
          </Card>

          <Card className="shadow-xs">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Rata-rata Waktu Baca
              </CardTitle>
              <ClockIcon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold tabular-nums">
                {avgFormatted}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {totalReadingCount} sesi membaca aktif
              </p>
            </CardContent>
          </Card>
        </div>

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
    </>
  );
};

const EmptyStatus = () => {
  return (
    <Empty className="border border-dashed">
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <IconNotebookOff />
        </EmptyMedia>
        <EmptyTitle>Belum ada artikel</EmptyTitle>
        <EmptyDescription>
          Anda belum memiliki artikel blog. Buat artikel baru untuk mulai menulis.
        </EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <Button asChild variant="outline" size="sm">
          <Link href="/dashboard/posts/new">Tambah Artikel</Link>
        </Button>
      </EmptyContent>
    </Empty>
  );
};

export const ErrorStatus = () => {
  return <div>Something went wrong</div>;
};

export const LoadingStatus = () => {
  return (
    <div className="flex-1 pb-4 px-4 md:px-8 flex flex-col gap-y-4">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="shadow-xs">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-4 rounded-full" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-16" />
              <Skeleton className="h-3 w-32 mt-2" />
            </CardContent>
          </Card>
        ))}
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="pl-6">Title</TableHead>
              <TableHead>Dibaca (Klik)</TableHead>
              <TableHead>Rata-rata Baca</TableHead>
              <TableHead>Estimasi</TableHead>
              <TableHead>Visibility</TableHead>
              <TableHead className="text-right pr-6">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {Array.from({ length: 10 }).map((_, i) => (
              <TableRow key={i}>
                <TableCell className="pl-6">
                  <div className="flex flex-col gap-2">
                    <Skeleton className="h-4 w-[180px]" />
                    <Skeleton className="h-3 w-[260px]" />
                  </div>
                </TableCell>
                <TableCell>
                  <Skeleton className="h-4 w-12" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-4 w-16" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-4 w-12" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-6 w-24 rounded-full" />
                </TableCell>
                <TableCell className="text-right pr-6">
                  <div className="flex justify-end gap-2">
                    <Skeleton className="h-8 w-8 rounded-full" />
                    <Skeleton className="h-8 w-8 rounded-full" />
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
