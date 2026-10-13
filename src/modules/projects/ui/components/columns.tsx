"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Project } from "@/db/schema";
import { DeleteProjectButton } from "./delete-project-button";
import Link from "next/link";
import { PenBoxIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import { getProjectCoverUrl } from "../../lib/utils";
import { getTechIcon } from "../../lib/tech-stack-catalog";

export const columns: ColumnDef<Project>[] = [
  {
    accessorKey: "coverKey",
    header: "Cover",
    cell: ({ row }) => {
      const coverUrl = getProjectCoverUrl(row.original.coverKey);
      return (
        <div className="size-12 rounded-md overflow-hidden relative bg-muted shrink-0">
          <Image
            src={coverUrl}
            alt={row.original.title}
            fill
            className="object-cover"
            unoptimized
          />
        </div>
      );
    },
  },
  {
    accessorKey: "title",
    header: "Judul",
    cell: ({ row }) => {
      return (
        <div className="flex flex-col gap-1 max-w-[240px]">
          <span className="font-medium text-sm truncate">
            {row.original.title}
          </span>
          <span className="text-xs text-muted-foreground font-mono">
            /{row.original.slug}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: "stack",
    header: "Tech Stack",
    cell: ({ row }) => {
      const stack = row.original.stack || [];
      return (
        <div className="flex flex-wrap gap-1 max-w-[220px]">
          {stack.slice(0, 3).map((item) => {
            const Icon = getTechIcon(item);
            return (
              <span
                key={item}
                className="inline-flex items-center gap-1 text-[11px] px-2 py-0.5 bg-muted rounded font-medium"
              >
                <Icon className="size-3 shrink-0" />
                <span>{item}</span>
              </span>
            );
          })}
          {stack.length > 3 && (
            <span className="text-[11px] px-1 text-muted-foreground self-center">
              +{stack.length - 3}
            </span>
          )}
        </div>
      );
    },
  },
  {
    accessorKey: "year",
    header: "Tahun",
    cell: ({ row }) => {
      return <span className="text-sm">{row.original.year}</span>;
    },
  },
  {
    accessorKey: "featured",
    header: "Featured",
    cell: ({ row }) => {
      return row.original.featured ? (
        <Badge variant="default" className="text-xs">
          Featured
        </Badge>
      ) : (
        <Badge variant="outline" className="text-xs text-muted-foreground">
          Normal
        </Badge>
      );
    },
  },
  {
    id: "actions",
    header: () => <div className="text-right pr-2">Aksi</div>,
    cell: ({ row }) => {
      return (
        <div className="flex justify-end items-center gap-1">
          <Button variant="ghost" size="icon" asChild>
            <Link href={`/dashboard/projects/${row.original.slug}`}>
              <PenBoxIcon className="size-4" />
            </Link>
          </Button>

          <DeleteProjectButton
            projectId={row.original.id}
            projectTitle={row.original.title}
          />
        </div>
      );
    },
  },
];
