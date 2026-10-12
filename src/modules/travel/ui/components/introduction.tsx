import CardContainer from "@/components/card-container";

export const Introduction = () => (
  <CardContainer>
    <div className="flex flex-col p-8 md:p-12 gap-8 md:gap-16">
      <h1 className="text-4xl">Perjalanan</h1>
      <div className="flex flex-col gap-4 font-light text-text-muted leading-relaxed text-[15px]">
        <p>
          Menjelajahi berbagai kota dan sudut dunia, merekam momen autentik melalui street photography dan pemandangan urban. Setiap sudut kota memiliki cerita dan atmosfernya masing-masing.
        </p>
      </div>
    </div>
  </CardContainer>
);
