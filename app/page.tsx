import { BanksMarquee } from "@/components/BanksMarquee";
import { BrandsMarquee } from "@/components/BrandsMarquee";
import { HeroCarousel } from "@/components/HeroCarousel";
import { ProductCarousel } from "@/components/ProductCarousel";

function Title({ children }: { children: React.ReactNode }) {
  return (
    <h1 className="pb-10 font-bold text-[25px] text-base text-gray-text">{children}</h1>
  );
}

export default function Home() {
  return (
    <main className="flex flex-1 gap-14 flex-col bg-white px-15 lg:px-30 max-w-[1512px] pt-10">
      <section className="mx-auto w-full">
        <Title>¡Lo nuevo y súper piola!</Title>
        <HeroCarousel />
      </section>
      <section className="mx-auto w-full">
        <Title>Medios de pago</Title>
        <BanksMarquee />
      </section>
      <section className="mx-auto w-full">
        <Title>Super ofertas</Title>
        <ProductCarousel />
      </section>
      <section className="mx-auto w-full mb-15">
        <Title>Tus marcas favoritas</Title>
        <BrandsMarquee />
      </section>
    </main>
  );
}
