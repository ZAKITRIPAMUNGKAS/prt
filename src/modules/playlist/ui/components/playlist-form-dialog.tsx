"use client";

import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { useTRPC } from "@/trpc/client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Upload, Music, Image as ImageIcon, Loader2 } from "lucide-react";
import { S3Client, type AllowedContentType } from "@/modules/s3/lib/upload-client";
import { keyToUrl } from "@/modules/s3/lib/key-to-url";
import { DEFAULT_MUSIC_UPLOAD_FOLDER, DEFAULT_PHOTOS_UPLOAD_FOLDER } from "@/constants";
import type { PlaylistTrack } from "@/db/schema";

interface PlaylistFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  track?: PlaylistTrack | null;
  onSuccess?: () => void;
}

export function PlaylistFormDialog({
  open,
  onOpenChange,
  track,
  onSuccess,
}: PlaylistFormDialogProps) {
  const isEditing = !!track;

  const [title, setTitle] = useState("");
  const [artist, setArtist] = useState("");
  const [src, setSrc] = useState("");
  const [cover, setCover] = useState("");
  const [lyrics, setLyrics] = useState("");
  const [order, setOrder] = useState(0);
  const [isActive, setIsActive] = useState(true);

  const [isUploadingAudio, setIsUploadingAudio] = useState(false);
  const [audioUploadProgress, setAudioUploadProgress] = useState(0);

  const [isUploadingCover, setIsUploadingCover] = useState(false);
  const [coverUploadProgress, setCoverUploadProgress] = useState(0);

  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const createMutation = useMutation(trpc.playlist.create.mutationOptions());
  const updateMutation = useMutation(trpc.playlist.update.mutationOptions());
  const presignedMutation = useMutation(trpc.s3.createPresignedUrl.mutationOptions());

  useEffect(() => {
    if (track) {
      setTitle(track.title);
      setArtist(track.artist || "");
      setSrc(track.src);
      setCover(track.cover || "");
      setLyrics(track.lyrics || "");
      setOrder(track.order || 0);
      setIsActive(track.isActive);
    } else {
      setTitle("");
      setArtist("");
      setSrc("");
      setCover("");
      setLyrics("");
      setOrder(0);
      setIsActive(true);
    }
  }, [track, open]);

  const handleAudioUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploadingAudio(true);
      setAudioUploadProgress(10);

      const client = new S3Client();
      const result = await client.upload({
        file,
        folder: DEFAULT_MUSIC_UPLOAD_FOLDER,
        onProgress: (p) => setAudioUploadProgress(p),
        getUploadUrl: async ({ filename, contentType, folder }) => {
          const res = await presignedMutation.mutateAsync({
            filename,
            contentType: contentType as AllowedContentType,
            size: file.size,
            folder,
          });
          return {
            uploadUrl: res.presignedUrl,
            publicUrl: keyToUrl(res.key),
          };
        },
      });

      setSrc(result.publicUrl);
      toast.success("File audio berhasil diupload!");
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Gagal mengupload audio";
      toast.error(message);
    } finally {
      setIsUploadingAudio(false);
      setAudioUploadProgress(0);
      e.target.value = "";
    }
  };

  const handleCoverUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploadingCover(true);
      setCoverUploadProgress(10);

      const client = new S3Client();
      const result = await client.upload({
        file,
        folder: DEFAULT_PHOTOS_UPLOAD_FOLDER,
        onProgress: (p) => setCoverUploadProgress(p),
        getUploadUrl: async ({ filename, contentType, folder }) => {
          const res = await presignedMutation.mutateAsync({
            filename,
            contentType: contentType as AllowedContentType,
            size: file.size,
            folder,
          });
          return {
            uploadUrl: res.presignedUrl,
            publicUrl: keyToUrl(res.key),
          };
        },
      });

      setCover(result.publicUrl);
      toast.success("Cover album berhasil diupload!");
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Gagal mengupload gambar cover";
      toast.error(message);
    } finally {
      setIsUploadingCover(false);
      setCoverUploadProgress(0);
      e.target.value = "";
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      toast.error("Judul lagu wajib diisi");
      return;
    }
    if (!src.trim()) {
      toast.error("File atau URL audio wajib diisi");
      return;
    }

    try {
      if (isEditing && track) {
        await updateMutation.mutateAsync({
          id: track.id,
          title: title.trim(),
          artist: artist.trim(),
          src: src.trim(),
          cover: cover.trim() || null,
          lyrics: lyrics.trim() || null,
          order: Number(order) || 0,
          isActive,
        });
        toast.success("Lagu berhasil diperbarui!");
      } else {
        await createMutation.mutateAsync({
          title: title.trim(),
          artist: artist.trim(),
          src: src.trim(),
          cover: cover.trim() || null,
          lyrics: lyrics.trim() || null,
          order: Number(order) || 0,
          isActive,
        });
        toast.success("Lagu berhasil ditambahkan!");
      }

      void queryClient.invalidateQueries(trpc.playlist.getMany.queryFilter());
      void queryClient.invalidateQueries(trpc.playlist.getAll.queryFilter());
      onOpenChange(false);
      onSuccess?.();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Terjadi kesalahan saat menyimpan";
      toast.error(message);
    }
  };

  const isSaving = createMutation.isPending || updateMutation.isPending;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[480px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>{isEditing ? "Edit Lagu" : "Tambah Lagu Baru"}</DialogTitle>
            <DialogDescription>
              Isi data lagu yang ingin diputar di floating music player portofolio.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            {/* Title */}
            <div className="grid gap-2">
              <Label htmlFor="title">Judul Lagu *</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Contoh: Midnight Beats"
                required
              />
            </div>

            {/* Artist */}
            <div className="grid gap-2">
              <Label htmlFor="artist">Artis / Penampil</Label>
              <Input
                id="artist"
                value={artist}
                onChange={(e) => setArtist(e.target.value)}
                placeholder="Contoh: Tepe Radio • Lo-fi Vibe"
              />
            </div>

            {/* Audio Source */}
            <div className="grid gap-2">
              <Label htmlFor="src">File / URL Audio *</Label>
              <div className="flex gap-2">
                <Input
                  id="src"
                  value={src}
                  onChange={(e) => setSrc(e.target.value)}
                  placeholder="https://... atau upload file MP3"
                  required
                />
                <label className="relative cursor-pointer">
                  <input
                    type="file"
                    accept="audio/*,.mp3,.wav,.ogg,.m4a"
                    className="sr-only"
                    onChange={handleAudioUpload}
                    disabled={isUploadingAudio}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    className="shrink-0"
                    disabled={isUploadingAudio}
                    asChild
                  >
                    <span>
                      {isUploadingAudio ? (
                        <Loader2 className="size-4 animate-spin" />
                      ) : (
                        <Upload className="size-4" />
                      )}
                    </span>
                  </Button>
                </label>
              </div>
              {isUploadingAudio && (
                <p className="text-xs text-muted-foreground flex items-center gap-1.5">
                  <Music className="size-3 animate-bounce" />
                  Mengupload audio... ({audioUploadProgress}%)
                </p>
              )}
            </div>

            {/* Cover Album */}
            <div className="grid gap-2">
              <Label htmlFor="cover">Gambar Cover Album (Opsional)</Label>
              <div className="flex gap-2">
                <Input
                  id="cover"
                  value={cover}
                  onChange={(e) => setCover(e.target.value)}
                  placeholder="https://... atau upload gambar"
                />
                <label className="relative cursor-pointer">
                  <input
                    type="file"
                    accept="image/*"
                    className="sr-only"
                    onChange={handleCoverUpload}
                    disabled={isUploadingCover}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    className="shrink-0"
                    disabled={isUploadingCover}
                    asChild
                  >
                    <span>
                      {isUploadingCover ? (
                        <Loader2 className="size-4 animate-spin" />
                      ) : (
                        <ImageIcon className="size-4" />
                      )}
                    </span>
                  </Button>
                </label>
              </div>
              {isUploadingCover && (
                <p className="text-xs text-muted-foreground flex items-center gap-1.5">
                  <ImageIcon className="size-3 animate-bounce" />
                  Mengupload gambar... ({coverUploadProgress}%)
                </p>
              )}
            </div>

            {/* Lyrics Field */}
            <div className="grid gap-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="lyrics">Lirik Lagu (Opsional - Format LRC / Teks)</Label>
                <span className="text-[11px] text-muted-foreground">[mm:ss.xx] Baris</span>
              </div>
              <Textarea
                id="lyrics"
                value={lyrics}
                onChange={(e) => setLyrics(e.target.value)}
                placeholder="[00:04.00] Lirik baris pertama&#10;[00:09.00] Lirik baris kedua..."
                className="font-mono text-xs max-h-32 min-h-20 resize-y"
              />
            </div>

            {/* Order & Active Switch */}
            <div className="flex items-center justify-between pt-2">
              <div className="flex items-center gap-2">
                <Label htmlFor="order" className="text-xs text-muted-foreground">
                  Urutan:
                </Label>
                <Input
                  id="order"
                  type="number"
                  value={order}
                  onChange={(e) => setOrder(Number(e.target.value))}
                  className="w-20 h-8 text-center text-xs"
                />
              </div>

              <div className="flex items-center gap-2">
                <Label htmlFor="is-active" className="text-xs font-medium cursor-pointer">
                  {isActive ? "Aktif" : "Nonaktif"}
                </Label>
                <Switch
                  id="is-active"
                  checked={isActive}
                  onCheckedChange={setIsActive}
                />
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSaving}
            >
              Batal
            </Button>
            <Button type="submit" disabled={isSaving || isUploadingAudio || isUploadingCover}>
              {isSaving && <Loader2 className="size-4 animate-spin mr-2" />}
              {isEditing ? "Simpan Perubahan" : "Tambah Lagu"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
