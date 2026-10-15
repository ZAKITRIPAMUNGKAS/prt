"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Share2,
  Copy,
  Check,
  ExternalLink,
  Eye,
  ShieldCheck,
} from "lucide-react";
import { toast } from "sonner";

interface ShareLinkDialogProps {
  children?: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export const ShareLinkDialog = ({
  children,
  open: controlledOpen,
  onOpenChange: controlledOnOpenChange,
}: ShareLinkDialogProps) => {
  const [internalOpen, setInternalOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const isControlled = controlledOpen !== undefined;
  const open = isControlled ? controlledOpen : internalOpen;
  const setOpen = isControlled
    ? (val: boolean) => controlledOnOpenChange?.(val)
    : setInternalOpen;

  const getShareUrl = () => {
    if (typeof window !== "undefined") {
      return `${window.location.origin}/applications/share`;
    }
    return "https://me.tepegrafi.id/applications/share";
  };

  const shareUrl = getShareUrl();

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      toast.success("Link berhasil disalin ke clipboard!");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Gagal menyalin link.");
    }
  };

  const handleOpenPage = () => {
    window.open("/applications/share", "_blank");
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {children && <DialogTrigger asChild>{children}</DialogTrigger>}
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <div className="size-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
              <Share2 className="size-4" />
            </div>
            <div>
              <DialogTitle className="text-base font-semibold">
                Bagikan Pelacak Lamaran
              </DialogTitle>
              <DialogDescription className="text-xs mt-0.5">
                Bagikan link pratinjau publik untuk dilihat oleh orang lain
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-4 pt-2">
          {/* Read-only Security Banner */}
          <div className="rounded-lg bg-emerald-500/10 border border-emerald-500/20 p-3 text-xs text-emerald-800 dark:text-emerald-300 space-y-1">
            <div className="flex items-center gap-1.5 font-semibold">
              <ShieldCheck className="size-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
              <span>Aman & Hanya-Lihat (Read-Only)</span>
            </div>
            <p className="text-[11px] leading-relaxed opacity-90 pl-5.5">
              Siapa pun yang memiliki link ini hanya dapat melihat daftar dan ringkasan lamaran kerja Anda. Mereka <strong>tidak bisa mengubah, menambah, atau menghapus</strong> data apa pun.
            </p>
          </div>

          {/* Copy Link Input */}
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-foreground">
              Link Berbagi
            </label>
            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <Input
                  readOnly
                  value={shareUrl}
                  className="pr-8 text-xs font-mono h-9 bg-muted/40 cursor-text select-all"
                  onClick={(e) => (e.target as HTMLInputElement).select()}
                />
                <Eye className="size-3.5 absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
              </div>
              <Button
                type="button"
                onClick={handleCopy}
                size="sm"
                className="h-9 gap-1.5 shrink-0"
              >
                {copied ? (
                  <>
                    <Check className="size-3.5 text-emerald-300" />
                    <span>Tersalin</span>
                  </>
                ) : (
                  <>
                    <Copy className="size-3.5" />
                    <span>Salin</span>
                  </>
                )}
              </Button>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center justify-between pt-2 border-t">
            <span className="text-[11px] text-muted-foreground">
              Buka untuk cek tampilan publik
            </span>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleOpenPage}
              className="gap-1.5 text-xs h-8"
            >
              <ExternalLink className="size-3.5" />
              <span>Buka Pratinjau</span>
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
