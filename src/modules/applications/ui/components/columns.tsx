"use client";

import { ColumnDef } from "@tanstack/react-table";
import { format, formatDistanceToNow } from "date-fns";
import { id as idLocale } from "date-fns/locale";
import {
  ExternalLink,
  PenBoxIcon,
  Clock,
  MapPin,
  Briefcase,
} from "lucide-react";

import { JobApplication } from "@/db/schema";
import { ApplicationStatus } from "../../types";
import { StatusDropdown } from "./status-dropdown";
import { DeleteApplicationDialog } from "./delete-application-dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

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
  onEdit: (application: JobApplication) => void;
}

export const getColumns = ({ onEdit }: ColumnOptions): ColumnDef<JobApplication>[] => [
  // 1. Perusahaan
  {
    accessorKey: "company",
    header: "Perusahaan",
    cell: ({ row }) => {
      const app = row.original;
      const needsFollowUp = isFollowUpNeeded(app);

      return (
        <div className="flex items-start gap-2 max-w-[220px]">
          {needsFollowUp && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <span
                    className="inline-flex items-center text-amber-500 mt-0.5 shrink-0"
                    aria-label="Perlu follow-up"
                  >
                    <Clock className="size-3.5" />
                  </span>
                </TooltipTrigger>
                <TooltipContent side="top">
                  <p className="text-xs">
                    Perlu follow-up: status terkirim lebih dari 14 hari
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}

          <div className="flex flex-col">
            {app.jobUrl ? (
              <a
                href={app.jobUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-sm hover:underline inline-flex items-center gap-1 group text-foreground hover:text-primary transition-colors"
                title="Buka link lowongan"
              >
                <span className="truncate">{app.company}</span>
                <ExternalLink className="size-3 opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
              </a>
            ) : (
              <span className="font-semibold text-sm text-foreground truncate">
                {app.company}
              </span>
            )}
            {app.notes && (
              <span className="text-xs text-muted-foreground line-clamp-1 mt-0.5">
                {app.notes}
              </span>
            )}
          </div>
        </div>
      );
    },
  },

  // 2. Posisi
  {
    accessorKey: "position",
    header: "Posisi",
    cell: ({ row }) => {
      const app = row.original;
      return (
        <div className="flex flex-col gap-1 max-w-[200px]">
          <span className="text-sm font-medium">
            {app.position || (
              <span className="text-muted-foreground italic text-xs">
                Belum ditentukan
              </span>
            )}
          </span>
          <div className="flex flex-wrap gap-1">
            {app.employmentType && (
              <span className="inline-flex items-center gap-0.5 text-[10px] text-muted-foreground bg-muted px-1.5 py-0.5 rounded">
                <Briefcase className="size-2.5" />
                {app.employmentType}
              </span>
            )}
            {app.location && (
              <span className="inline-flex items-center gap-0.5 text-[10px] text-muted-foreground bg-muted px-1.5 py-0.5 rounded">
                <MapPin className="size-2.5" />
                {app.location}
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
    header: "Platform",
    cell: ({ row }) => {
      return (
        <Badge variant="secondary" className="font-normal text-xs">
          {row.original.platform}
        </Badge>
      );
    },
  },

  // 4. Tanggal Lamar
  {
    accessorKey: "appliedAt",
    header: "Tanggal Lamar",
    cell: ({ row }) => {
      const appliedAt = row.original.appliedAt;
      if (!appliedAt) {
        return (
          <span className="text-xs text-muted-foreground italic">
            Draft (belum dikirim)
          </span>
        );
      }

      const dateObj = new Date(`${appliedAt}T00:00:00`);
      const relativeDate = formatDistanceToNow(dateObj, {
        addSuffix: true,
        locale: idLocale,
      });
      const fullDate = format(dateObj, "EEEE, d MMMM yyyy", {
        locale: idLocale,
      });

      return (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <span className="text-sm cursor-help hover:text-foreground underline decoration-dotted decoration-muted-foreground/60 text-muted-foreground">
                {relativeDate}
              </span>
            </TooltipTrigger>
            <TooltipContent side="top">
              <p className="text-xs">{fullDate}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      );
    },
  },

  // 5. Status
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      return (
        <StatusDropdown
          id={row.original.id}
          currentStatus={row.original.status as ApplicationStatus}
          companyName={row.original.company}
        />
      );
    },
  },

  // 6. Langkah Berikutnya
  {
    accessorKey: "nextStep",
    header: "Langkah Berikutnya",
    cell: ({ row }) => {
      const { nextStep, nextStepAt } = row.original;
      if (!nextStep && !nextStepAt) {
        return <span className="text-muted-foreground text-xs">-</span>;
      }

      return (
        <div className="flex flex-col text-xs max-w-[180px]">
          {nextStep && <span className="font-medium text-foreground">{nextStep}</span>}
          {nextStepAt && (
            <span className="text-muted-foreground mt-0.5">
              {format(new Date(`${nextStepAt}T00:00:00`), "d MMM yyyy", {
                locale: idLocale,
              })}
            </span>
          )}
        </div>
      );
    },
  },

  // 7. Aksi
  {
    id: "actions",
    header: () => <div className="text-right pr-2">Aksi</div>,
    cell: ({ row }) => {
      return (
        <div className="flex justify-end items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="size-8 text-muted-foreground hover:text-foreground"
            onClick={() => onEdit(row.original)}
            title="Edit lamaran"
          >
            <PenBoxIcon className="size-4" />
          </Button>

          <DeleteApplicationDialog
            id={row.original.id}
            companyName={row.original.company}
          />
        </div>
      );
    },
  },
];
