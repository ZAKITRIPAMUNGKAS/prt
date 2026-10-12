import CardContainer from "@/components/card-container";

const CameraCard = () => {
  return (
    <CardContainer>
      <div className="flex flex-col p-8 md:p-12 gap-8 md:gap-16">
        <div className="flex flex-col text-3xl">
          <h1>Kamera</h1>
          <h1>& Peralatan</h1>
        </div>

        <div className="font-light text-text-muted leading-relaxed text-[15px]">
          <p>
            Peralatan kamera mirrorless, drone FPV, dan perlengkapan audio-visual yang saya gunakan untuk mendukung produksi konten visual, fotografi komersial, dan sinematografi udara.
          </p>
        </div>
      </div>
    </CardContainer>
  );
};

export default CameraCard;
