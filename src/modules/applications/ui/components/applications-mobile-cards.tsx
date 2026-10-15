"use client";

import { format, formatDistanceToNow } from "date-fns";
import { id as idLocale } from "date-fns/locale";
import {
  ExternalLink,
  PenBoxIcon,
  Clock,
  MapPin,
  Briefcase,
  Coins,
} from "lucide-react";
import { JobApplication } from "@/db/schema";
import { ApplicationStatus } from "../../types";
import { StatusDropdown } from "./status-dropdown";
import { ApplicationStatusBadge } from "./status-badge";
import { DeleteApplicationDialog } from "./delete-application-dialog";
import { isFollowUpNeeded } from "./columns";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatRupiahShort } from "../../lib/utils";

interface ApplicationsMobileCardsProps {
  items: JobApplication[];
  onEdit?: (application: JobApplication) => void;
  readOnly?: boolean;
}

export const ApplicationsMobileCards = ({
  items,
  onEdit,
  readOnly = false,
}: ApplicationsMobileCardsProps) => {
  return (
    <div className="flex flex-col gap-3 md:hidden w-full">
      {items.map((app) => {
        const needsFollowUp = isFollowUpNeeded(app);

        let relativeDate = "Draft";
        let fullDate = "";
        if (app.appliedAt) {
          const dateObj = new Date(`${app.appliedAt}T00:00:00`);
          relativeDate = formatDistanceToNow(dateObj, {
            addSuffix: true,
            locale: idLocale,
          });
          fullDate = format(dateObj, "d MMM yyyy", { locale: idLocale });
        }

        return (
          <Card key={app.id} className="border shadow-xs overflow-hidden">
            <CardHeader className="p-4 pb-2">
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    {app.jobUrl ? (
                      <a
                        href={app.jobUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-bold text-base hover:underline inline-flex items-center gap-1 text-foreground hover:text-primary"
                      >
                        <span>{app.company}</span>
                        <ExternalLink className="size-3.5 shrink-0 opacity-70" />
                      </a>
                    ) : (
                      <span className="font-bold text-base text-foreground">
                        {app.company}
                      </span>
                    )}

                    {needsFollowUp && (
                      <Badge
                        variant="outline"
                        className="text-[10px] bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20 px-1.5 py-0 h-4.5 gap-0.5 shrink-0"
                      >
                        <Clock className="size-2.5" />
                        <span>Follow-up</span>
                      </Badge>
                    )}
                  </div>
                  <div className="text-sm font-medium text-foreground/90 mt-0.5">
                    {app.position || (
                      <span className="text-muted-foreground italic text-xs">
                        Belum ditentukan
                      </span>
                    )}
                  </div>
                </div>
                <div className="shrink-0">
                  {readOnly ? (
                    <ApplicationStatusBadge status={app.status} />
                  ) : (
                    <StatusDropdown
                      id={app.id}
                      currentStatus={app.status as ApplicationStatus}
                      companyName={app.company}
                    />
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-4 pt-1 space-y-2.5 text-xs text-muted-foreground">
              <div className="flex flex-wrap items-center gap-1.5">
                <Badge variant="secondary" className="font-normal text-[11px] bg-muted/80">
                  {app.platform}
                </Badge>
                {app.employmentType && (
                  <span className="inline-flex items-center gap-1 bg-muted/80 px-2 py-0.5 rounded text-[11px] font-medium">
                    <Briefcase className="size-3" />
                    {app.employmentType}
                  </span>
                )}
                {app.location && (
                  <span className="inline-flex items-center gap-1 bg-muted/80 px-2 py-0.5 rounded text-[11px] font-medium">
                    <MapPin className="size-3" />
                    {app.location}
                  </span>
                )}
                {(app.salaryMin != null || app.salaryMax != null) && (
                  <span className="inline-flex items-center gap-1 text-[11px] text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded font-medium">
                    <Coins className="size-3" />
                    {app.salaryMin != null && app.salaryMax != null
                      ? `${formatRupiahShort(app.salaryMin)} - ${formatRupiahShort(app.salaryMax)}`
                      : app.salaryMin != null
                      ? `Min ${formatRupiahShort(app.salaryMin)}`
                      : `Maks ${formatRupiahShort(app.salaryMax)}`}
                  </span>
                )}
              </div>

              <div className="grid grid-cols-2 gap-2 pt-2 border-t text-muted-foreground">
                <div>
                  <span className="block text-[10px] uppercase font-semibold text-muted-foreground/70">
                    Tanggal Lamar
                  </span>
                  <span className="text-foreground font-medium">
                    {relativeDate}
                  </span>
                  {fullDate && (
                    <span className="block text-[11px] text-muted-foreground">
                      {fullDate}
                    </span>
                  )}
                </div>

                <div>
                  <span className="block text-[10px] uppercase font-semibold text-muted-foreground/70">
                    Langkah Berikutnya
                  </span>
                  <span className="text-foreground font-medium line-clamp-1">
                    {app.nextStep || "—"}
                  </span>
                  {app.nextStepAt && (
                    <span className="block text-[11px] text-muted-foreground">
                      {format(new Date(`${app.nextStepAt}T00:00:00`), "d MMM yyyy", {
                        locale: idLocale,
                      })}
                    </span>
                  )}
                </div>
              </div>

              {app.notes && (
                <div className="bg-muted/40 p-2.5 rounded text-xs text-foreground/80 line-clamp-2">
                  {app.notes}
                </div>
              )}

              {!readOnly && onEdit && (
                <div className="flex justify-end items-center gap-1 pt-1">
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-8 text-xs"
                    onClick={() => onEdit(app)}
                  >
                    <PenBoxIcon className="size-3.5 mr-1" />
                    Edit
                  </Button>
                  <DeleteApplicationDialog
                    id={app.id}
                    companyName={app.company}
                  />
                </div>
              )}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};
