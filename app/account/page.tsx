import { redirect } from "next/navigation";
import { AccountProfileForm } from "@/components/AccountProfileForm";
import { AccountSidebar } from "@/components/AccountSidebar";
import { createClient } from "@/lib/supabase/server";
import type { ProfileValues } from "./actions";
import MyReservations from "@/components/MyReservations";

type AccountPageProps = {
  searchParams: Promise<{ section?: string }>;
};

function emptyProfile(): ProfileValues {
  return {
    name: "",
    last_name: "",
    dni: "",
    phone: "",
    birth_date: "",
  };
}

export default async function AccountPage({ searchParams }: AccountPageProps) {
  const params = await searchParams;
  const section = params.section === "pedidos" ? "pedidos" : "datos";

  const supabase = await createClient();
  const {data: { user }} = await supabase.auth.getUser();

  if (!user) {redirect("/login");}

  const { data: profile } = await supabase.from("users").select("name, last_name, dni, phone, birth_date").eq("user_uid", user.id).maybeSingle();


  const initialValues: ProfileValues = profile
    ? {
        name: profile.name ?? "",
        last_name: profile.last_name ?? "",
        dni: profile.dni ?? "",
        phone: profile.phone ?? "",
        birth_date: profile.birth_date ?? "",
      }
    : emptyProfile();

  return (
    <main className="mx-auto flex w-full max-w-[1512px] flex-1 px-4 py-10 sm:px-6 lg:px-[60px] lg:py-14">
      <div className="flex w-full flex-col gap-8 sm:flex-row sm:gap-12 lg:gap-16">
        <AccountSidebar section={section} />
        <div className="min-w-0 flex-1">
          {section === "datos" ? (
            <AccountProfileForm initialValues={initialValues} />
          ) : (
            <div className="rounded-[10px] border border-placeholder px-6 py-10 sm:px-10">
              <h1 className="text-lg font-bold text-dark-green">Mis Pedidos</h1>
              <MyReservations/>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
