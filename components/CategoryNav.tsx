const categories = [
  { label: "Ofertas", highlight: true },
  { label: "Marcas" },
  { label: "Medicamentos", active: false },
  { label: "Perfumería" },
  { label: "Skin Care" },
  { label: "Cuidado Personal" },
  { label: "Bebes" },
  { label: "Otros" },
];

export function CategoryNav() {
  return (
    <nav className="border-b border-placeholder/40 bg-white">
      <ul className="mx-auto flex max-w-[1512px] flex-wrap items-center gap-x-6 gap-y-2 px-[60px] py-3">
        {categories.map((category) => (
          <li key={category.label}>
            {category.highlight ? (
              <a
                href="#"
                className="inline-flex items-center rounded-[5px] bg-offers-red px-3 py-1 text-xs text-white"
              >
                {category.label}
              </a>
            ) : (
              <a
                href="#"
                className={`text-xs transition-colors hover:text-dark-green ${
                  category.active
                    ? "font-bold text-dark-green"
                    : "text-gray-text"
                }`}
              >
                {category.label}
              </a>
            )}
          </li>
        ))}
      </ul>
    </nav>
  );
}
