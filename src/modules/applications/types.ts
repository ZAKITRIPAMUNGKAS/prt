import { JobApplication } from "@/db/schema";

export const APPLICATION_STATUSES = [
  "draft",
  "applied",
  "screening",
  "test",
  "interview",
  "offer",
  "accepted",
  "rejected",
  "withdrawn",
  "closed",
] as const;

export type ApplicationStatus = (typeof APPLICATION_STATUSES)[number];

export const APPLICATION_STATUS_LABELS: Record<ApplicationStatus, string> = {
  draft: "Draft",
  applied: "Terkirim",
  screening: "Screening",
  test: "Tes",
  interview: "Interview",
  offer: "Offer",
  accepted: "Diterima",
  rejected: "Ditolak",
  withdrawn: "Dibatalkan",
  closed: "Ditutup",
};

export const APPLICATION_STATUS_COLORS: Record<
  ApplicationStatus,
  { label: string; bg: string; text: string; border: string }
> = {
  draft: {
    label: "Draft",
    bg: "bg-muted/60 text-muted-foreground",
    text: "text-muted-foreground",
    border: "border-muted",
  },
  applied: {
    label: "Terkirim",
    bg: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20",
    text: "text-blue-600 dark:text-blue-400",
    border: "border-blue-500/20",
  },
  screening: {
    label: "Screening",
    bg: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
    text: "text-amber-600 dark:text-amber-400",
    border: "border-amber-500/20",
  },
  test: {
    label: "Tes",
    bg: "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/20",
    text: "text-indigo-600 dark:text-indigo-400",
    border: "border-indigo-500/20",
  },
  interview: {
    label: "Interview",
    bg: "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20",
    text: "text-purple-600 dark:text-purple-400",
    border: "border-purple-500/20",
  },
  offer: {
    label: "Offer",
    bg: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
    text: "text-emerald-600 dark:text-emerald-400",
    border: "border-emerald-500/20",
  },
  accepted: {
    label: "Diterima",
    bg: "bg-green-600/15 text-green-700 dark:text-green-300 border-green-600/30",
    text: "text-green-700 dark:text-green-300",
    border: "border-green-600/30",
  },
  rejected: {
    label: "Ditolak",
    bg: "bg-destructive/10 text-destructive border-destructive/20",
    text: "text-destructive",
    border: "border-destructive/20",
  },
  withdrawn: {
    label: "Dibatalkan",
    bg: "bg-zinc-500/10 text-zinc-600 dark:text-zinc-400 border-zinc-500/20",
    text: "text-zinc-600 dark:text-zinc-400",
    border: "border-zinc-500/20",
  },
  closed: {
    label: "Ditutup",
    bg: "bg-stone-500/10 text-stone-600 dark:text-stone-400 border-stone-500/20",
    text: "text-stone-600 dark:text-stone-400",
    border: "border-stone-500/20",
  },
};

export interface ApplicationStats {
  total: number;
  applied: number;
  inProgress: number;
  offer: number;
  rejected: number;
  followUpNeeded: number;
  last7Days: number;
  byStatus: Record<ApplicationStatus, number>;
}

export type { JobApplication };
