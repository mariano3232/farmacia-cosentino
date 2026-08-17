"use client";

import {
  adjustReservedQuantity,
  removeReservedProduct,
} from "@/app/products/actions";
import { useOptimistic, useTransition } from "react";

type ReservationQuantityControlsProps = {
  productId: number;
  quantity: number;
  variant?: "card" | "sheet";
  onMutated?: () => void;
};

export function ReservationQuantityControls({
  productId,
  quantity,
  variant = "card",
  onMutated,
}: ReservationQuantityControlsProps) {
  const [isPending, startTransition] = useTransition();
  const [optimisticQuantity, setOptimisticQuantity] = useOptimistic(quantity);

  function run(nextQuantity: number, action: () => Promise<void>) {
    startTransition(async () => {
      setOptimisticQuantity(nextQuantity);
      await action();
      onMutated?.();
    });
  }

  if (optimisticQuantity < 1) {
    return (
      <button
        type="button"
        disabled={isPending}
        onClick={() => run(1, () => adjustReservedQuantity(productId, 1))}
        className="cursor-pointer rounded-[5px] bg-medium-green px-5 py-1 text-sm text-white disabled:opacity-60"
      >
        Reservar
      </button>
    );
  }

  const stepperClass =
    variant === "sheet"
      ? "flex w-fit items-center gap-4 rounded-[6px] border border-gray-400 px-2 text-[20px] text-[#747373]"
      : "flex w-fit items-center gap-3 rounded-[6px] border border-medium-green bg-white px-2 py-0.5 text-sm text-medium-green";

  return (
    <div className="flex items-center gap-2">
      <div className={stepperClass}>
        <button
          type="button"
          aria-label="Restar"
          disabled={isPending || optimisticQuantity <= 1}
          onClick={() =>
            run(optimisticQuantity - 1, () =>
              adjustReservedQuantity(productId, -1),
            )
          }
          className="cursor-pointer px-1 disabled:cursor-not-allowed disabled:opacity-40"
        >
          -
        </button>
        <span className="min-w-[1.25rem] text-center">{optimisticQuantity}</span>
        <button
          type="button"
          aria-label="Sumar"
          disabled={isPending}
          onClick={() =>
            run(optimisticQuantity + 1, () =>
              adjustReservedQuantity(productId, 1),
            )
          }
          className="cursor-pointer px-1 disabled:opacity-60"
        >
          +
        </button>
      </div>
      {variant === "card" ? (
        <button
          type="button"
          aria-label="Eliminar"
          disabled={isPending}
          onClick={() => run(0, () => removeReservedProduct(productId))}
          className="cursor-pointer rounded-[5px] px-2 py-0.5 text-lg leading-none text-medium-green disabled:opacity-60"
        >
          ×
        </button>
      ) : null}
    </div>
  );
}
