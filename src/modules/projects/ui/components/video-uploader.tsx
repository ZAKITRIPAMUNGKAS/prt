"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { FileRejection, useDropzone } from "react-dropzone";
import { toast } from "sonner";
import { Film, Upload, XIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useTRPC } from "@/trpc/client";
import { useMutation } from "@tanstack/react-query";
import { s3Client } from "@/modules/s3/lib/upload-client";
import { VIDEO_SIZE_LIMIT } from "@/constants";
import { getProjectVideoUrl } from "../../lib/utils";

interface VideoUploaderProps {
  value?: string | null;
  onUploadSuccess?: (key: string) => void;
  onRemove?: () => void;
  folder?: string;
  disabled?: boolean;
  onUploadStateChange?: (uploading: boolean) => void;
}

export const VideoUploader = ({
  value,
  onUploadSuccess,
  onRemove,
  folder = "projects",
  disabled = false,
  onUploadStateChange,
}: VideoUploaderProps) => {
  const [fileState, setFileState] = useState<{
    file?: File;
    uploading: boolean;
    progress: number;
    error: boolean;
    objectUrl?: string;
  }>({
    uploading: false,
    progress: 0,
    error: false,
  });

  const objectUrlRef = useRef<string | null>(null);
  const uploadInFlight = useRef(false);

  const trpc = useTRPC();
  const createPresignedUrl = useMutation(
    trpc.s3.createPresignedUrl.mutationOptions()
  );
  const deleteFile = useMutation(trpc.s3.deleteFile.mutationOptions());

  const uploadFile = useCallback(
    async (file: File) => {
      if (uploadInFlight.current || disabled) return;
      uploadInFlight.current = true;
      onUploadStateChange?.(true);

      setFileState((prev) => ({
        ...prev,
        file,
        uploading: true,
        progress: 0,
        error: false,
      }));

      try {
        const { publicUrl } = await s3Client.upload({
          file,
          folder,
          onProgress: (progress) => {
            setFileState((prev) => ({ ...prev, progress }));
          },
          getUploadUrl: async ({ filename, contentType, folder }) => {
            const data = await createPresignedUrl.mutateAsync({
              filename,
              contentType,
              size: file.size,
              folder,
            });

            return {
              uploadUrl: data.presignedUrl,
              publicUrl: data.key,
            };
          },
        });

        setFileState((prev) => ({
          ...prev,
          uploading: false,
          progress: 100,
          error: false,
        }));

        toast.success("Video preview berhasil diunggah");
        onUploadSuccess?.(publicUrl);
      } catch (error) {
        setFileState((prev) => ({
          ...prev,
          uploading: false,
          error: true,
          progress: 0,
        }));

        toast.error(
          `Gagal mengunggah video: ${
            error instanceof Error ? error.message : "Terjadi kesalahan"
          }`
        );
      } finally {
        uploadInFlight.current = false;
        onUploadStateChange?.(false);
      }
    },
    [createPresignedUrl, disabled, folder, onUploadStateChange, onUploadSuccess]
  );

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (uploadInFlight.current || disabled || deleteFile.isPending) return;
      const file = acceptedFiles[0];
      if (!file) return;

      if (objectUrlRef.current) {
        URL.revokeObjectURL(objectUrlRef.current);
      }
      const newUrl = URL.createObjectURL(file);
      objectUrlRef.current = newUrl;

      setFileState({
        file,
        uploading: false,
        progress: 0,
        error: false,
        objectUrl: newUrl,
      });

      uploadFile(file);
    },
    [deleteFile.isPending, disabled, uploadFile]
  );

  useEffect(() => {
    return () => {
      if (objectUrlRef.current) {
        URL.revokeObjectURL(objectUrlRef.current);
      }
    };
  }, []);

  const onDropRejected = useCallback((fileRejections: FileRejection[]) => {
    if (fileRejections.length > 0) {
      const isTooLarge = fileRejections.some((r) =>
        r.errors.some((e) => e.code === "file-too-large")
      );
      if (isTooLarge) {
        toast.error(
          `Ukuran video melebihi batas ${VIDEO_SIZE_LIMIT / 1024 / 1024} MB`
        );
        return;
      }
      toast.error("Format file video tidak didukung. Gunakan MP4 atau WebM.");
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive, open } = useDropzone({
    onDrop,
    onDropRejected,
    maxFiles: 1,
    multiple: false,
    maxSize: VIDEO_SIZE_LIMIT,
    disabled: disabled || fileState.uploading || deleteFile.isPending,
    noClick: true,
    noKeyboard: true,
    accept: {
      "video/mp4": [".mp4"],
      "video/webm": [".webm"],
    },
  });

  const displayVideoUrl = fileState.objectUrl
    ? fileState.objectUrl
    : value
    ? getProjectVideoUrl(value)
    : null;

  const hasVideo = !!displayVideoUrl;
  const isBusy = disabled || fileState.uploading || deleteFile.isPending;

  const handleRemove = async () => {
    if (isBusy) return;
    if (objectUrlRef.current) {
      URL.revokeObjectURL(objectUrlRef.current);
      objectUrlRef.current = null;
    }
    setFileState({
      uploading: false,
      progress: 0,
      error: false,
    });
    onRemove?.();
  };

  return (
    <div className="w-full max-w-2xl space-y-3">
      <div
        {...getRootProps()}
        className={cn(
          "group relative overflow-hidden rounded-xl transition-all duration-200 border border-border",
          isDragActive
            ? "border-dashed border-primary bg-primary/5"
            : hasVideo
            ? "border-border bg-background hover:border-primary/50"
            : "border-dashed border-muted-foreground/25 bg-muted/30 hover:border-primary hover:bg-primary/5"
        )}
      >
        <input {...getInputProps()} className="sr-only" />

        {hasVideo ? (
          <div className="relative aspect-video w-full bg-black/90 flex items-center justify-center">
            <video
              src={displayVideoUrl}
              muted
              loop
              playsInline
              controls
              className="h-full w-full object-contain"
            />

            {fileState.uploading && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/60">
                <div className="relative">
                  <svg className="size-16 -rotate-90" viewBox="0 0 64 64">
                    <circle
                      cx="32"
                      cy="32"
                      r="28"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="4"
                      className="text-white/20"
                    />
                    <circle
                      cx="32"
                      cy="32"
                      r="28"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="4"
                      strokeDasharray={`${2 * Math.PI * 28}`}
                      strokeDashoffset={`${
                        2 * Math.PI * 28 * (1 - fileState.progress / 100)
                      }`}
                      className="text-white transition-all duration-300"
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-sm font-medium text-white">
                      {Math.round(fileState.progress)}%
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="flex min-h-40 w-full flex-col items-center justify-center gap-3 p-5 text-center">
            <div className="rounded-full bg-primary/10 p-3">
              <Film className="size-6 text-primary" />
            </div>

            <div className="space-y-1">
              <h3 className="text-sm font-medium">Unggah Video Preview</h3>
              <p className="text-xs text-muted-foreground">
                Tarik dan lepas video ke sini, atau klik untuk memilih file
              </p>
            </div>

            <Button
              variant="outline"
              size="sm"
              type="button"
              onClick={open}
              disabled={isBusy}
            >
              <Upload className="mr-1.5 size-3.5" />
              Pilih File Video
            </Button>
          </div>
        )}
      </div>

      {hasVideo && (
        <div className="flex flex-wrap gap-2">
          <Button
            onClick={open}
            disabled={isBusy}
            variant="outline"
            size="sm"
            type="button"
          >
            <Upload className="size-3.5 mr-1" /> Ganti Video
          </Button>
          <Button
            onClick={handleRemove}
            disabled={isBusy}
            variant="ghost"
            size="sm"
            type="button"
          >
            <XIcon className="size-3.5 mr-1" /> Hapus Video
          </Button>
        </div>
      )}

      <p className="text-xs text-muted-foreground">
        Format: MP4, WebM · Maksimal {VIDEO_SIZE_LIMIT / 1024 / 1024} MB. Video
        akan diputar sebagai teaser saat kartu di-hover di desktop.
      </p>

      {fileState.error && (
        <Alert variant="destructive" className="mt-2">
          <AlertTitle>Unggahan Gagal</AlertTitle>
          <AlertDescription>
            <p>Terjadi kendala saat mengunggah video. Silakan coba lagi.</p>
            {fileState.file && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="mt-2"
                disabled={isBusy}
                onClick={() => fileState.file && uploadFile(fileState.file)}
              >
                Coba Lagi
              </Button>
            )}
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
};
