import ProductCard from "@/components/ProductCard";
import { getProducts } from "@/lib/catalog";

type ProductsPageProps = {
  searchParams: Promise<{ q?: string }>;
};

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  const { q } = await searchParams;
  const query = q?.trim() ?? "";
  const products = query ? await getProducts({ q: query }) : [];

  return (
    <main className="flex flex-1 flex-col bg-light-gray">
      <div className="mx-auto w-full max-w-[1512px] px-4 py-8 sm:px-6 lg:px-[60px]">
        {query ? (
          <>
            <h1 className="font-bold text-2xl text-gray-text">
              Resultados para “{query}”
            </h1>
            <p className="mt-2 text-sm text-gray-text">
              ({products.length}) Encontrado{products.length === 1 ? "" : "s"}
            </p>

            {products.length === 0 ? (
              <div className="mt-8 rounded-lg bg-white px-8 py-10 text-sm text-gray-text">
                No hay productos que coincidan con tu búsqueda.
              </div>
            ) : (
              <div className="mt-8 grid grid-cols-1 justify-items-center gap-6 sm:grid-cols-2 xl:grid-cols-3">
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </>
        ) : (
          <>
            <h1 className="font-bold text-2xl text-gray-text">Productos</h1>
            <p className="mt-2 text-sm text-gray-text">
              Escribí en el buscador y presioná Enter, o elegí una categoría del
              menú.
            </p>
          </>
        )}
      </div>
    </main>
  );
}
