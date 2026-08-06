import { HeroCarousel } from "@/components/HeroCarousel";
import { ProductCarousel } from "@/components/ProductCarousel";
import { Card, CardContent } from "@/components/ui/card";

function PlaceholderCard({ className }: { className?: string }) {
  return (
    <Card
      className={`rounded-[15px] border-0 bg-placeholder py-0 ring-0 ${className ?? ""}`}
      aria-hidden
    >
      <CardContent className="h-full p-0" />
    </Card>
  );
}

export default function Home() {
  return (
    <main className="flex flex-1 flex-col bg-white">
      <section className="mx-auto w-full max-w-[1512px] px-[60px] pt-8">
        <h2 className="mb-6 font-nexa-bold text-base text-gray-text">
          ¡Lo nuevo y súper piola!
        </h2>

        <HeroCarousel />
      </section>

      <section className="mx-auto w-full max-w-[1512px] px-[60px] pb-12 pt-16">
        <h2 className="mb-8 font-nexa-bold text-[25px] leading-tight text-gray-text">
          Promociones bancarias para ahorrar más
        </h2>

        <div className="mb-12 grid grid-cols-1 gap-6 sm:grid-cols-4 md:grid-cols-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <PlaceholderCard key={index} className="h-[146px]" />
          ))}
        </div>

        <PlaceholderCard className="mb-16 h-[146px]" />
      </section>

      <section className="mx-auto w-full max-w-[1512px] px-[60px] pb-12">
        <h2 className="mb-8 font-nexa-bold text-base text-gray-text">
          Super ofertas
        </h2>

        <ProductCarousel />
      </section>

      <section className="mx-auto w-full max-w-[1512px] px-[60px] pb-16">
        <h2 className="mb-8 font-nexa-bold text-base text-gray-text">
          Tus marcas favoritas
        </h2>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <PlaceholderCard key={index} className="h-[146px]" />
          ))}
        </div>
      </section>
    </main>
  );
}
