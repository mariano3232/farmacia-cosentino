"use client";

import { removeReservedProduct } from "@/app/products/actions";
import { ReservationQuantityControls } from "@/components/ReservationQuantityControls";
import { CartIcon } from "./icons";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { createClient } from "@/lib/supabase/client";
import { useCallback, useEffect, useState, useTransition } from "react";

type ReservationItem = {
  id: number;
  product_id: number;
  unit_price: number;
  quantity: number;
  status: string | null;
  product: { name: string; image_url: string | null };
};

function formatPrice(price: number) {
  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    maximumFractionDigits: 0,
  }).format(price);
}

function normalizeProduct(
  value:
    | { name: string; image_url: string | null }
    | { name: string; image_url: string | null }[]
    | null,
) {
  if (!value) return { name: "", image_url: null };
  return Array.isArray(value) ? (value[0] ?? { name: "", image_url: null }) : value;
}

export function ReservedProductsSheet() {
  const [items, setItems] = useState<ReservationItem[]>([]);
  const [loading, setLoading] = useState(false);

  const getReservedProducts = useCallback(async () => {
    setLoading(true)
    const supabase = createClient();
    const { data } = await supabase.auth.getUser();
    const user = data.user;
    if (!user) {
      setItems([]);
      return;
    }
    const { data: reservationsData, error } = await supabase.from("reservations").select(`
      status,
      reservation_items (
        id,
        product_id,
        unit_price,
        quantity,
        product:products (
          name,
          image_url
        )
      )`
    ).eq("user_uid", user.id).order('created_at')

    if (error) {
      console.error("Error fetching reservations: ", error);
      return;
    }

    const nextItems: ReservationItem[] = [];
    for (const reservation of reservationsData ?? []) {
      const reservationItems = Array.isArray(reservation.reservation_items)? reservation.reservation_items: [];

      for (const item of reservationItems) {
        const quantity = Number(item.quantity ?? 0);
        if (!item.product_id || quantity <= 0) continue;

        nextItems.push({
          id: item.id,
          product_id: item.product_id,
          unit_price: Number(item.unit_price ?? 0),
          quantity,
          status: reservation.status,
          product: normalizeProduct(item.product),
        });
      }
    }
    console.log("aaaa")
    setItems(nextItems);
    setLoading(false)
  }, []);

  useEffect(() => {
    getReservedProducts();
  }, [getReservedProducts]);

  function handleReserve(){

  }

  const total = items.reduce(
    (sum, item) => sum + item.unit_price * item.quantity,
    0,
  );

  return (
    <Sheet
      onOpenChange={(open) => {
        if (open) getReservedProducts();
      }}
    >
      <SheetTrigger
        aria-label="Productos reservados"
        className="flex cursor-pointer items-center justify-center gap-2 rounded-[5px] bg-dark-green p-2 text-[12px] text-white"
      >
        <div className="flex flex-col items-start leading-3">
          <span>Productos</span>
          <span>reservados</span>
        </div>
        <CartIcon className="size-[18px]" />
      </SheetTrigger>

      <SheetContent
        side="right"
        className="w-full max-w-sm gap-0 overflow-y-scroll bg-white text-foreground sm:max-w-md md:min-w-[450px]"
      >
        <SheetHeader className="border-b border-placeholder">
          <SheetTitle className="font-bold text-dark-green">
            Productos reservados
          </SheetTitle>
          <SheetDescription>
            Productos que guardaste para retirar.
          </SheetDescription>
        </SheetHeader>

        {items.length ? (
          <div className="mt-4 flex flex-col gap-6 px-8">
            {items.map((item) => (
              <ReservedProductRow
                key={item.id}
                item={item}
                onMutated={getReservedProducts}
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-1 flex-col items-center justify-center gap-2 px-4 text-center text-gray-text">
            <p className="text-sm">Todavía no tenés productos reservados.</p>
          </div>
        )}
        <div className="my-3 flex w-full justify-between px-9 text-[16px] text-gray-text">
          <p>Productos</p>
          <p>{formatPrice(total)}</p>
        </div>
        <div className="my-3 flex w-full justify-between px-9 text-xl font-bold text-dark-green">
          <p>TOTAL</p>
          <p>{formatPrice(total)}</p>
        </div>
        <SheetFooter className="border-t border-placeholder">
          <button
            type="button"
            className="w-full rounded-[5px] bg-dark-green px-4 py-2.5 text-sm font-bold text-white transition-opacity hover:opacity-90"
            onClick={()=>{handleReserve()}}
            disabled={loading}
          >
            {loading ? "Cargando...": "Reservar"}
          </button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}

function ReservedProductRow({
  item,
  onMutated,
}: {
  item: ReservationItem;
  onMutated: () => void;
}) {
  const [isPending, startTransition] = useTransition();

  return (
    <div className="relative flex rounded-[8px] border border-gray-400 p-6 pb-4 text-gray-text">
      <div className="absolute top-[5px] right-[5px] flex items-center gap-2">
        <div className="h-[14px] w-[60px] rounded-[16px] bg-[#C3C3C3]" />
        <p>({item.status})</p>
        <button
          type="button"
          aria-label="Eliminar producto"
          disabled={isPending}
          onClick={() => {
            startTransition(async () => {
              await removeReservedProduct(item.product_id);
              onMutated();
            });
          }}
          className="cursor-pointer px-1 text-lg leading-none disabled:opacity-50"
        >
          ×
        </button>
      </div>
      {item.product.image_url ? (
        <img
          src={item.product.image_url}
          className="h-[94px] w-[78px] object-contain"
          alt={item.product.name}
        />
      ) : (
        <div className="flex h-[94px] w-[78px] items-center justify-center bg-light-gray text-[10px]">
          Sin imagen
        </div>
      )}
      <div className="ml-4 flex w-full flex-col justify-between gap-3 pt-3">
        <p className="text-[17px] text-[#747373]">{item.product.name}</p>
        <div className="flex justify-between">
          <ReservationQuantityControls
            productId={item.product_id}
            quantity={item.quantity}
            variant="sheet"
            onMutated={onMutated}
          />
          <h1 className="text-2xl font-bold text-[#747373]">
            {formatPrice(item.unit_price * item.quantity)}
          </h1>
        </div>
      </div>
    </div>
  );
}
