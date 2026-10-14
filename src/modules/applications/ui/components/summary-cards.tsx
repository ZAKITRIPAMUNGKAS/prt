"use client";

import { useTRPC } from "@/trpc/client";
import { useSuspenseQuery } from "@tanstack/react-query";
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  IconSend,
  IconClock,
  IconChecklist,
  IconAward,
  IconCircleX,
  IconAlertCircle,
} from "@tabler/icons-react";

export const SummaryCards = () => {
  const trpc = useTRPC();
  const { data: stats } = useSuspenseQuery(
    trpc.applications.getStats.queryOptions()
  );

  return (
    <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 *:data-[slot=card]:bg-linear-to-t *:data-[slot=card]:shadow-xs sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-6">
      {/* 1. Total Lamaran */}
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Total Lamaran</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {stats.total.toLocaleString()}
          </CardTitle>
          <CardAction>
            <Badge variant="outline">Semua</Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Aktivitas terbaru
          </div>
          <div className="text-muted-foreground">
            {stats.last7Days} lamaran dalam 7 hari terakhir
          </div>
        </CardFooter>
      </Card>

      {/* 2. Terkirim */}
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Terkirim</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl text-blue-600 dark:text-blue-400">
            {stats.applied.toLocaleString()}
          </CardTitle>
          <CardAction>
            <Badge
              variant="outline"
              className="bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20"
            >
              <IconSend className="size-3.5 mr-1" /> Applied
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Menunggu tanggapan
          </div>
          <div className="text-muted-foreground">Formulir telah dikirimkan</div>
        </CardFooter>
      </Card>

      {/* 3. Dalam Proses */}
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Dalam Proses</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl text-amber-600 dark:text-amber-400">
            {stats.inProgress.toLocaleString()}
          </CardTitle>
          <CardAction>
            <Badge
              variant="outline"
              className="bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20"
            >
              <IconChecklist className="size-3.5 mr-1" /> Seleksi
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Screening, Tes & Interview
          </div>
          <div className="text-muted-foreground">
            {stats.byStatus.screening} screen · {stats.byStatus.test} tes ·{" "}
            {stats.byStatus.interview} intv
          </div>
        </CardFooter>
      </Card>

      {/* 4. Offer */}
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Offer</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl text-emerald-600 dark:text-emerald-400">
            {stats.offer.toLocaleString()}
          </CardTitle>
          <CardAction>
            <Badge
              variant="outline"
              className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20"
            >
              <IconAward className="size-3.5 mr-1" /> Penawaran
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Tahap penawaran kerja
          </div>
          <div className="text-muted-foreground">
            {stats.byStatus.accepted} diterima
          </div>
        </CardFooter>
      </Card>

      {/* 5. Ditolak */}
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Ditolak</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl text-destructive">
            {stats.rejected.toLocaleString()}
          </CardTitle>
          <CardAction>
            <Badge
              variant="outline"
              className="bg-destructive/10 text-destructive border-destructive/20"
            >
              <IconCircleX className="size-3.5 mr-1" /> Tidak lolos
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Belum rezeki
          </div>
          <div className="text-muted-foreground">
            {stats.byStatus.closed} ditutup · {stats.byStatus.withdrawn} dibatalkan
          </div>
        </CardFooter>
      </Card>

      {/* 6. Perlu Follow-up */}
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Perlu Follow-up</CardDescription>
          <CardTitle
            className={`text-2xl font-semibold tabular-nums @[250px]/card:text-3xl ${
              stats.followUpNeeded > 0
                ? "text-orange-600 dark:text-orange-400"
                : ""
            }`}
          >
            {stats.followUpNeeded.toLocaleString()}
          </CardTitle>
          <CardAction>
            <Badge
              variant="outline"
              className={
                stats.followUpNeeded > 0
                  ? "bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/20"
                  : ""
              }
            >
              {stats.followUpNeeded > 0 ? (
                <>
                  <IconAlertCircle className="size-3.5 mr-1" /> Perhatian
                </>
              ) : (
                <>
                  <IconClock className="size-3.5 mr-1" /> Aman
                </>
              )}
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Terkirim &gt; 14 hari
          </div>
          <div className="text-muted-foreground">
            {stats.followUpNeeded > 0
              ? "Perlu pesan konfirmasi / cek portal"
              : "Semua lamaran masih dalam waktu wajar"}
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export const SummaryCardsSkeleton = () => {
  return (
    <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 *:data-[slot=card]:bg-linear-to-t *:data-[slot=card]:shadow-xs sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-6">
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <Card key={i} className="@container/card">
          <CardHeader>
            <CardDescription>
              <Skeleton className="h-4 w-20" />
            </CardDescription>
            <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
              <Skeleton className="h-8 w-16 mt-2" />
            </CardTitle>
            <CardAction>
              <Skeleton className="h-6 w-16 rounded-full" />
            </CardAction>
          </CardHeader>
          <CardFooter className="flex-col items-start gap-1.5 text-sm">
            <Skeleton className="h-4 w-28" />
            <Skeleton className="h-3 w-36" />
          </CardFooter>
        </Card>
      ))}
    </div>
  );
};
