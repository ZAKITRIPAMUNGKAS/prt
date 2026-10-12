import CardContainer from "@/components/card-container";
import { PiDownloadSimple } from "react-icons/pi";

export const HireMeCard = () => {
  return (
    <CardContainer>
      <div className="flex flex-col p-8 md:p-12 gap-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <h2 className="text-2xl font-normal">Hubungi Saya</h2>
          <a
            href="/CV_Zaki_Tri_Pamungkas_General.pdf"
            download="CV_Zaki_Tri_Pamungkas_General.pdf"
            className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white dark:text-black rounded-lg text-sm font-medium hover:opacity-90 transition-opacity"
          >
            <PiDownloadSimple size={18} />
            <span>Unduh CV</span>
          </a>
        </div>
        <div className="font-light text-text-muted text-[15px] leading-relaxed">
          <p>
            Saya Zaki Tri Pamungkas, lulusan S1 Teknik Informatika Universitas Muhammadiyah Surakarta (IPK 3,48) dan awardee Beasiswa Unggulan. Berpengalaman mengerjakan lebih dari 50 proyek web (Next.js, React, TypeScript, Laravel) serta mengembangkan sistem internal BCS & GIS di BNI Kantor Pusat, dan saat ini terbuka untuk kolaborasi maupun posisi Full-stack Developer, Software Engineer, atau Frontend Developer.
          </p>
        </div>
      </div>
    </CardContainer>
  );
};

export default HireMeCard;
