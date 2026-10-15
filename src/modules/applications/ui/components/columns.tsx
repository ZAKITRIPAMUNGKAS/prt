"use client";

import { ColumnDef } from "@tanstack/react-table";
import {
  ExternalLink,
  PenBoxIcon,
  Clock,
  MapPin,
  Briefcase,
  Coins,
  FileText,
} from "lucide-react";

import { JobApplication } from "@/db/schema";
import { ApplicationStatus } from "../../types";
import { StatusDropdown } from "./status-dropdown";
import { ApplicationStatusBadge } from "./status-badge";
import { DeleteApplicationDialog } from "./delete-application-dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  formatFullDate,
  formatRelativeDate,
  formatRupiahShort,
} from "../../lib/utils";

export function isFollowUpNeeded(application: {
  status: string;
  appliedAt?: string | null;
  createdAt?: string | Date | null;
}): boolean {
  if (application.status !== "applied") return false;
  const dateStr = application.appliedAt;
  if (!dateStr) return false;
  const appliedDate = new Date(`${dateStr}T00:00:00`);
  if (isNaN(appliedDate.getTime())) return false;
  const now = new Date();
  const diffDays =
    (now.getTime() - appliedDate.getTime()) / (1000 * 60 * 60 * 24);
  return diffDays >= 14;
}

interface ColumnOptions {
  onEdit?: (application: JobApplication) => void;
  readOnly?: boolean;
}

export const getColumns = ({ onEdit, readOnly = false }: ColumnOptions): ColumnDef<JobApplication>[] => {
  const baseColumns: ColumnDef<JobApplication>[] = [
  // 1. Perusahaan
  {
    accessorKey: "company",
    header: () => <span className="font-semibold text-xs text-muted-foreground uppercase tracking-wider">Perusahaan</span>,
    cell: ({ row }) => {
      const app = row.original;
      const needsFollowUp = isFollowUpNeeded(app);

      return (
        <div className="flex flex-col gap-1 min-w-[180px] max-w-[240px]">
          <div className="flex items-center gap-1.5 flex-wrap">
            {app.jobUrl ? (
              <a
                href={app.jobUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-sm hover:underline inline-flex items-center gap-1 group text-foreground hover:text-primary transition-colors"
                title="Buka link lowongan"
              >
                <span className="truncate">{app.company}</span>
                <ExternalLink className="size-3 opacity-60 group-hover:opacity-100 transition-opacity shrink-0" />
              </a>
            ) : (
              <span className="font-semibold text-sm text-foreground truncate">
                {app.company}
              </span>
            )}

            {/* Note tooltip icon */}
            {app.notes && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <span className="cursor-help text-muted-foreground hover:text-foreground inline-flex items-center">
                      <FileText className="size-3 text-muted-foreground/70" />
                    </span>
                  </TooltipTrigger>
                  <TooltipContent side="top" className="max-w-xs text-xs">
                    <p className="font-medium text-foreground mb-0.5">Catatan:</p>
                    <p className="text-muted-foreground">{app.notes}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}

            {/* Follow up pill */}
            {needsFollowUp && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Badge
                      variant="outline"
                      className="text-[10px] bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20 px-1.5 py-0 h-4.5 gap-0.5 shrink-0"
                    >
                      <Clock className="size-2.5" />
                      <span>Follow-up</span>
                    </Badge>
                  </TooltipTrigger>
                  <TooltipContent side="top">
                    <p className="text-xs">
                      Status terkirim sudah lebih dari 14 hari tanpa perubahan
                    </p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
          </div>
        </div>
      );
    },
  },

  // 2. Posisi
  {
    accessorKey: "position",
    header: () => <span className="font-semibold text-xs text-muted-foreground uppercase tracking-wider">Posisi</span>,
    cell: ({ row }) => {
      const app = row.original;
      const hasSalary = app.salaryMin != null || app.salaryMax != null;

      return (
        <div className="flex flex-col gap-1 min-w-[200px] max-w-[260px]">
          <span className="text-sm font-medium text-foreground leading-snug truncate">
            {app.position || (
              <span className="text-muted-foreground italic text-xs">
                Belum ditentukan
              </span>
            )}
          </span>
          <div className="flex flex-wrap items-center gap-1">
            {app.employmentType && (
              <span className="inline-flex items-center gap-0.5 text-[10px] text-muted-foreground bg-muted/70 px-1.5 py-0.5 rounded font-medium">
                <Briefcase className="size-2.5" />
                {app.employmentType}
              </span>
            )}
            {app.location && (
              <span className="inline-flex items-center gap-0.5 text-[10px] text-muted-foreground bg-muted/70 px-1.5 py-0.5 rounded font-medium">
                <MapPin className="size-2.5" />
                {app.location}
              </span>
            )}
            {hasSalary && (
              <span className="inline-flex items-center gap-0.5 text-[10px] text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded font-medium">
                <Coins className="size-2.5" />
                {app.salaryMin != null && app.salaryMax != null
                  ? `${formatRupiahShort(app.salaryMin)} - ${formatRupiahShort(app.salaryMax)}`
                  : app.salaryMin != null
                  ? `Min ${formatRupiahShort(app.salaryMin)}`
                  : `Maks ${formatRupiahShort(app.salaryMax)}`}
              </span>
            )}
          </div>
        </div>
      );
    },
  },

  // 3. Platform
  {
    accessorKey: "platform",
    header: () => <span className="font-semibold text-xs text-muted-foreground uppercase tracking-wider">Platform</span>,
    cell: ({ row }) => {
      return (
        <div className="min-w-[100px] whitespace-nowrap">
          <Badge
            variant="secondary"
            className="font-normal text-xs px-2.5 py-0.5 bg-muted/70 text-foreground"
          >
            {row.original.platform}
          </Badge>
        </div>
      );
    },
  },

  // 4. Tanggal Lamar
  {
    accessorKey: "appliedAt",
    header: () => <span className="font-semibold text-xs text-muted-foreground uppercase tracking-wider">Tanggal Lamar</span>,
    cell: ({ row }) => {
      const appliedAt = row.original.appliedAt;
      if (!appliedAt) {
        return (
          <span className="text-xs text-muted-foreground italic min-w-[100px] block">
            Draft
          </span>
        );
      }

      const relativeDate = formatRelativeDate(appliedAt);
      const fullDate = formatFullDate(appliedAt);

      return (
        <div className="min-w-[110px] whitespace-nowrap">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <span className="text-xs font-medium text-muted-foreground hover:text-foreground cursor-help transition-colors">
                  {relativeDate}
                </span>
              </TooltipTrigger>
              <TooltipContent side="top">
                <p className="text-xs">{fullDate}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      );
    },
  },

  // 5. Status
  {
    accessorKey: "status",
    header: () => <span className="font-semibold text-xs text-muted-foreground uppercase tracking-wider">Status</span>,
    cell: ({ row }) => {
      if (readOnly) {
        return (
          <div className="min-w-[110px] whitespace-nowrap">
            <ApplicationStatusBadge status={row.original.status} />
          </div>
        );
      }

      return (
        <div className="min-w-[120px] whitespace-nowrap">
          <StatusDropdown
            id={row.original.id}
            currentStatus={row.original.status as ApplicationStatus}
            companyName={row.original.company}
          />
        </div>
      );
    },
  },

  // 6. Langkah Berikutnya
  {
    accessorKey: "nextStep",
    header: () => <span className="font-semibold text-xs text-muted-foreground uppercase tracking-wider">Langkah Berikutnya</span>,
    cell: ({ row }) => {
      const { nextStep, nextStepAt } = row.original;
      if (!nextStep && !nextStepAt) {
        return <span className="text-muted-foreground/60 text-xs">—</span>;
      }

      return (
        <div className="flex flex-col text-xs min-w-[130px] max-w-[180px]">
          {nextStep && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <span className="font-medium text-foreground truncate cursor-default">
                    {nextStep}
                  </span>
                </TooltipTrigger>
                <TooltipContent side="top" className="max-w-xs text-xs">
                  <p>{nextStep}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
          {nextStepAt && (
            <span className="text-[11px] text-muted-foreground mt-0.5">
              {formatFullDate(nextStepAt)}
            </span>
          )}
        </div>
      );
    },
  },
  ];

  if (!readOnly && onEdit) {
    baseColumns.push({
      id: "actions",
      header: () => (
        <div className="text-right pr-2 font-semibold text-xs text-muted-foreground uppercase tracking-wider">
          Aksi
        </div>
      ),
      cell: ({ row }) => {
        return (
          <div className="flex justify-end items-center gap-0.5">
            <Button
              variant="ghost"
              size="icon"
              className="size-7 text-muted-foreground hover:text-foreground rounded-md"
              onClick={() => onEdit(row.original)}
              title="Edit lamaran"
            >
              <PenBoxIcon className="size-3.5" />
            </Button>

            <DeleteApplicationDialog
              id={row.original.id}
              companyName={row.original.company}
            />
          </div>
        );
      },
    });
  }

  return baseColumns;
};
