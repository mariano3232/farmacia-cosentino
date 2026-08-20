import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { formatPrice } from "@/lib/utils";
import {
  AdminReservationEditor,
  type AdminReservation,
} from "@/components/AdminReservationEditor";

type Nested<T> = T | T[] | null;

function first<T>(value: Nested<T>): T | null {
  if (Array.isArray(value)) return value[0] ?? null;
  return value ?? null;
}

export default async function ReservationsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: role } = await supabase
    .from("user_roles")
    .select("role")
    .eq("user_id", user.id)
    .maybeSingle();

  if (role?.role !== "admin") redirect("/");

  const { data: reservations } = await supabase
    .from("reservations")
    .select(
      `
      id, created_at, total, status, notas,
      users ( name, last_name, phone ),
      reservation_items ( id, quantity, unit_price, product:products ( name, image_url ) )
    `,
    )
    .order("created_at", { ascending: false });

  const rows: AdminReservation[] = (reservations ?? []).map((reservation) => {
    const customer = first(reservation.users);
    return {
      id: reservation.id,
      status: reservation.status ?? "pendiente",
      notas: reservation.notas,
      createdAt: reservation.created_at,
      customerName:
        [customer?.name, customer?.last_name].filter(Boolean).join(" ") ||
        "Sin datos",
      customerPhone: customer?.phone ?? null,
      items: (reservation.reservation_items ?? []).map((item) => {
        const product = first(item.product);
        return {
          id: item.id,
          quantity: Number(item.quantity ?? 0),
          unitPrice: Number(item.unit_price ?? 0),
          productName: product?.name ?? "Producto",
          imageUrl: product?.image_url ?? null,
        };
      }),
    };
  });

  return (
    <main className="mx-auto flex w-full max-w-[1512px] flex-1 flex-col px-4 py-20 sm:px-6 lg:px-[60px]">
      <h1 className="mb-6 text-2xl font-bold text-dark-green">Reservas</h1>
      <div className="overflow-x-auto rounded-lg border border-placeholder bg-white">
        <table className="w-full min-w-[720px] text-left text-sm text-gray-text">
          <thead className="border-b border-placeholder bg-[#F5F5F5] text-xs font-bold uppercase tracking-wide text-dark-green">
            <tr>
              <th className="px-4 py-3">#</th>
              <th className="px-4 py-3">Cliente</th>
              <th className="px-4 py-3">Productos</th>
              <th className="px-4 py-3">Total</th>
              <th className="px-4 py-3 float-end mr-10">Estado</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((reservation) => (
              <tr
                key={reservation.id}
                className="border-b border-placeholder last:border-0"
              >
                <td className="px-4 py-3 font-medium text-foreground">
                  {reservation.id}
                </td>
                <td className="px-4 py-3">
                  {reservation.customerName}
                  {reservation.customerPhone ? (
                    <span className="mt-0.5 block text-xs">
                      {reservation.customerPhone}
                    </span>
                  ) : null}
                </td>
                <td className="px-4 py-3">
                  {reservation.items
                    .map((item) => `${item.quantity}× ${item.productName}`)
                    .join(", ")}
                </td>
                <td className="px-4 py-3 font-medium text-foreground">
                  {formatPrice(
                    reservation.items.reduce(
                      (sum, item) => sum + item.unitPrice * item.quantity,
                      0,
                    ),
                  )}
                </td>
                <td className="px-4 py-3">
                  <AdminReservationEditor reservation={reservation} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {!rows.length ? (
          <p className="px-4 py-8 text-center text-sm text-gray-text">
            No hay reservas todavía.
          </p>
        ) : null}
      </div>
    </main>
  );
}
