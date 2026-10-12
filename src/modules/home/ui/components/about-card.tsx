import CardContainer from "@/components/card-container";

const AboutCard = () => {
  return (
    <CardContainer>
      <div className="flex flex-col p-8 md:p-12 gap-8 md:gap-16">
        <h1 className="text-3xl">Tentang Saya</h1>
        <div className="flex flex-col gap-4 font-light text-text-muted leading-relaxed text-[15px]">
          <p>
            Halo, saya Zaki Tri Pamungkas. Lulusan Teknik Informatika Universitas Muhammadiyah Surakarta (UMS) yang berfokus pada rekayasa web dan eksplorasi visual digital. Dalam pengembangan perangkat lunak, saya terbiasa menangani arsitektur frontend maupun backend — menjaga performa, struktur data yang rapi, dan kemudahan bagi pengguna akhir.
          </p>

          <p>
            Di ranah visual, kamera mirrorless dan drone FPV menjadi instrumen utama saya untuk mendokumentasikan kota, arsitektur, dan lanskap alam. Ketelitian teknis dalam menulis kode membantu saya memahami komposisi dan ritme visual, sementara kepekaan estetika memastikan aplikasi yang saya bangun terasa nyaman dan intuitif.
          </p>
        </div>
      </div>
    </CardContainer>
  );
};

export default AboutCard;
