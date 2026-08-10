import { Marquee } from "./ui/Marquee";

const brands = [
  { src: "/marcas/Actron.png", alt: "Actron" },
  { src: "/marcas/BOSS.png", alt: "Boss" },
  { src: "/marcas/Dove.png", alt: "Dove" },
  { src: "/marcas/Elvive.png", alt: "Elvive" },
  { src: "/marcas/GUM.png", alt: "GUM" },
  { src: `/marcas/${encodeURIComponent("LA PUI.png")}`, alt: "La Pui" },
  { src: "/marcas/rexona.png", alt: "Rexona" },
];

export function BrandsMarquee() {
  return (
    <Marquee pauseOnHover speed={25} className="mt-0 py-2">
      {brands.map((brand) => (
        <div
          key={brand.src}
          className="mx-[7.5px] flex shrink-0 items-center justify-center"
        >
          <img
            src={brand.src}
            alt={brand.alt}
            className="h-[72px] w-auto object-contain sm:h-[146px]"
          />
        </div>
      ))}
    </Marquee>
  );
}
