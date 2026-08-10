import type { ReactNode } from "react";
import { HeadsetIcon } from "./icons";

const institutionalLinks = [
  "Nuestra empresa",
  "Trabajá con nosotros",
  "Proveedores",
  "Inversiones",
];

const serviceLinks = [
  "Folletos",
  "Promociones",
  "Sucursales",
  "Medios de pago",
  "Medicamentos Recetados",
];

const onlineLinks = ["Mis pedidos", "Mi carrito", "Costos de envío"];

const supportLinks = [
  "Legales de promociones",
  "Términos y condiciones",
  "Centro de ayuda",
  "Libro de quejas digital (Ley 2247)",
];

const beautyLinks = [
  "Maquillaje",
  "Perfumes y fragancias",
  "Cuidado de la piel",
  "Cuidado capilar",
  "Electro belleza",
];

const dermocosmeticsLinks = [
  "Cuidado facial",
  "Cuidado corporal",
  "Protectores solares",
  "Cuidado del pelo",
];

const brandLinks = [
  "Get The Look",
  "La Roche Posay",
  "Vichy",
  "Eucerin",
  "Isdin",
];

const healthLinks = [
  "Comprá medicamentos",
  "Servicios de salud",
  "Productos de farmacia",
  "Cuidado oral",
  "Suplementos dietarios y deportivos",
];

const perfumeLinks = [
  "Perfumes y fragancias para mujer",
  "Perfumes y fragancias para hombre",
  "Perfumes y fragancias para bebés y niños",
  "Colonias y Body Splash",
];

function FooterColumn({
  title,
  links,
}: {
  title: string;
  links: string[];
}) {
  return (
    <div>
      <h3 className="mb-4 font-bold text-sm text-foreground">{title}</h3>
      <ul className="space-y-2">
        {links.map((link) => (
          <li key={link}>
            <a
              href="#"
              className="text-xs text-gray-text transition-colors hover:text-dark-green"
            >
              {link}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

function SocialIcon({ label, children }: { label: string; children: ReactNode }) {
  return (
    <a
      href="#"
      aria-label={label}
      className="flex size-8 items-center justify-center rounded-full bg-gray-text text-white transition-opacity hover:opacity-80"
    >
      {children}
    </a>
  );
}

export function Footer() {
  return (
    <footer className="flex flex-col gap-3 items-center justify-center bg-light-gray h-40 w-full">
      <h1>FOOTER</h1>
      <p>aca va a haber un footer</p>
    </footer>
  );
}
