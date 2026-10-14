"use client";

import { useState } from "react";
import { useTRPC } from "@/trpc/client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import {
  APPLICATION_STATUSES,
  APPLICATION_STATUS_COLORS,
  APPLICATION_STATUS_LABELS,
  ApplicationStatus,
} from "../../types";
import { ChevronDown, Loader2 } from "lucide-react";

interface StatusDropdownProps {
  id: string;
  currentStatus: ApplicationStatus;
  companyName: string;
}

export const StatusDropdown = ({
  id,
  currentStatus,
  companyName,
}: StatusDropdownProps) => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const [status, setStatus] = useState<ApplicationStatus>(currentStatus);
  const [isUpdating, setIsUpdating] = useState(false);

  const updateMutation = useMutation(
    trpc.applications.updateStatus.mutationOptions()
  );

  const handleSelectStatus = (newStatus: ApplicationStatus) => {
    if (newStatus === status) return;
    const previousStatus = status;
    setStatus(newStatus);
    setIsUpdating(true);

    updateMutation.mutate(
      { id, status: newStatus },
      {
        onSuccess: (data) => {
          toast.success(
            `Status ${companyName} diubah menjadi "${APPLICATION_STATUS_LABELS[data.status as ApplicationStatus]}"`
          );
          void queryClient.invalidateQueries(
            trpc.applications.getMany.queryOptions({})
          );
          void queryClient.invalidateQueries(
            trpc.applications.getStats.queryOptions()
          );
        },
        onError: (err) => {
          setStatus(previousStatus);
          toast.error(err.message || "Gagal mengubah status");
        },
        onSettled: () => {
          setIsUpdating(false);
        },
      }
    );
  };

  const activeColor =
    APPLICATION_STATUS_COLORS[status] ?? APPLICATION_STATUS_COLORS.applied;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          disabled={isUpdating}
          className="inline-flex items-center outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 rounded-full group cursor-pointer transition-transform active:scale-95 disabled:opacity-50"
        >
          <Badge
            variant="outline"
            className={`text-xs font-medium px-2.5 py-1 rounded-full border transition-colors flex items-center gap-1 ${activeColor.bg}`}
          >
            {isUpdating ? (
              <Loader2 className="size-3 animate-spin mr-0.5" />
            ) : null}
            <span>{APPLICATION_STATUS_LABELS[status]}</span>
            <ChevronDown className="size-3 opacity-60 group-hover:opacity-100 transition-opacity" />
          </Badge>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-48">
        {APPLICATION_STATUSES.map((itemStatus) => {
          const config = APPLICATION_STATUS_COLORS[itemStatus];
          const isSelected = itemStatus === status;
          return (
            <DropdownMenuItem
              key={itemStatus}
              onClick={() => handleSelectStatus(itemStatus)}
              className="flex items-center justify-between cursor-pointer py-1.5"
            >
              <div className="flex items-center gap-2">
                <span
                  className={`size-2 rounded-full border ${config.bg.split(" ")[0]}`}
                />
                <span className={isSelected ? "font-semibold" : ""}>
                  {APPLICATION_STATUS_LABELS[itemStatus]}
                </span>
              </div>
              {isSelected && (
                <span className="text-xs text-muted-foreground">Aktif</span>
              )}
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
