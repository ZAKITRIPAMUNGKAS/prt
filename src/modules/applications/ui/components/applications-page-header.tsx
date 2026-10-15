"use client";

import { Button } from "@/components/ui/button";
import { PlusIcon, Share2 } from "lucide-react";
import { ShareLinkDialog } from "./share-link-dialog";

interface ApplicationsPageHeaderProps {
  onAddNew: () => void;
}

export const ApplicationsPageHeader = ({
  onAddNew,
}: ApplicationsPageHeaderProps) => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 w-full min-w-0">
      <div className="min-w-0">
        <h1 className="text-2xl font-bold tracking-tight text-foreground truncate">
          Lamaran Kerja
        </h1>
        <p className="text-muted-foreground text-sm mt-0.5">
          Pantau progress, status seleksi, dan tindak lanjut seluruh lamaran kerja Anda
        </p>
      </div>
      <div className="flex items-center gap-2 shrink-0 self-start sm:self-auto flex-wrap">
        <ShareLinkDialog>
          <Button
            type="button"
            variant="outline"
            className="shadow-2xs gap-1.5 bg-background"
          >
            <Share2 className="size-4 text-muted-foreground" />
            <span>Bagikan</span>
          </Button>
        </ShareLinkDialog>

        <Button
          type="button"
          onClick={onAddNew}
          className="shadow-2xs gap-1.5"
        >
          <PlusIcon className="size-4" />
          <span>Tambah Lamaran</span>
        </Button>
      </div>
    </div>
  );
};
