"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { isReservationStatus } from "@/lib/reservations";
import { createClient } from "@/lib/supabase/server";

async function requireAdmin() {
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
  return supabase;
}

export async function updateReservationStatus(formData: FormData) {
  const id = Number(formData.get("id"));
  const status = String(formData.get("status") ?? "");
  if (!Number.isInteger(id) || id <= 0 || !isReservationStatus(status)) return;

  const supabase = await requireAdmin();
  const { error } = await supabase
    .from("reservations")
    .update({ status })
    .eq("id", id);

  if (error) throw error;
  revalidatePath("/reservations");
}

export async function updateReservation(formData: FormData) {
  const id = Number(formData.get("id"));
  const status = String(formData.get("status") ?? "");
  const notas = String(formData.get("notas") ?? "").trim();
  if (!Number.isInteger(id) || id <= 0 || !isReservationStatus(status)) return;

  const supabase = await requireAdmin();

  const items: { id: number; quantity: number }[] = [];
  for (const [key, value] of formData.entries()) {
    if (!key.startsWith("qty_")) continue;
    const itemId = Number(key.slice(4));
    const quantity = Number(value);
    if (!Number.isInteger(itemId) || itemId <= 0) continue;
    if (!Number.isInteger(quantity) || quantity < 0) continue;
    items.push({ id: itemId, quantity });
  }

  for (const item of items) {
    if (item.quantity === 0) {
      const { error } = await supabase
        .from("reservation_items")
        .delete()
        .eq("id", item.id)
        .eq("reservation_id", id);
      if (error) throw error;
    } else {
      const { error } = await supabase
        .from("reservation_items")
        .update({ quantity: item.quantity })
        .eq("id", item.id)
        .eq("reservation_id", id);
      if (error) throw error;
    }
  }

  const { data: remaining, error: remainingError } = await supabase
    .from("reservation_items")
    .select("quantity, unit_price")
    .eq("reservation_id", id);
  if (remainingError) throw remainingError;

  const total = (remaining ?? []).reduce(
    (sum, item) =>
      sum + Number(item.quantity ?? 0) * Number(item.unit_price ?? 0),
    0,
  );

  const { error } = await supabase
    .from("reservations")
    .update({ status, notas: notas || null, total })
    .eq("id", id);

  if (error) throw error;
  revalidatePath("/reservations");
}
