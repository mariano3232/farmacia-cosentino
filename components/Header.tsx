import { CartIcon, LogoIcon, SearchIcon } from "./icons";

const navLinks = [
  { label: "Contacto", href: "#" },
  { label: "Mi cuenta", href: "#" },
];

export function Header() {
  return (
    <header className="bg-white shadow-[0_4px_4px_rgba(140,140,140,0.1)]">
      <div className="mx-auto flex max-w-[1512px] items-center gap-4 px-[47px] py-6">
        <div className="flex shrink-0 justify-center items-center gap-3">
          <img src={"/logo.png"} className="size-[24px]" />
          <span className="font-editorial text-2xl relative top-1 leading-none text-medium-green">
            FARMACIA COSENTINO
          </span>
        </div>

        <div className="mx-auto flex h-[38px] w-full max-w-[729px] items-center gap-3 rounded-md border border-placeholder bg-white px-4">
          <SearchIcon className="size-[18px] shrink-0" />
          <input
            type="search"
            placeholder="¿Qué estás buscando?"
            className="w-full bg-transparent text-xs text-foreground outline-none placeholder:text-gray-text"
          />
        </div>

        <div className="flex shrink-0 items-center gap-6">
          <nav className="hidden items-center gap-8 md:flex">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="font-nexa-bold text-xs text-gray-text transition-colors hover:text-dark-green"
              >
                {link.label}
              </a>
            ))}
          </nav>

          <button
            type="button"
            aria-label="Carrito de compras"
            className="flex size-[33px] items-center justify-center rounded-[5px] bg-dark-green"
          >
            <CartIcon className="size-[18px]" />
          </button>
        </div>
      </div>
    </header>
  );
}
