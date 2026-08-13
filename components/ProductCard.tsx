import { formatPrice, type CatalogProduct } from "@/lib/catalog";

type ProductCardProps = {
  product: CatalogProduct;
};

export default function ProductCard({ product }: ProductCardProps) {
  return (
    <div className="h-[560px] w-[297px] overflow-hidden rounded-[8px] bg-white text-gray-text">
      <div className="flex h-[340px] items-center justify-center p-10">
        {product.image_url ? (
          <img
            src={product.image_url}
            alt={product.name}
            className="max-h-full max-w-full object-contain"
          />
        ) : (
          <div className="flex size-full items-center justify-center rounded-md bg-light-gray text-sm text-gray-text">
            Sin imagen
          </div>
        )}
      </div>

      <div className="flex h-[220px] flex-col items-center gap-6 bg-[#b2d7af9c] p-6">
        <h2 className="line-clamp-2 text-center text-2xl font-bold tracking-wider">
          {product.name}
        </h2>
        <div className="flex w-full justify-between text-sm">
          <span>{product.category?.name ?? "—"}</span>
          <span>{product.subcategory?.name ?? "—"}</span>
        </div>
        <div className="mt-auto flex w-full items-center justify-between">
          <p className="text-3xl font-bold">{formatPrice(product.price)}</p>
          <button
            type="button"
            className="rounded-[5px] bg-medium-green px-5 py-1 text-sm text-white"
          >
            Reservar
          </button>
        </div>
      </div>
    </div>
  );
}
