"use client";

import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { useTRPC } from "@/trpc/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Plus,
  Music,
  Play,
  Pause,
  Pencil,
  Trash2,
  ChevronUp,
  ChevronDown,
  Download,
  Sparkles,
  Disc3,
  ExternalLink,
  Volume2,
} from "lucide-react";
import { toast } from "sonner";
import { PlaylistFormDialog } from "../components/playlist-form-dialog";
import type { PlaylistTrack } from "@/db/schema";
import { cn } from "@/lib/utils";

export function DashboardPlaylistView() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedTrack, setSelectedTrack] = useState<PlaylistTrack | null>(null);

  // Deletion dialog state
  const [deleteId, setDeleteId] = useState<string | null>(null);

  // Preview Audio Player state
  const [previewTrackId, setPreviewTrackId] = useState<string | null>(null);
  const [isPreviewPlaying, setIsPreviewPlaying] = useState(false);
  const previewAudioRef = useRef<HTMLAudioElement | null>(null);

  // Cleanup preview audio on unmount
  useEffect(() => {
    return () => {
      if (previewAudioRef.current) {
        previewAudioRef.current.pause();
        previewAudioRef.current = null;
      }
    };
  }, []);

  const trpc = useTRPC();
  const queryClient = useQueryClient();

  const { data: tracks, isLoading } = useQuery(trpc.playlist.getMany.queryOptions());

  const updateMutation = useMutation({
    ...trpc.playlist.update.mutationOptions(),
    onSuccess: () => {
      void queryClient.invalidateQueries(trpc.playlist.getMany.queryFilter());
      void queryClient.invalidateQueries(trpc.playlist.getAll.queryFilter());
    },
  });

  const deleteMutation = useMutation({
    ...trpc.playlist.delete.mutationOptions(),
    onSuccess: () => {
      toast.success("Lagu berhasil dihapus dari playlist");
      void queryClient.invalidateQueries(trpc.playlist.getMany.queryFilter());
      void queryClient.invalidateQueries(trpc.playlist.getAll.queryFilter());
      setDeleteId(null);
    },
    onError: (err) => {
      toast.error(err.message || "Gagal menghapus lagu");
    },
  });

  const reorderMutation = useMutation({
    ...trpc.playlist.reorder.mutationOptions(),
    onSuccess: () => {
      void queryClient.invalidateQueries(trpc.playlist.getMany.queryFilter());
      void queryClient.invalidateQueries(trpc.playlist.getAll.queryFilter());
    },
  });

  const syncDefaultMutation = useMutation({
    ...trpc.playlist.syncDefault.mutationOptions(),
    onSuccess: () => {
      toast.success("Playlist starter default berhasil disinkronkan!");
      void queryClient.invalidateQueries(trpc.playlist.getMany.queryFilter());
      void queryClient.invalidateQueries(trpc.playlist.getAll.queryFilter());
    },
    onError: (err) => {
      toast.error(err.message || "Gagal menyinkronkan playlist");
    },
  });

  // Handle preview playback
  const handleTogglePreview = (track: PlaylistTrack) => {
    if (previewTrackId === track.id) {
      if (isPreviewPlaying) {
        previewAudioRef.current?.pause();
        setIsPreviewPlaying(false);
      } else {
        previewAudioRef.current?.play().then(() => setIsPreviewPlaying(true)).catch(() => {});
      }
    } else {
      if (previewAudioRef.current) {
        previewAudioRef.current.pause();
      }
      const audio = new Audio(track.src);
      previewAudioRef.current = audio;
      setPreviewTrackId(track.id);
      setIsPreviewPlaying(true);

      audio.play().catch(() => {
        setIsPreviewPlaying(false);
        toast.error("Tidak dapat memutar audio preview");
      });

      audio.onended = () => {
        setIsPreviewPlaying(false);
      };
    }
  };

  // Reorder up / down
  const handleMove = async (index: number, direction: "up" | "down") => {
    if (!tracks) return;
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= tracks.length) return;

    const newTracks = [...tracks];
    const temp = newTracks[index];
    newTracks[index] = newTracks[targetIndex];
    newTracks[targetIndex] = temp;

    const items = newTracks.map((t, idx) => ({
      id: t.id,
      order: idx,
    }));

    await reorderMutation.mutateAsync({ items });
    toast.success("Urutan lagu diperbarui");
  };

  // Toggle active status
  const handleToggleActive = async (track: PlaylistTrack) => {
    try {
      await updateMutation.mutateAsync({
        id: track.id,
        isActive: !track.isActive,
      });
      toast.success(
        track.isActive
          ? `Lagu "${track.title}" dinonaktifkan`
          : `Lagu "${track.title}" diaktifkan`
      );
    } catch {
      toast.error("Gagal mengubah status lagu");
    }
  };

  // Export JSON to folder (download to computer)
  const handleExportJson = () => {
    if (!tracks || tracks.length === 0) {
      toast.error("Tidak ada lagu untuk diekspor");
      return;
    }

    const exportData = tracks.map((t: PlaylistTrack) => ({
      id: t.id,
      title: t.title,
      artist: t.artist,
      src: t.src,
      cover: t.cover,
      order: t.order,
      isActive: t.isActive,
    }));

    const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(
      JSON.stringify(exportData, null, 2)
    )}`;
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", jsonString);
    downloadAnchor.setAttribute("download", "playlist.json");
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();

    toast.success("File playlist.json berhasil didownload!");
  };

  return (
    <div className="flex flex-col gap-6 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b pb-5">
        <div>
          <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
            <Music className="size-6 text-primary" />
            Playlist Musik Portofolio
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Kelola daftar lagu audio player portofolio. Lagu yang berstatus aktif akan diputar di website publik.
          </p>
        </div>

        <div className="flex items-center flex-wrap gap-2">
          {(!tracks || tracks.length === 0) && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => syncDefaultMutation.mutate()}
              disabled={syncDefaultMutation.isPending}
              className="gap-1.5"
            >
              <Sparkles className="size-4 text-amber-500" />
              <span>Muat Starter Default</span>
            </Button>
          )}

          <Button
            variant="outline"
            size="sm"
            onClick={handleExportJson}
            disabled={!tracks || tracks.length === 0}
            className="gap-1.5"
          >
            <Download className="size-4" />
            <span>Ekspor JSON (Folder)</span>
          </Button>

          <Button
            size="sm"
            onClick={() => {
              setSelectedTrack(null);
              setIsFormOpen(true);
            }}
            className="gap-1.5 shadow-sm"
          >
            <Plus className="size-4" />
            <span>Tambah Lagu</span>
          </Button>
        </div>
      </div>

      {/* Track List */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center p-12 border rounded-2xl bg-card/50">
          <Disc3 className="size-8 text-primary animate-spin" />
          <p className="text-sm text-muted-foreground mt-3">Memuat playlist musik...</p>
        </div>
      ) : !tracks || tracks.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-12 border border-dashed rounded-2xl bg-card/30 text-center">
          <div className="size-14 rounded-full bg-primary/10 flex items-center justify-center mb-3">
            <Music className="size-7 text-primary" />
          </div>
          <h3 className="text-base font-semibold">Belum ada lagu di playlist</h3>
          <p className="text-sm text-muted-foreground max-w-sm mt-1 mb-5">
            Tambahkan lagu favorit Anda atau gunakan starter playlist default agar floating music player langsung memiliki lagu.
          </p>
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => syncDefaultMutation.mutate()}
              disabled={syncDefaultMutation.isPending}
              className="gap-2"
            >
              <Sparkles className="size-4 text-amber-500" />
              <span>Gunakan Starter Default</span>
            </Button>
            <Button
              size="sm"
              onClick={() => {
                setSelectedTrack(null);
                setIsFormOpen(true);
              }}
              className="gap-2"
            >
              <Plus className="size-4" />
              <span>Tambah Lagu Baru</span>
            </Button>
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground px-1 flex items-center justify-between">
            <span>Daftar Lagu ({tracks.length})</span>
            <span>Urutan & Status</span>
          </div>

          <div className="grid gap-3">
            {tracks.map((track: PlaylistTrack, idx: number) => {
              const isCurrentPreview = previewTrackId === track.id && isPreviewPlaying;

              return (
                <div
                  key={track.id}
                  className={cn(
                    "flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 sm:p-4 rounded-xl border bg-card/60 backdrop-blur-sm transition-all hover:border-primary/40",
                    !track.isActive && "opacity-60 bg-muted/20"
                  )}
                >
                  {/* Left: Thumbnail, Track Info & Preview Play */}
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    {/* Index & Reorder Buttons */}
                    <div className="flex flex-col items-center gap-0.5 shrink-0">
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => handleMove(idx, "up")}
                        disabled={idx === 0 || reorderMutation.isPending}
                        className="size-6 text-muted-foreground hover:text-foreground"
                        aria-label="Geser ke atas"
                      >
                        <ChevronUp className="size-3.5" />
                      </Button>
                      <span className="text-xs font-bold text-muted-foreground w-4 text-center">
                        {idx + 1}
                      </span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => handleMove(idx, "down")}
                        disabled={idx === tracks.length - 1 || reorderMutation.isPending}
                        className="size-6 text-muted-foreground hover:text-foreground"
                        aria-label="Geser ke bawah"
                      >
                        <ChevronDown className="size-3.5" />
                      </Button>
                    </div>

                    {/* Album Art with Preview Overlay */}
                    <div className="relative size-12 shrink-0 rounded-lg overflow-hidden border bg-neutral-900 group">
                      {track.cover ? (
                        <Image
                          src={track.cover}
                          alt={track.title}
                          width={48}
                          height={48}
                          unoptimized
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Music className="size-5 text-muted-foreground" />
                        </div>
                      )}
                      {/* Play Preview overlay */}
                      <button
                        type="button"
                        onClick={() => handleTogglePreview(track)}
                        className={cn(
                          "absolute inset-0 bg-black/60 flex items-center justify-center text-white transition-opacity",
                          isCurrentPreview ? "opacity-100" : "opacity-0 group-hover:opacity-100"
                        )}
                        aria-label={isCurrentPreview ? "Jeda preview" : "Putar preview"}
                      >
                        {isCurrentPreview ? (
                          <Pause className="size-4 fill-current text-primary" />
                        ) : (
                          <Play className="size-4 fill-current ml-0.5" />
                        )}
                      </button>
                    </div>

                    {/* Track Titles & Audio details */}
                    <div className="flex flex-col min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-sm truncate leading-tight">
                          {track.title}
                        </span>
                        {isCurrentPreview && (
                          <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[10px] font-medium bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                            <Volume2 className="size-2.5 animate-pulse" />
                            Preview
                          </span>
                        )}
                      </div>
                      <span className="text-xs text-muted-foreground truncate mt-0.5">
                        {track.artist || "Tanpa nama artis"}
                      </span>
                      <a
                        href={track.src}
                        target="_blank"
                        rel="noreferrer"
                        className="text-[11px] text-primary/80 hover:underline truncate max-w-md flex items-center gap-1 mt-0.5"
                      >
                        <span>{track.src}</span>
                        <ExternalLink className="size-2.5 shrink-0 inline" />
                      </a>
                    </div>
                  </div>

                  {/* Right: Active Toggle & Actions */}
                  <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0">
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-muted-foreground">
                        {track.isActive ? "Aktif" : "Nonaktif"}
                      </span>
                      <Switch
                        checked={track.isActive}
                        onCheckedChange={() => handleToggleActive(track)}
                        aria-label="Status aktif"
                      />
                    </div>

                    <div className="flex items-center gap-1">
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                          setSelectedTrack(track);
                          setIsFormOpen(true);
                        }}
                        className="size-8 text-muted-foreground hover:text-foreground"
                        aria-label="Edit lagu"
                      >
                        <Pencil className="size-4" />
                      </Button>

                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => setDeleteId(track.id)}
                        className="size-8 text-red-500 hover:text-red-600 hover:bg-red-500/10"
                        aria-label="Hapus lagu"
                      >
                        <Trash2 className="size-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Form Dialog (Add/Edit) */}
      <PlaylistFormDialog
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        track={selectedTrack}
      />

      {/* Delete Confirmation Alert Dialog */}
      <AlertDialog
        open={!!deleteId}
        onOpenChange={(open) => !open && setDeleteId(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus Lagu dari Playlist?</AlertDialogTitle>
            <AlertDialogDescription>
              Tindakan ini akan menghapus lagu dari playlist audio player portofolio.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (deleteId) {
                  deleteMutation.mutate({ id: deleteId });
                }
              }}
              className="bg-red-500 hover:bg-red-600 text-white"
            >
              Hapus
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

export function PlaylistLoadingStatus() {
  return (
    <div className="flex flex-col gap-6 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full">
      <div className="flex items-center justify-center p-12 border rounded-2xl bg-card/50">
        <Disc3 className="size-8 text-primary animate-spin" />
        <p className="text-sm text-muted-foreground mt-3">Memuat playlist...</p>
      </div>
    </div>
  );
}

export function PlaylistErrorStatus() {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center">
      <p className="text-sm text-destructive font-medium">
        Gagal memuat playlist musik.
      </p>
    </div>
  );
}
