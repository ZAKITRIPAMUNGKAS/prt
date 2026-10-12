import CardContainer from "@/components/card-container";
import { PiArrowUpRight } from "react-icons/pi";
import { ProjectInquiryDialog } from "@/components/project-inquiry-dialog";

export const CollaborationCard = () => {
  return (
    <CardContainer>
      <div className="flex flex-col p-8 md:p-12 gap-6">
        <h2 className="text-2xl font-normal">Kerjakan proyek bareng</h2>
        <p className="font-light text-text-muted text-[15px] leading-relaxed">
          Punya ide produk, kebutuhan sistem kustom, atau membutuhkan produksi visual berkualitas tinggi? Saya menyediakan jasa pengembangan teknologi dan produksi kreatif melalui dua studio:
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
          <a
            href="https://gemala.dev"
            target="_blank"
            rel="noopener noreferrer"
            className="p-5 bg-background/60 hover:bg-background border rounded-xl flex flex-col justify-between gap-4 group transition-colors"
          >
            <div className="flex items-center justify-between">
              <span className="font-medium text-base">gemala.dev</span>
              <PiArrowUpRight
                size={18}
                className="text-muted-foreground group-hover:text-foreground transition-colors"
              />
            </div>
            <p className="text-xs text-text-muted font-light leading-relaxed">
              Pengembangan website, sistem informasi web, dan solusi software kustom.
            </p>
          </a>

          <a
            href="https://gemala.creative"
            target="_blank"
            rel="noopener noreferrer"
            className="p-5 bg-background/60 hover:bg-background border rounded-xl flex flex-col justify-between gap-4 group transition-colors"
          >
            <div className="flex items-center justify-between">
              <span className="font-medium text-base">gemala.creative</span>
              <PiArrowUpRight
                size={18}
                className="text-muted-foreground group-hover:text-foreground transition-colors"
              />
            </div>
            <p className="text-xs text-text-muted font-light leading-relaxed">
              Fotografi visual, pilot drone FPV, dan video motion dinamis (Remotion).
            </p>
          </a>
        </div>

        <div className="pt-2">
          <ProjectInquiryDialog>
            <button
              type="button"
              className="w-full py-3.5 px-4 bg-primary text-white dark:text-black hover:bg-primary-hover font-light text-sm rounded-xl transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Konsultasi & Mulai Diskusi Proyek</span>
              <span className="text-xs">&rarr;</span>
            </button>
          </ProjectInquiryDialog>
        </div>
      </div>
    </CardContainer>
  );
};

export default CollaborationCard;
