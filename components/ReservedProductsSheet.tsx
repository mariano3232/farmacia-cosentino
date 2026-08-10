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

export function ReservedProductsSheet() {
  return (
    <Sheet>
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
        className="w-full max-w-sm gap-0 bg-white text-foreground sm:max-w-md"
      >
        <SheetHeader className="border-b border-placeholder">
          <SheetTitle className="font-bold text-dark-green">
            Productos reservados
          </SheetTitle>
          <SheetDescription>
            Productos que guardaste para retirar.
          </SheetDescription>
        </SheetHeader>

        <div className="flex flex-1 flex-col items-center justify-center gap-2 px-4 text-center text-gray-text">
          <p className="text-sm">Todavía no tenés productos reservados.</p>
        </div>

        <SheetFooter className="border-t border-placeholder">
          <button
            type="button"
            className="w-full rounded-[5px] bg-dark-green px-4 py-2.5 text-sm font-bold text-white transition-opacity hover:opacity-90"
          >
            $$$$$ Pagar $$$$$$$
          </button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
