"use client";

import { useTRPC } from "@/trpc/client";
import { useSuspenseQuery } from "@tanstack/react-query";
import {
  Card,
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
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
      {/* 1. Total */}
      <Card className="shadow-2xs hover:border-primary/40 transition-colors">
        <CardHeader className="p-3.5 flex flex-col justify-between h-full gap-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground">Total</span>
            <div className="size-6 rounded-md bg-muted flex items-center justify-center text-muted-foreground">
              <IconBriefcase className="size-3.5" />
            </div>
          </div>
          <div>
            <CardTitle className="text-2xl font-bold tabular-nums tracking-tight">
              {stats.total}
            </CardTitle>
            <p className="text-[11px] text-muted-foreground truncate mt-0.5">
              {stats.last7Days} dalam 7 hari
            </p>
          </div>
        </CardHeader>
      </Card>

      {/* 2. Terkirim */}
      <Card className="shadow-2xs hover:border-blue-500/40 transition-colors">
        <CardHeader className="p-3.5 flex flex-col justify-between h-full gap-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-blue-600 dark:text-blue-400">Terkirim</span>
            <div className="size-6 rounded-md bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center">
              <IconSend className="size-3.5" />
            </div>
          </div>
          <div>
            <CardTitle className="text-2xl font-bold tabular-nums tracking-tight text-blue-600 dark:text-blue-400">
              {stats.applied}
            </CardTitle>
            <p className="text-[11px] text-muted-foreground truncate mt-0.5">
              Menunggu respon
            </p>
          </div>
        </CardHeader>
      </Card>

      {/* 3. Dalam Proses */}
      <Card className="shadow-2xs hover:border-amber-500/40 transition-colors">
        <CardHeader className="p-3.5 flex flex-col justify-between h-full gap-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-amber-600 dark:text-amber-400">Dalam Proses</span>
            <div className="size-6 rounded-md bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center">
              <IconChecklist className="size-3.5" />
            </div>
          </div>
          <div>
            <CardTitle className="text-2xl font-bold tabular-nums tracking-tight text-amber-600 dark:text-amber-400">
              {stats.inProgress}
            </CardTitle>
            <p className="text-[11px] text-muted-foreground truncate mt-0.5">
              {stats.byStatus.screening} scr · {stats.byStatus.test} tes · {stats.byStatus.interview} intv
            </p>
          </div>
        </CardHeader>
      </Card>

      {/* 4. Offer */}
      <Card className="shadow-2xs hover:border-emerald-500/40 transition-colors">
        <CardHeader className="p-3.5 flex flex-col justify-between h-full gap-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400">Offer</span>
            <div className="size-6 rounded-md bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <IconAward className="size-3.5" />
            </div>
          </div>
          <div>
            <CardTitle className="text-2xl font-bold tabular-nums tracking-tight text-emerald-600 dark:text-emerald-400">
              {stats.offer}
            </CardTitle>
            <p className="text-[11px] text-muted-foreground truncate mt-0.5">
              {stats.byStatus.accepted} diterima
            </p>
          </div>
        </CardHeader>
      </Card>

      {/* 5. Ditolak */}
      <Card className="shadow-2xs hover:border-destructive/40 transition-colors">
        <CardHeader className="p-3.5 flex flex-col justify-between h-full gap-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-destructive">Ditolak</span>
            <div className="size-6 rounded-md bg-destructive/10 text-destructive flex items-center justify-center">
              <IconCircleX className="size-3.5" />
            </div>
          </div>
          <div>
            <CardTitle className="text-2xl font-bold tabular-nums tracking-tight text-destructive">
              {stats.rejected}
            </CardTitle>
            <p className="text-[11px] text-muted-foreground truncate mt-0.5">
              {stats.byStatus.closed} tutup · {stats.byStatus.withdrawn} batal
            </p>
          </div>
        </CardHeader>
      </Card>

      {/* 6. Follow-up */}
      <Card
        className={`shadow-2xs transition-colors ${
          stats.followUpNeeded > 0
            ? "border-orange-500/40 bg-orange-500/[0.04]"
            : "hover:border-primary/40"
        }`}
      >
        <CardHeader className="p-3.5 flex flex-col justify-between h-full gap-2">
          <div className="flex items-center justify-between">
            <span
              className={`text-xs font-medium ${
                stats.followUpNeeded > 0
                  ? "text-orange-600 dark:text-orange-400 font-semibold"
                  : "text-muted-foreground"
              }`}
            >
              Follow-up
            </span>
            <div
              className={`size-6 rounded-md flex items-center justify-center ${
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
          <div>
            <CardTitle
              className={`text-2xl font-bold tabular-nums tracking-tight ${
                stats.followUpNeeded > 0
                  ? "text-orange-600 dark:text-orange-400"
                  : ""
              }`}
            >
              {stats.followUpNeeded}
            </CardTitle>
            <p className="text-[11px] text-muted-foreground truncate mt-0.5">
              {stats.followUpNeeded > 0
                ? "Terkirim > 14 hari"
                : "Semua respon wajar"}
            </p>
          </div>
        </CardHeader>
      </Card>
    </div>
  );
};

export const SummaryCardsSkeleton = () => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <Card key={i} className="shadow-2xs">
          <CardHeader className="p-3.5 space-y-2">
            <div className="flex items-center justify-between">
              <Skeleton className="h-3 w-16" />
              <Skeleton className="size-6 rounded-md" />
            </div>
            <Skeleton className="h-7 w-12" />
            <Skeleton className="h-2.5 w-24" />
          </CardHeader>
        </Card>
      ))}
    </div>
  );
};
