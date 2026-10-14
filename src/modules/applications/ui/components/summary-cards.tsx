"use client";

import { useTRPC } from "@/trpc/client";
import { useSuspenseQuery } from "@tanstack/react-query";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  IconBriefcase,
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
    <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3.5">
      {/* 1. Total Lamaran */}
      <Card className="shadow-xs hover:border-primary/30 transition-colors">
        <CardHeader className="p-4 pb-2">
          <div className="flex items-center justify-between">
            <CardDescription className="text-xs font-medium">
              Total Lamaran
            </CardDescription>
            <div className="size-7 rounded-md bg-muted flex items-center justify-center text-muted-foreground">
              <IconBriefcase className="size-3.5" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold tabular-nums tracking-tight mt-1">
            {stats.total.toLocaleString()}
          </CardTitle>
        </CardHeader>
        <CardFooter className="p-4 pt-1 text-[11px] text-muted-foreground">
          <span className="truncate">
            <strong className="text-foreground font-semibold">
              {stats.last7Days}
            </strong>{" "}
            dalam 7 hari terakhir
          </span>
        </CardFooter>
      </Card>

      {/* 2. Terkirim */}
      <Card className="shadow-xs hover:border-blue-500/30 transition-colors">
        <CardHeader className="p-4 pb-2">
          <div className="flex items-center justify-between">
            <CardDescription className="text-xs font-medium">
              Terkirim
            </CardDescription>
            <div className="size-7 rounded-md bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center">
              <IconSend className="size-3.5" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold tabular-nums tracking-tight text-blue-600 dark:text-blue-400 mt-1">
            {stats.applied.toLocaleString()}
          </CardTitle>
        </CardHeader>
        <CardFooter className="p-4 pt-1 text-[11px] text-muted-foreground">
          <span className="truncate">Menunggu respon awal</span>
        </CardFooter>
      </Card>

      {/* 3. Dalam Proses */}
      <Card className="shadow-xs hover:border-amber-500/30 transition-colors">
        <CardHeader className="p-4 pb-2">
          <div className="flex items-center justify-between">
            <CardDescription className="text-xs font-medium">
              Dalam Proses
            </CardDescription>
            <div className="size-7 rounded-md bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center">
              <IconChecklist className="size-3.5" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold tabular-nums tracking-tight text-amber-600 dark:text-amber-400 mt-1">
            {stats.inProgress.toLocaleString()}
          </CardTitle>
        </CardHeader>
        <CardFooter className="p-4 pt-1 text-[11px] text-muted-foreground">
          <span className="truncate">
            {stats.byStatus.screening} scr · {stats.byStatus.test} tes ·{" "}
            {stats.byStatus.interview} intv
          </span>
        </CardFooter>
      </Card>

      {/* 4. Offer */}
      <Card className="shadow-xs hover:border-emerald-500/30 transition-colors">
        <CardHeader className="p-4 pb-2">
          <div className="flex items-center justify-between">
            <CardDescription className="text-xs font-medium">
              Offer
            </CardDescription>
            <div className="size-7 rounded-md bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <IconAward className="size-3.5" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold tabular-nums tracking-tight text-emerald-600 dark:text-emerald-400 mt-1">
            {stats.offer.toLocaleString()}
          </CardTitle>
        </CardHeader>
        <CardFooter className="p-4 pt-1 text-[11px] text-muted-foreground">
          <span className="truncate">
            <strong className="text-foreground font-semibold">
              {stats.byStatus.accepted}
            </strong>{" "}
            telah diterima
          </span>
        </CardFooter>
      </Card>

      {/* 5. Ditolak */}
      <Card className="shadow-xs hover:border-destructive/30 transition-colors">
        <CardHeader className="p-4 pb-2">
          <div className="flex items-center justify-between">
            <CardDescription className="text-xs font-medium">
              Ditolak
            </CardDescription>
            <div className="size-7 rounded-md bg-destructive/10 text-destructive flex items-center justify-center">
              <IconCircleX className="size-3.5" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold tabular-nums tracking-tight text-destructive mt-1">
            {stats.rejected.toLocaleString()}
          </CardTitle>
        </CardHeader>
        <CardFooter className="p-4 pt-1 text-[11px] text-muted-foreground">
          <span className="truncate">
            {stats.byStatus.closed} tutup · {stats.byStatus.withdrawn} batal
          </span>
        </CardFooter>
      </Card>

      {/* 6. Perlu Follow-up */}
      <Card
        className={`shadow-xs transition-colors ${
          stats.followUpNeeded > 0
            ? "border-orange-500/30 bg-orange-500/[0.02]"
            : "hover:border-primary/30"
        }`}
      >
        <CardHeader className="p-4 pb-2">
          <div className="flex items-center justify-between">
            <CardDescription className="text-xs font-medium">
              Perlu Follow-up
            </CardDescription>
            <div
              className={`size-7 rounded-md flex items-center justify-center ${
                stats.followUpNeeded > 0
                  ? "bg-orange-500/10 text-orange-600 dark:text-orange-400"
                  : "bg-muted text-muted-foreground"
              }`}
            >
              {stats.followUpNeeded > 0 ? (
                <IconAlertCircle className="size-3.5" />
              ) : (
                <IconClock className="size-3.5" />
              )}
            </div>
          </div>
          <CardTitle
            className={`text-2xl font-bold tabular-nums tracking-tight mt-1 ${
              stats.followUpNeeded > 0
                ? "text-orange-600 dark:text-orange-400"
                : ""
            }`}
          >
            {stats.followUpNeeded.toLocaleString()}
          </CardTitle>
        </CardHeader>
        <CardFooter className="p-4 pt-1 text-[11px] text-muted-foreground">
          <span className="truncate">
            {stats.followUpNeeded > 0
              ? "> 14 hari tanpa kabar"
              : "Semua respon wajar"}
          </span>
        </CardFooter>
      </Card>
    </div>
  );
};

export const SummaryCardsSkeleton = () => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3.5">
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <Card key={i} className="shadow-xs">
          <CardHeader className="p-4 pb-2">
            <div className="flex items-center justify-between">
              <Skeleton className="h-3.5 w-16" />
              <Skeleton className="size-7 rounded-md" />
            </div>
            <Skeleton className="h-7 w-12 mt-2" />
          </CardHeader>
          <CardFooter className="p-4 pt-1">
            <Skeleton className="h-3 w-28" />
          </CardFooter>
        </Card>
      ))}
    </div>
  );
};
