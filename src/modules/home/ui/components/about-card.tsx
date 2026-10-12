import CardContainer from "@/components/card-container";

const AboutCard = () => {
  return (
    <CardContainer>
      <div className="flex flex-col p-8 md:p-12 gap-8 md:gap-16">
        <h1 className="text-3xl">Tentang Saya</h1>
        <div className="flex flex-col gap-4 font-light text-text-muted leading-relaxed text-[15px]">
          <p>
            Sebagai developer web lulusan Teknik Informatika Universitas Muhammadiyah Surakarta (UMS) sekaligus kreator visual, saya memadukan pola pikir rekayasa perangkat lunak yang sistematis dengan estetika visual. Di ranah engineering, fokus saya adalah membangun aplikasi web modern, performan, dan berorientasi pada kemudahan pengguna.
          </p>

          <p>
            Di balik kamera dan drone FPV, saya mengeksplorasi sudut pandang unik — mulai dari lanskap, street photography, hingga video motion dinamis menggunakan Remotion. Baik melalui baris kode maupun frame visual, tujuan saya adalah menciptakan karya yang bernilai, fungsional, dan bercerita.
          </p>
        </div>
      </div>
    </CardContainer>
  );
};

export default AboutCard;
