"use client";

import { useEffect, useState, useTransition } from "react";
import {
  updateReservation,
  updateReservationStatus,
} from "@/app/reservations/actions";
import {
  RESERVATION_STATUS_LABELS,
  RESERVATION_STATUSES,
  type ReservationStatus,
} from "@/lib/reservations";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { toast } from "@/components/ui/toast";
import { formatPrice } from "@/lib/utils";

export type AdminReservationItem = {
  id: number;
  quantity: number;
  unitPrice: number;
  productName: string;
  imageUrl: string | null;
};

export type AdminReservation = {
  id: number;
  status: string;
  notas: string | null;
  createdAt: string;
  customerName: string;
  customerPhone: string | null;
  items: AdminReservationItem[];
};

function statusClass(status: string) {
  switch (status) {
    case "confirmado":
      return "border-medium-green text-dark-green";
    case "para retirar":
      return "border-dark-green bg-dark-green/5 text-dark-green";
    case "retirado":
      return "border-placeholder bg-[#F5F5F5] text-gray-text";
    case "cancelado":
      return "border-red-300 text-red-700";
    default:
      return "border-placeholder text-gray-text";
  }
}

export function AdminReservationEditor({
  reservation,
}: {
  reservation: AdminReservation;
}) {
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [notas, setNotas] = useState(reservation.notas ?? "");
  const [status, setStatus] = useState(reservation.status);
  const [items, setItems] = useState(reservation.items);
  const [pending, startTransition] = useTransition();

  useEffect(() => {
    if (open) return;
    setStatus(reservation.status);
    setNotas(reservation.notas ?? "");
    setItems(reservation.items);
  }, [reservation, open]);

  const total = items.reduce(
    (sum, item) => sum + item.unitPrice * item.quantity,
    0,
  );

  function changeQuantity(itemId: number, delta: number) {
    setItems((current) =>
      current.map((item) =>
        item.id === itemId
          ? { ...item, quantity: Math.max(0, item.quantity + delta) }
          : item,
      ),
    );
  }

  function changeStatus(next: string) {
    setStatus(next);
    const formData = new FormData();
    formData.set("id", String(reservation.id));
    formData.set("status", next);
    startTransition(async () => {
      try {
        await updateReservationStatus(formData);
      } catch {
        setStatus(reservation.status);
        toast.add({
          title: "No se pudo actualizar el estado",
          type: "error",
        });
      }
    });
  }

  async function handleSave(formData: FormData) {
    setSaving(true);
    try {
      await updateReservation(formData);
      toast.add({
        title: "Pedido actualizado",
        type: "success",
      });
      setOpen(false);
    } catch {
      toast.add({
        title: "No se pudo guardar el pedido",
        type: "error",
      });
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="flex items-center justify-end gap-2">
      <select
        aria-label="Estado del pedido"
        value={status}
        disabled={pending}
        onChange={(event) => changeStatus(event.target.value)}
        className={`h-8 max-w-[140px] rounded-md border bg-white px-2 text-xs font-medium capitalize outline-none ${statusClass(status)}`}
      >
        {RESERVATION_STATUSES.map((value) => (
          <option key={value} value={value}>
            {RESERVATION_STATUS_LABELS[value as ReservationStatus]}
          </option>
        ))}
      </select>
      <button
        type="button"
        onClick={() => {
          setNotas(reservation.notas ?? "");
          setStatus(reservation.status);
          setItems(reservation.items);
          setOpen(true);
        }}
        className="rounded-md border border-placeholder px-3 py-1.5 text-xs font-bold text-dark-green hover:bg-[#F5F5F5]"
      >
        Editar
      </button>

      <Sheet
        open={open}
        onOpenChange={(next) => {
          setOpen(next);
          if (!next) {
            setStatus(reservation.status);
            setNotas(reservation.notas ?? "");
            setItems(reservation.items);
          }
        }}
      >
        <SheetContent
          side="right"
          className="w-full max-w-sm gap-0 overflow-y-auto bg-white text-foreground sm:max-w-md md:min-w-[450px]"
        >
          <SheetHeader className="border-b border-placeholder">
            <SheetTitle className="font-bold text-dark-green">
              Pedido #{reservation.id}
            </SheetTitle>
            <SheetDescription>
              {reservation.customerName}
              {reservation.customerPhone ? ` · ${reservation.customerPhone}` : ""}
              {" · "}
              {new Date(reservation.createdAt).toLocaleDateString("es-AR")}
            </SheetDescription>
          </SheetHeader>

          <form action={handleSave} className="flex flex-1 flex-col">
            <input type="hidden" name="id" value={reservation.id} />
            {items.map((item) => (
              <input
                key={item.id}
                type="hidden"
                name={`qty_${item.id}`}
                value={item.quantity}
              />
            ))}

            <div className="flex flex-col gap-6 px-6 py-5">
              <label className="flex flex-col gap-1.5 text-sm text-gray-text">
                Estado
                <select
                  name="status"
                  value={status}
                  onChange={(event) => setStatus(event.target.value)}
                  className="h-10 rounded-lg border border-placeholder bg-white px-3 text-sm text-foreground outline-none focus:border-medium-green"
                >
                  {RESERVATION_STATUSES.map((value) => (
                    <option key={value} value={value}>
                      {RESERVATION_STATUS_LABELS[value as ReservationStatus]}
                    </option>
                  ))}
                </select>
              </label>

              <div className="flex flex-col gap-3">
                <p className="text-sm font-bold text-dark-green">Productos</p>
                {items.length ? (
                  items.map((item) => (
                    <div
                      key={item.id}
                      className="flex gap-3 rounded-[8px] border border-placeholder p-3"
                    >
                      {item.imageUrl ? (
                        <img
                          src={item.imageUrl}
                          alt={item.productName}
                          className="h-[72px] w-[60px] object-contain"
                        />
                      ) : (
                        <div className="flex h-[72px] w-[60px] items-center justify-center bg-light-gray text-[10px] text-gray-text">
                          Sin imagen
                        </div>
                      )}
                      <div className="flex min-w-0 flex-1 flex-col justify-between">
                        <p className="text-sm text-[#747373]">{item.productName}</p>
                        <div className="flex items-center justify-between gap-2">
                          <div className="flex items-center gap-3 rounded-[8px] border border-gray-500 px-3 py-1 text-sm">
                            <button
                              type="button"
                              onClick={() => changeQuantity(item.id, -1)}
                              className="cursor-pointer"
                              aria-label="Restar"
                            >
                              −
                            </button>
                            <span>{item.quantity}</span>
                            <button
                              type="button"
                              onClick={() => changeQuantity(item.id, 1)}
                              className="cursor-pointer"
                              aria-label="Sumar"
                            >
                              +
                            </button>
                          </div>
                          <p className="text-sm font-bold text-[#747373]">
                            {formatPrice(item.unitPrice * item.quantity)}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-gray-text">
                    Este pedido no tiene productos.
                  </p>
                )}
              </div>

              <label className="flex flex-col gap-1.5 text-sm text-gray-text">
                Notas
                <textarea
                  name="notas"
                  value={notas}
                  onChange={(event) => setNotas(event.target.value)}
                  rows={3}
                  className="rounded-lg border border-placeholder bg-white px-3 py-2 text-sm text-foreground outline-none focus:border-medium-green"
                  placeholder="Notas internas del pedido"
                />
              </label>
            </div>

            <SheetFooter className="border-t border-placeholder">
              <div className="mb-2 flex w-full justify-between text-sm font-bold text-dark-green">
                <span>Total</span>
                <span>{formatPrice(total)}</span>
              </div>
              <button
                type="submit"
                disabled={saving}
                className="w-full cursor-pointer rounded-[5px] bg-dark-green px-4 py-2.5 text-sm font-bold text-white hover:opacity-90 disabled:opacity-50"
              >
                {saving ? "Guardando..." : "Guardar cambios"}
              </button>
            </SheetFooter>
          </form>
        </SheetContent>
      </Sheet>
    </div>
  );
}
