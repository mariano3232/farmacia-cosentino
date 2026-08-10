import { Marquee } from "./ui/Marquee";

const banks = [
  { src: "/bancos/debito.png", alt: "Débito" },
  { src: "/bancos/DNI.png", alt: "DNI" },
  { src: "/bancos/MP.png", alt: "Mercado Pago" },
  { src: "/bancos/NACION.png", alt: "Banco Nación" },
  { src: "/bancos/NARANJA.png", alt: "Naranja X" },
  { src: "/bancos/PROV.png", alt: "Banco Provincia" },
];

export function BanksMarquee() {
  return (
    <Marquee pauseOnHover speed={20} className="mt-0 py-2">
      {banks.map((bank) => (
        <div
          key={bank.src}
          className="mx-8 flex shrink-0 items-center justify-center sm:mx-10"
        >
          <img
            src={bank.src}
            alt={bank.alt}
            className="h-[72px] w-auto object-contain sm:h-[146px]"
          />
        </div>
      ))}
    </Marquee>
  );
}
