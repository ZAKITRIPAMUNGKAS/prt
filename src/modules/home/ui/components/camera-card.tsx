import CardContainer from "@/components/card-container";

const CameraCard = () => {
  return (
    <CardContainer>
      <div className="flex flex-col p-8 md:p-12 gap-8 md:gap-16">
        <div className="flex flex-col text-3xl">
          <h1>Workstation</h1>
          <h1>& Setup Kerja</h1>
        </div>

        <div className="font-light text-text-muted leading-relaxed text-[15px]">
          <p>
            Perangkat keras dan lingkungan kerja harian yang saya gunakan untuk rekayasa perangkat lunak, pengembangan aplikasi web modern, serta pemrosesan aset visual.
          </p>
        </div>
      </div>
    </CardContainer>
  );
};

export default CameraCard;
