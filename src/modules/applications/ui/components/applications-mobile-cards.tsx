"use client";

import { format, formatDistanceToNow } from "date-fns";
import { id as idLocale } from "date-fns/locale";
import {
  ExternalLink,
  PenBoxIcon,
  Clock,
  MapPin,
  Briefcase,
} from "lucide-react";
import { JobApplication } from "@/db/schema";
import { ApplicationStatus } from "../../types";
import { StatusDropdown } from "./status-dropdown";
import { DeleteApplicationDialog } from "./delete-application-dialog";
import { isFollowUpNeeded } from "./columns";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface ApplicationsMobileCardsProps {
  items: JobApplication[];
  onEdit: (application: JobApplication) => void;
}

export const ApplicationsMobileCards = ({
  items,
  onEdit,
}: ApplicationsMobileCardsProps) => {
  return (
    <div className="flex flex-col gap-3 md:hidden">
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
                    {needsFollowUp && (
                      <span
                        className="inline-flex items-center gap-1 text-[11px] text-amber-600 dark:text-amber-400 bg-amber-500/10 px-1.5 py-0.5 rounded-full font-medium"
                        title="Terkirim > 14 hari"
                      >
                        <Clock className="size-3" />
                        Follow-up
                      </span>
                    )}
                    {app.jobUrl ? (
                      <a
                        href={app.jobUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-bold text-base hover:underline inline-flex items-center gap-1 text-foreground hover:text-primary"
                      >
                        <span>{app.company}</span>
                        <ExternalLink className="size-3.5 shrink-0" />
                      </a>
                    ) : (
                      <span className="font-bold text-base text-foreground">
                        {app.company}
                      </span>
                    )}
                  </div>
                  <div className="text-sm font-medium text-foreground/90 mt-0.5">
                    {app.position || "Belum ditentukan"}
                  </div>
                </div>
                <div className="shrink-0">
                  <StatusDropdown
                    id={app.id}
                    currentStatus={app.status as ApplicationStatus}
                    companyName={app.company}
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-4 pt-1 space-y-2.5 text-xs text-muted-foreground">
              <div className="flex flex-wrap items-center gap-1.5">
                <Badge variant="secondary" className="font-normal text-[11px]">
                  {app.platform}
                </Badge>
                {app.employmentType && (
                  <span className="inline-flex items-center gap-1 bg-muted px-2 py-0.5 rounded text-[11px]">
                    <Briefcase className="size-3" />
                    {app.employmentType}
                  </span>
                )}
                {app.location && (
                  <span className="inline-flex items-center gap-1 bg-muted px-2 py-0.5 rounded text-[11px]">
                    <MapPin className="size-3" />
                    {app.location}
                  </span>
                )}
              </div>

              <div className="grid grid-cols-2 gap-2 pt-1 border-t text-muted-foreground">
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
                    {app.nextStep || "-"}
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
                <div className="bg-muted/50 p-2 rounded text-xs text-foreground/80 line-clamp-2">
                  {app.notes}
                </div>
              )}

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
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};
