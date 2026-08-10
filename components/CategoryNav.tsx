"use client";

import Link from "next/link";
import { useState } from "react";
import { cn } from "@/lib/utils";

type Category = {
  label: string;
  slug: string;
  highlight?: boolean;
  subCategories: string[];
};

const categories: Category[] = [
  {
    label: "Ofertas",
    slug: "ofertas",
    highlight: true,
    subCategories: ["aaa", "bbb"],
  },
  { label: "Insumos", slug: "insumos", subCategories: ["Descartables"] },
  {
    label: "Medicamentos",
    slug: "medicamentos",
    subCategories: ["Venta libre"],
  },
  {
    label: "Perfumería",
    slug: "perfumeria",
    subCategories: ["Mujer", "Hombre"],
  },
  {
    label: "Cuidado personal",
    slug: "cuidado-personal",
    subCategories: [
      "Cuidado capilar",
      "Cuidado facial",
      "Cuidado corporal",
      "Protección solar",
      "Higiene personal",
    ],
  },
  {
    label: "Bebes",
    slug: "bebes",
    subCategories: [
      "pañales",
      "lactancia",
      "higiene del bebe",
      "nutrición infaltil",
      "cuidado materno",
      "accesorios del bebe",
    ],
  },
  {
    label: "Suplementos",
    slug: "suplementos",
    subCategories: ["Proteina", "Vitaminas y minerales"],
  },
  {
    label: "Equipamiento medico para el hogar",
    slug: "equipamiento-medico",
    subCategories: [],
  },
  {
    label: "Otros",
    slug: "otros",
    subCategories: ["accesorios", "tintura", "esmaltes"],
  },
];

function toSlug(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-");
}

export function CategoryNav() {
  const [openSlug, setOpenSlug] = useState<string | null>(null);
  const openCategory = categories.find((category) => category.slug === openSlug);
  const hasDropdown =
    !!openCategory && openCategory.subCategories.length > 0;

  return (
    <nav
      className="relative z-40 border-b border-placeholder/40 bg-white"
      onMouseLeave={() => setOpenSlug(null)}
    >
      <ul className="mx-auto flex max-w-[1512px] flex-wrap items-center gap-x-6 gap-y-2 px-4 py-3 sm:px-6 lg:px-[60px]">
        {categories.map((category) => {
          const isOpen = openSlug === category.slug;
          const canOpen = category.subCategories.length > 0;

          return (
            <li
              key={category.slug}
              className="relative"
              onMouseEnter={() =>
                setOpenSlug(canOpen ? category.slug : null)
              }
            >
              {category.highlight ? (
                <Link
                  href={`/products/${category.slug}`}
                  className="inline-flex items-center rounded-[3px] bg-offers-red px-2 py-0.5 text-xs font-medium tracking-[0.03em] text-white"
                >
                  {category.label}
                </Link>
              ) : (
                <Link
                  href={`/products/${category.slug}`}
                  className={cn(
                    "relative inline-block pb-1 text-xs font-medium tracking-[0.03em] transition-colors",
                    isOpen
                      ? "text-dark-green"
                      : "text-gray-text hover:text-dark-green"
                  )}
                >
                  {category.label}
                  <span
                    className={cn(
                      "absolute inset-x-0 -bottom-px h-px bg-dark-green transition-opacity",
                      isOpen ? "opacity-100" : "opacity-0"
                    )}
                  />
                </Link>
              )}
            </li>
          );
        })}
      </ul>

      {hasDropdown && openCategory && (
        <>
          <div
            className="pb-24 absolute inset-x-0 top-full z-50 rounded-b-[10px] bg-white shadow-[0_4px_4px_rgba(140,140,140,0.1)]"
            onMouseEnter={() => setOpenSlug(openCategory.slug)}
          >
            <div className="mx-auto flex max-w-[1512px] flex-wrap gap-x-16 gap-y-5 px-4 py-7 sm:px-6 lg:px-[60px]">
              {openCategory.subCategories.map((subCategory) => (
                <Link
                  key={subCategory}
                  href={`/products/${openCategory.slug}?sub=${toSlug(subCategory)}`}
                  className="max-w-[140px] text-base font-medium leading-tight tracking-[0.03em] text-dark-green transition-opacity hover:opacity-70"
                >
                  {subCategory}
                </Link>
              ))}
            </div>
          </div>

          <div
            aria-hidden
            className="absolute inset-x-0 top-full z-40 h-screen bg-black/10"
            onMouseEnter={() => setOpenSlug(null)}
          />
        </>
      )}
    </nav>
  );
}
