"use client";

import { ColumnDef } from "@tanstack/react-table";
import { PostGetMany } from "../../types";
import { VisibilityToggle } from "./visibility-toggle";
import { DeletePostButton } from "./delete-post-button";
import Link from "next/link";
import { ClockIcon, EyeIcon, PenBoxIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

function formatReadingTime(totalSeconds: number, readingCount: number) {
  if (!readingCount || readingCount === 0 || !totalSeconds || totalSeconds === 0) {
    return <span className="text-muted-foreground text-xs">-</span>;
  }
  const avgSeconds = Math.round(totalSeconds / readingCount);
  const minutes = Math.floor(avgSeconds / 60);
  const seconds = avgSeconds % 60;

  const formatted =
    minutes === 0
      ? `${seconds} dtk`
      : seconds > 0
        ? `${minutes}m ${seconds}s`
        : `${minutes} mnt`;

  return (
    <div className="flex flex-col">
      <span className="font-medium text-sm tabular-nums">{formatted}</span>
      <span className="text-muted-foreground text-xs">
        {readingCount} sesi baca
      </span>
    </div>
  );
}

export const columns: ColumnDef<PostGetMany[number]>[] = [
  {
    accessorKey: "title",
    header: "Title",
    cell: ({ row }) => {
      return (
        <div className="max-w-[280px] truncate font-medium">
          {row.original.title}
        </div>
      );
    },
  },
  {
    accessorKey: "views",
    header: "Dibaca (Klik)",
    cell: ({ row }) => {
      const views = row.original.views ?? 0;
      return (
        <div className="flex items-center gap-1.5 font-medium text-sm tabular-nums">
          <EyeIcon className="h-3.5 w-3.5 text-muted-foreground" />
          <span>{views.toLocaleString()}</span>
        </div>
      );
    },
  },
  {
    id: "avgReadingTime",
    header: "Rata-rata Baca",
    cell: ({ row }) => {
      return formatReadingTime(
        row.original.totalReadingTimeSeconds ?? 0,
        row.original.readingCount ?? 0,
      );
    },
  },
  {
    accessorKey: "readingTimeMinutes",
    header: "Estimasi",
    cell: ({ row }) => {
      const mins = row.original.readingTimeMinutes ?? 1;
      return (
        <div className="flex items-center gap-1 text-sm text-muted-foreground">
          <ClockIcon className="h-3.5 w-3.5" />
          <span>{mins} mnt</span>
        </div>
      );
    },
  },
  {
    accessorKey: "visibility",
    header: "Visibility",
    cell: ({ row }) => {
      return (
        <VisibilityToggle
          photoId={row.original.id}
          initialValue={row.original.visibility}
        />
      );
    },
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      return (
        <div className="flex items-center gap-1">
          <DeletePostButton
            postId={row.original.id}
            postTitle={row.original.title}
          />

          <Button variant="ghost" size="icon" asChild>
            <Link href={`/dashboard/posts/${row.original.slug}`}>
              <PenBoxIcon className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      );
    },
  },
];
