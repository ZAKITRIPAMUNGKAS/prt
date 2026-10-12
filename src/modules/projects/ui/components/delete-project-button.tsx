"use client";

import { toast } from "sonner";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTRPC } from "@/trpc/client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useConfirm } from "@/hooks/use-confirm";

interface DeleteProjectButtonProps {
  projectId: string;
  projectTitle: string;
}

export function DeleteProjectButton({
  projectId,
  projectTitle,
}: DeleteProjectButtonProps) {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  const [ConfirmDialog, confirm] = useConfirm(
    "Hapus Proyek",
    `Apakah Anda yakin ingin menghapus "${projectTitle}"? Tindakan ini tidak dapat dibatalkan.`
  );

  const deleteProject = useMutation(trpc.projects.remove.mutationOptions());

  const handleDelete = async () => {
    const ok = await confirm();
    if (!ok) return;

    deleteProject.mutate(
      { id: projectId },
      {
        onSuccess: async () => {
          await queryClient.invalidateQueries(
            trpc.projects.getManyAdmin.queryOptions({})
          );
          await queryClient.invalidateQueries(
            trpc.projects.getMany.queryOptions({})
          );
          toast.success("Proyek berhasil dihapus");
        },
        onError: (error) => {
          toast.error(error.message || "Gagal menghapus proyek");
        },
      }
    );
  };

  return (
    <>
      <ConfirmDialog />
      <Button
        variant="ghost"
        size="icon"
        onClick={(e) => {
          e.stopPropagation();
          handleDelete();
        }}
        className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
        title="Hapus proyek"
      >
        <Trash2 className="size-4" />
      </Button>
    </>
  );
}
