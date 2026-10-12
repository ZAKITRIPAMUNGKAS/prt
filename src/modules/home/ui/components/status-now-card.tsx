import CardContainer from "@/components/card-container";
import { ProjectInquiryDialog } from "@/components/project-inquiry-dialog";
import { PiCode, PiCompass, PiMapPin } from "react-icons/pi";

export const StatusNowCard = () => {
  return (
    <CardContainer>
      <div className="p-6 lg:p-8 flex flex-col gap-6">
        {/* Top Header with live pulsing dot */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="relative flex size-2.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex size-2.5 rounded-full bg-emerald-500" />
            </span>
            <span className="text-xs font-mono uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
              Aktivitas Terkini
            </span>
          </div>

          <div className="flex items-center gap-1.5 text-xs text-text-muted font-light">
            <PiMapPin size={13} />
            <span>Surakarta, ID</span>
          </div>
        </div>

        {/* Content Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-start gap-3 p-4 bg-background/50 rounded-xl border border-border/40">
            <div className="p-2 bg-muted rounded-lg text-foreground shrink-0 mt-0.5">
              <PiCode size={16} />
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-xs text-text-muted font-light">Sedang Membangun</span>
              <p className="text-sm font-medium leading-snug">
                Ekosistem gemala.dev & integrasi dynamic motion video via Remotion.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-4 bg-background/50 rounded-xl border border-border/40">
            <div className="p-2 bg-muted rounded-lg text-foreground shrink-0 mt-0.5">
              <PiCompass size={16} />
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-xs text-text-muted font-light">Fokus Rekayasa</span>
              <p className="text-sm font-medium leading-snug">
                Next.js 16, React 19, TypeScript, Clean Architecture & tRPC.
              </p>
            </div>
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-1 border-t border-border/40 text-xs">
          <span className="text-text-muted font-light">
            Status: <strong className="font-normal text-foreground">Tersedia</strong> untuk rekrutmen tech & proyek kreatif.
          </span>

          <ProjectInquiryDialog>
            <button
              type="button"
              className="text-xs font-light text-foreground hover:underline transition-all"
            >
              Diskusi kerja sama &rarr;
            </button>
          </ProjectInquiryDialog>
        </div>
      </div>
    </CardContainer>
  );
};

export default StatusNowCard;
