import CardContainer from "@/components/card-container";

const AboutCard = () => {
  return (
    <CardContainer>
      <div className="flex flex-col p-8 md:p-12 gap-8 md:gap-16">
        <h1 className="text-3xl">Tentang Saya</h1>
        <div className="flex flex-col gap-4 font-light text-text-muted leading-relaxed text-[15px]">
          <p>
            Lulusan Teknik Informatika UMS yang menekuni pengembangan web dan dunia visual. Dalam rekayasa web, fokus saya ada pada performa, struktur kode yang bersih, dan kenyamanan pengguna.
          </p>

          <p>
            Di luar baris kode, saya aktif motret dan menerbangkan drone FPV untuk menangkap perspektif baru — mulai dari lanskap alam hingga dinamika jalanan.
          </p>
        </div>
      </div>
    </CardContainer>
  );
};

export default AboutCard;
