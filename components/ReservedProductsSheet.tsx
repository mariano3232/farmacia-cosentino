"use client";

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
import { getCartItems } from "@/lib/cart";
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
  const [open, setOpen] = useState(false);
  const [cartItems, setCartItems] = useState<any>([])

  useEffect(() => {
    window.addEventListener('storage', () => {
      console.log("LISTENER STORAGE")
      const cartItemsStorage = getCartItems()
      setCartItems(cartItemsStorage || [])  
    });
  }, [])

  useEffect(() => {
    const openCart = () => setOpen(true);
    window.addEventListener("open-cart", openCart);
    return () => window.removeEventListener("open-cart", openCart);
  }, []);

  function addOne(product_id:any){
    let newProducts = cartItems
    let index = newProducts.findIndex( (e:any) => e.id == product_id )
    newProducts[index].quantity += 1
    localStorage.setItem("farmacia-reserved-products", JSON.stringify(newProducts));
    window.dispatchEvent(new Event('storage'))
  }
  function removeOne(product_id:any){
    let newProducts = cartItems
    let index = newProducts.findIndex( (e:any) => e.id == product_id )
    if (newProducts[index].quantity > 1){
      newProducts[index].quantity -= 1
      localStorage.setItem("farmacia-reserved-products", JSON.stringify(newProducts));
      window.dispatchEvent(new Event('storage'))
    }
  }
  
  function handleDelete(product_id:String){
    let newProducts = cartItems
    let index = newProducts.findIndex( (e:any) => e.id == product_id )
    if (index > -1) {
      newProducts.splice(index, 1);
      localStorage.setItem("farmacia-reserved-products", JSON.stringify(newProducts));
      window.dispatchEvent(new Event('storage'))
    }
  }

  function handleReserve(){
    
  }

  const total = cartItems.reduce(
    (sum:any, item:any) => sum + item.price * item.quantity,
    0,
  );

  return (
    <Sheet
      open={open} onOpenChange={setOpen}
      // onOpenChange={(open) => {
      //   if (open) getReservedProducts();
      // }}
    >
      <SheetTrigger
        aria-label="Productos reservados"
        className="flex cursor-pointer items-center justify-center gap-2 rounded-[5px] bg-dark-green p-2 text-[12px] text-white"
      >
        <div className="flex flex-col items-start leading-3">
          <span>Productos</span>
          <span>reservados ({cartItems?.length || 0})</span>
        </div>
        <CartIcon className="size-[18px]"/>
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

        {cartItems.length ? (
          <div className="mt-4 flex flex-col gap-6 px-8">
            {cartItems.map((item:any,i:any) => (
              <div key={item.id} className="relative flex rounded-[8px] border border-gray-400 p-6 pb-4 text-gray-text">
              <div className="absolute top-[5px] right-[5px] flex items-center gap-2">
                <div className="h-[14px] w-[60px] rounded-[16px] bg-[#C3C3C3]" />
                <p>({item.status || "Para reservar"})</p>
                <button
                  type="button"
                  aria-label="Eliminar producto"
                  onClick={() => {handleDelete(item.id)}}
                  className="cursor-pointer px-1 text-lg leading-none disabled:opacity-50"
                >
                  ×
                </button>
              </div>
              {item?.image_url ? (
                <img
                  src={item.image_url}
                  className="h-[94px] w-[78px] object-contain"
                  alt={item.name}
                />
              ) : (
                <div className="flex h-[94px] w-[78px] items-center justify-center bg-light-gray text-[10px]">
                  Sin imagen
                </div>
              )}
              <div className="ml-4 flex w-full flex-col justify-between gap-3 pt-3">
                <p className="text-[17px] text-[#747373]">{item.name}</p>
                <div className="flex justify-between">
                  <div className="text-xl flex gap-2 border items-center border-gray-500 rounded-[8px] px-4">
                    <button className="cursor-pointer" onClick={()=>{removeOne(item.id)}}>-</button>
                    {item?.quantity}
                    <button className="cursor-pointer" onClick={()=>{addOne(item.id)}}>+</button>
                  </div>
                  <h1 className="text-2xl font-bold text-[#747373]">
                    {formatPrice(item.price * item.quantity)}
                  </h1>
                </div>
              </div>
            </div>
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