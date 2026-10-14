"use client";

import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";

interface ApplicationsPageHeaderProps {
  onAddNew: () => void;
}

export const ApplicationsPageHeader = ({
  onAddNew,
}: ApplicationsPageHeaderProps) => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Lamaran Kerja</h1>
        <p className="text-muted-foreground text-sm mt-0.5">
          Pantau progress, status seleksi, dan tindak lanjut seluruh lamaran kerja Anda
        </p>
      </div>
      <Button onClick={onAddNew} className="shrink-0 self-start sm:self-auto shadow-xs">
        <PlusIcon className="size-4 mr-1.5" />
        Tambah Lamaran
      </Button>
    </div>
  );
};
