import { Badge } from "@/components/ui/badge";
import {
  APPLICATION_STATUS_COLORS,
  APPLICATION_STATUS_LABELS,
  ApplicationStatus,
} from "../../types";

interface ApplicationStatusBadgeProps {
  status: ApplicationStatus | string;
  className?: string;
}

export const ApplicationStatusBadge = ({
  status,
  className,
}: ApplicationStatusBadgeProps) => {
  const typedStatus = status as ApplicationStatus;
  const activeColor =
    APPLICATION_STATUS_COLORS[typedStatus] ?? APPLICATION_STATUS_COLORS.applied;
  const label = APPLICATION_STATUS_LABELS[typedStatus] ?? status;

  return (
    <Badge
      variant="outline"
      className={`text-xs font-medium px-2.5 py-0.5 rounded-full border transition-colors inline-flex items-center gap-1.5 ${activeColor.bg} ${className ?? ""}`}
    >
      <span
        className={`size-1.5 rounded-full shrink-0 ${activeColor.bg.split(" ")[0]}`}
      />
      <span>{label}</span>
    </Badge>
  );
};
