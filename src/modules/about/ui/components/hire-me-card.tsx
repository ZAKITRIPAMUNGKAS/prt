import CardContainer from "@/components/card-container";
import { PiDownloadSimple } from "react-icons/pi";

export const HireMeCard = () => {
  return (
    <CardContainer>
      <div className="flex flex-col p-8 md:p-12 gap-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <h2 className="text-2xl font-normal">Rekrut saya</h2>
          <a
            href="/cv-zaki.pdf"
            download="CV-Zaki-Tri-Pamungkas.pdf"
            className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white dark:text-black rounded-lg text-sm font-medium hover:opacity-90 transition-opacity"
          >
            <PiDownloadSimple size={18} />
            <span>Unduh CV</span>
          </a>
        </div>
        <div className="flex flex-col gap-3 font-light text-text-muted text-[15px] leading-relaxed">
          <p>
            Saya Zaki Tri Pamungkas, lulusan Teknik Informatika Universitas Muhammadiyah Surakarta. Saya berfokus pada pengembangan aplikasi web modern yang terstruktur, clean code, dan berorientasi pada kebutuhan pengguna — berpengalaman dengan Laravel, Next.js, React, TypeScript, dan PostgreSQL.
          </p>
          <p>
            Terbuka untuk posisi Full-stack Developer, Software Engineer, atau Frontend Developer.
          </p>
        </div>
      </div>
    </CardContainer>
  );
};

export default HireMeCard;
