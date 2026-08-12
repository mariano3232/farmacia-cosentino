"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export type ProfileState = {
  error: string | null;
  success: string | null;
};

export type ProfileValues = {
  name: string;
  last_name: string;
  dni: string;
  phone: string;
  birth_date: string;
};

export async function updateProfile(
  _prev: ProfileState,
  formData: FormData,
): Promise<ProfileState> {
  const name = String(formData.get("name") ?? "").trim();
  const last_name = String(formData.get("last_name") ?? "").trim();
  const dni = String(formData.get("dni") ?? "").trim();
  const phone = String(formData.get("phone") ?? "").trim();
  const birth_date = String(formData.get("birth_date") ?? "").trim();

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Tenés que iniciar sesión.", success: null };
  }

  const { error } = await supabase.from("users").upsert(
    {
      user_uid: user.id,
      name: name || null,
      last_name: last_name || null,
      dni: dni || null,
      phone: phone || null,
      birth_date: birth_date || null,
    },
    { onConflict: "user_uid" },
  );

  if (error) {
    return { error: error.message, success: null };
  }

  revalidatePath("/account");
  return { error: null, success: "Cambios guardados." };
}
