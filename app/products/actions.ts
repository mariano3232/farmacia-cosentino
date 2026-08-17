"use server";

import { createClient } from "@/lib/supabase/server";
import { refresh } from "next/cache";
import { redirect } from "next/navigation";

type ReservationItemRow = {
  id: number;
  product_id: number | null;
  quantity: number | null;
};

async function requireUser() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  return { supabase, user };
}

function parseProductId(value: number) {
  if (!Number.isInteger(value) || value <= 0) return null;
  return value;
}

async function findItem(
  supabase: Awaited<ReturnType<typeof createClient>>,
  userId: string,
  productId: number,
) {
  const { data: reservations } = await supabase
    .from("reservations")
    .select("id, reservation_items(id, product_id, quantity)")
    .eq("user_uid", userId)

  for (const reservation of reservations ?? []) {
    const items = Array.isArray(reservation.reservation_items)
      ? (reservation.reservation_items as ReservationItemRow[])
      : [];
    const item = items.find((row) => row.product_id === productId);
    if (item) {
      return {
        reservationId: reservation.id as number,
        itemId: item.id,
        quantity: Number(item.quantity ?? 0),
      };
    }
  }

  return null;
}

async function getOrCreatePendingReservation(
  supabase: Awaited<ReturnType<typeof createClient>>,
  userId: string,
) {
  const { data: existing } = await supabase
    .from("reservations")
    .select("id")
    .eq("user_uid", userId)
    .eq("status", "pending")
    .order("created_at", { ascending: false })
    .limit(1);

  if (existing?.[0]?.id) {
    return existing[0].id as number;
  }

  const { data: reservation, error } = await supabase
    .from("reservations")
    .insert({
      user_uid: userId,
      status: "pending",
      total: 0,
    })
    .select("id")
    .single();

  if (error || !reservation) {
    console.error("reservation error:", error);
    return null;
  }

  return reservation.id as number;
}

async function syncReservationTotal(
  supabase: Awaited<ReturnType<typeof createClient>>,
  reservationId: number,
) {
  const { data: items } = await supabase
    .from("reservation_items")
    .select("quantity, unit_price")
    .eq("reservation_id", reservationId);

  const total = (items ?? []).reduce((sum, item) => {
    const quantity = Number(item.quantity ?? 0);
    if (quantity <= 0) return sum;
    return sum + quantity * Number(item.unit_price ?? 0);
  }, 0);

  const { error } = await supabase
    .from("reservations")
    .update({ total })
    .eq("id", reservationId);

  if (error) {
    console.error("reservation total error:", error);
  }
}

export async function adjustReservedQuantity(productId: number, delta: number) {
  const id = parseProductId(productId);
  if (!id || !Number.isInteger(delta) || delta === 0) {
    return;
  }

  const { supabase, user } = await requireUser();
  const pendingItem = await findItem(supabase, user.id, id);

  if (pendingItem) {
    const nextQuantity = pendingItem.quantity + delta;
    if (nextQuantity < 1) {
      return;
    }

    const { error } = await supabase
      .from("reservation_items")
      .update({ quantity: nextQuantity })
      .eq("id", pendingItem.itemId);

    if (error) {
      console.error("reservation item update error:", error);
      return;
    }

    await syncReservationTotal(supabase, pendingItem.reservationId);
    refresh();
    return;
  }

  if (delta < 1) {
    return;
  }

  const { data: product } = await supabase
    .from("products")
    .select("price")
    .eq("id", id)
    .maybeSingle();

  const reservationId = await getOrCreatePendingReservation(supabase, user.id);
  if (!reservationId) {
    return;
  }

  const { error: itemError } = await supabase.from("reservation_items").insert({
    reservation_id: reservationId,
    product_id: id,
    unit_price: product?.price ?? null,
    quantity: 1,
  });

  if (itemError) {
    console.error("reservation item error:", itemError);
    return;
  }

  await syncReservationTotal(supabase, reservationId);
  refresh();
}

export async function reserveProduct(productId: number) {
  await adjustReservedQuantity(productId, 1);
}

export async function removeReservedProduct(productId: number) {
  const id = parseProductId(productId);
  if (!id) {
    return;
  }

  const { supabase, user } = await requireUser();
  const pendingItem = await findItem(supabase, user.id, id);
  if (!pendingItem) {
    return;
  }

  const { error } = await supabase
    .from("reservation_items")
    .update({ quantity: 0 })
    .eq("id", pendingItem.itemId);

  if (error) {
    console.error("reservation item remove error:", error);
    return;
  }

  await syncReservationTotal(supabase, pendingItem.reservationId);
  refresh();
}
