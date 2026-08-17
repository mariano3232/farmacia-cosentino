import Link from "next/link";
import { Suspense } from "react";
import ProductCard from "@/components/ProductCard";
import { ProductFilters } from "@/components/ProductFilters";
import {
  getCategories,
  getCategoryBySlug,
  getPendingReservedQuantities,
  getProducts,
  getSubCategories,
  parseSort,
} from "@/lib/catalog";

type ProductsCategoryPageProps = {
  params: Promise<{ category: string }>;
  searchParams: Promise<{ sub?: string; sort?: string }>;
};

export default async function ProductsCategoryPage({
  params,
  searchParams,
}: ProductsCategoryPageProps) {
  const { category: categorySlug } = await params;
  const { sub, sort: sortParam } = await searchParams;
  const sort = parseSort(sortParam);

  const [category, categories] = await Promise.all([
    getCategoryBySlug(categorySlug),
    getCategories(),
  ]);

  if (!category) {
    return (
      <main className="flex flex-1 flex-col bg-[#F5F5F5]">
        <div className="mx-auto w-full max-w-[1512px] px-4 py-10 sm:px-6 lg:px-[60px]">
          <h1 className="text-2xl font-bold text-gray-text">
            Categoría no encontrada
          </h1>
          <Link
            href="/"
            className="mt-4 inline-block text-sm text-medium-green hover:text-dark-green"
          >
            Volver al inicio
          </Link>
        </div>
      </main>
    );
  }

  const [subCategories, products, reservedQuantities] = await Promise.all([
    getSubCategories(category.id),
    getProducts({
      categorySlug,
      subSlug: sub && sub !== "all" ? sub : undefined,
      sort,
    }),
    getPendingReservedQuantities(),
  ]);

  const activeSub = subCategories.find((item) => item.slug === sub);
  const title = activeSub?.name ?? category.name;

  const categoryOptions = categories.map((item) => ({
    label: item.name,
    value: item.slug,
  }));

  const subCategoryOptions = subCategories.map((item) => ({
    label: item.name,
    value: item.slug,
  }));

  return (
    <main className="flex flex-1 flex-col bg-[#F5F5F5]">
      <div className="mx-auto w-full max-w-[1512px] px-4 py-6 sm:px-6 lg:px-[60px] lg:py-8">
        <nav
          aria-label="Breadcrumb"
          className="mb-8 flex flex-wrap items-center gap-1.5 text-xs font-medium tracking-[0.03em] text-gray-text"
        >
          <Link href="/" className="hover:text-dark-green">
            Inicio
          </Link>
          <span aria-hidden>›</span>
          <Link
            href={`/products/${category.slug}`}
            className="hover:text-dark-green"
          >
            {category.name}
          </Link>
          {activeSub && (
            <>
              <span aria-hidden>›</span>
              <span>{activeSub.name}</span>
            </>
          )}
        </nav>

        <div className="flex flex-col gap-6 lg:flex-row lg:gap-8">
          <aside className="flex w-full shrink-0 flex-col gap-6 lg:w-[297px]">
            <div className="rounded-lg bg-white px-8 py-7 lg:h-[172px]">
              <h1 className="text-4xl font-bold text-gray-text">{title}</h1>
              <p className="mt-3 text-base text-gray-text">
                ({products.length}) Encontrado
                {products.length === 1 ? "" : "s"}
              </p>
            </div>

            <Suspense fallback={null}>
              <ProductFilters
                categorySlug={category.slug}
                categoryOptions={[...categoryOptions]}
                subCategoryOptions={subCategoryOptions}
              />
            </Suspense>
          </aside>

          <section className="min-w-0 flex-1">
            {products.length === 0 ? (
              <div className="rounded-lg bg-white px-8 py-10 text-sm text-gray-text">
                No hay productos para estos filtros.
              </div>
            ) : (
              <div className="grid grid-cols-1 justify-items-center gap-6 sm:grid-cols-2 xl:grid-cols-3">
                {products.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    reservedQuantity={reservedQuantities[product.id] ?? 0}
                  />
                ))}
              </div>
            )}
          </section>
        </div>
      </div>
    </main>
  );
}
