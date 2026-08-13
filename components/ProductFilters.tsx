"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { FilterSelect, type FilterOption } from "@/components/FilterSelect";

const sortOptions: FilterOption[] = [
  { label: "A-Z", value: "alpha-asc" },
  { label: "Z-A", value: "alpha-desc" },
  { label: "Menor precio", value: "price-asc" },
  { label: "Mayor precio", value: "price-desc" },
];

type ProductFiltersProps = {
  categorySlug: string;
  categoryOptions: FilterOption[];
  subCategoryOptions: FilterOption[];
};

export function ProductFilters({
  categorySlug,
  categoryOptions,
  subCategoryOptions,
}: ProductFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const currentSub = searchParams.get("sub") ?? "all";
  const currentSort = searchParams.get("sort") ?? "alpha-asc";

  function updateQuery(next: { sub?: string; sort?: string }) {
    const params = new URLSearchParams(searchParams.toString());

    if (next.sub !== undefined) {
      if (!next.sub || next.sub === "all") params.delete("sub");
      else params.set("sub", next.sub);
    }

    if (next.sort !== undefined) {
      if (!next.sort || next.sort === "alpha-asc") params.delete("sort");
      else params.set("sort", next.sort);
    }

    const query = params.toString();
    router.push(
      query ? `/products/${categorySlug}?${query}` : `/products/${categorySlug}`,
    );
  }

  function onCategoryChange(value: string | null) {
    if (!value || value === categorySlug) return;

    const params = new URLSearchParams();
    if (currentSort && currentSort !== "alpha-asc") {
      params.set("sort", currentSort);
    }
    const query = params.toString();
    router.push(query ? `/products/${value}?${query}` : `/products/${value}`);
  }

  const subOptions: FilterOption[] = [
    { label: "Todas", value: "all" },
    ...(subCategoryOptions ?? []),
  ];

  return (
    <div className="rounded-lg bg-white px-8 py-7 lg:min-h-[364px]">
      <h2 className="text-2xl font-bold text-gray-text">Filtros</h2>
      <div className="mt-6 flex flex-col gap-2.5">
        <FilterSelect
          placeholder="Categoría"
          options={categoryOptions}
          value={categorySlug}
          onValueChange={onCategoryChange}
        />
        <FilterSelect
          placeholder="Sub categoría"
          options={subOptions}
          value={currentSub}
          onValueChange={(value) => updateQuery({ sub: value ?? "all" })}
        />
        <FilterSelect
          placeholder="Ordenar"
          options={sortOptions}
          value={currentSort}
          onValueChange={(value) =>
            updateQuery({ sort: value ?? "alpha-asc" })
          }
        />
      </div>
    </div>
  );
}
