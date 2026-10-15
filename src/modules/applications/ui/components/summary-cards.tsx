"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { useTRPC } from "@/trpc/client";
import { useSuspenseQuery } from "@tanstack/react-query";
import {
  IconAlertCircle,
  IconAward,
  IconBriefcase,
  IconChecklist,
  IconCircleX,
  IconClock,
  IconSend,
} from "@tabler/icons-react";

type SummaryItem = {
  label: string;
  value: number;
  detail: string;
  icon: typeof IconBriefcase;
  accentClass: string;
  iconClass: string;
};

interface SummaryCardsProps {
  isPublic?: boolean;
}

export const SummaryCards = ({ isPublic = false }: SummaryCardsProps) => {
  const trpc = useTRPC();
  const { data: stats } = useSuspenseQuery(
    isPublic
      ? trpc.applications.getStatsPublic.queryOptions()
      : trpc.applications.getStats.queryOptions()
  );

  const items: SummaryItem[] = [
    {
      label: "Total",
      value: stats.total,
      detail: `${stats.last7Days} dalam 7 hari`,
      icon: IconBriefcase,
      accentClass: "text-foreground",
      iconClass: "bg-muted text-muted-foreground",
    },
    {
      label: "Terkirim",
      value: stats.applied,
      detail: "Menunggu respons",
      icon: IconSend,
      accentClass: "text-blue-600 dark:text-blue-400",
      iconClass: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
    },
    {
      label: "Dalam proses",
      value: stats.inProgress,
      detail: `${stats.byStatus.screening} skr · ${stats.byStatus.test} tes · ${stats.byStatus.interview} intv`,
      icon: IconChecklist,
      accentClass: "text-amber-600 dark:text-amber-400",
      iconClass: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
    },
    {
      label: "Offer",
      value: stats.offer,
      detail: `${stats.byStatus.accepted} diterima`,
      icon: IconAward,
      accentClass: "text-emerald-600 dark:text-emerald-400",
      iconClass: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
    },
    {
      label: "Ditolak",
      value: stats.rejected,
      detail: `${stats.byStatus.closed} tutup · ${stats.byStatus.withdrawn} batal`,
      icon: IconCircleX,
      accentClass: "text-destructive",
      iconClass: "bg-destructive/10 text-destructive",
    },
    {
      label: "Follow-up",
      value: stats.followUpNeeded,
      detail:
        stats.followUpNeeded > 0
          ? "Lewat 14 hari"
          : "Semua tepat waktu",
      icon: stats.followUpNeeded > 0 ? IconAlertCircle : IconClock,
      accentClass:
        stats.followUpNeeded > 0
          ? "text-orange-600 dark:text-orange-400"
          : "text-foreground",
      iconClass:
        stats.followUpNeeded > 0
          ? "bg-orange-500/10 text-orange-600 dark:text-orange-400"
          : "bg-muted text-muted-foreground",
    },
  ];

  return (
    <section
      aria-label="Ringkasan lamaran"
      className="overflow-hidden rounded-xl border bg-border/70 shadow-2xs w-full"
    >
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-px">
        {items.map((item) => {
          const Icon = item.icon;

          return (
            <article
              key={item.label}
              className="flex min-h-22 flex-col justify-between bg-card px-3 py-2.5 transition-colors hover:bg-muted/35 sm:px-3.5"
            >
              <div className="flex items-center justify-between gap-3">
                <p className={`text-xs font-medium ${item.accentClass}`}>
                  {item.label}
                </p>
                <span
                  className={`flex size-6 shrink-0 items-center justify-center rounded-md ${item.iconClass}`}
                >
                  <Icon className="size-3" aria-hidden="true" />
                </span>
              </div>
              <div className="mt-2 min-w-0">
                <p
                  className={`text-2xl font-bold tracking-tight tabular-nums ${item.accentClass}`}
                >
                  {item.value}
                </p>
                <p className="mt-0.5 truncate text-[11px] text-muted-foreground">
                  {item.detail}
                </p>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
};

export const SummaryCardsSkeleton = () => {
  return (
    <div className="grid grid-cols-2 gap-px overflow-hidden rounded-xl border bg-border/70 shadow-2xs md:grid-cols-3 xl:grid-cols-6">
      {Array.from({ length: 6 }).map((_, index) => (
        <div key={index} className="min-h-22 bg-card px-3 py-2.5 sm:px-3.5">
          <div className="flex items-center justify-between">
            <Skeleton className="h-3 w-16" />
            <Skeleton className="size-6 rounded-md" />
          </div>
          <div className="mt-2 space-y-1.5">
            <Skeleton className="h-7 w-12" />
            <Skeleton className="h-2.5 w-24" />
          </div>
        </div>
      ))}
    </div>
  );
};
