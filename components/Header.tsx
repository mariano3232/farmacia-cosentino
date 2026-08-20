import Link from "next/link";
import { Suspense } from "react";
import { HeaderSearch, HeaderSearchFallback } from "./HeaderSearch";
import { ReservedProductsSheet } from "./ReservedProductsSheet";
import { createClient } from "@/lib/supabase/server";
import { signOut } from "@/app/auth/actions";
import { Button } from "@/components/ui/button";

export async function Header() {
  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();
  const user = data?.claims;
  const { data: roles } = await supabase.from("user_roles").select("role");
  const isAdmin = roles?.[0]?.role === "admin";
  
  return (
    <header className="bg-white shadow-[0_4px_4px_rgba(140,140,140,0.1)]">
      <div className="mx-auto flex max-w-[1512px] flex-col gap-4 px-4 py-4 sm:px-6 lg:flex-row lg:px-30 lg:gap-4 lg:py-6">
        <div className="flex items-center justify-between lg:contents">
          <div className="flex min-w-0 shrink-0 items-center gap-2 sm:gap-3 lg:order-1">
            <img src="/logo.png" alt="" className="size-6 shrink-0" />
            <Link
              href="/"
              className="relative top-0.5 overflow-visible font-editorial text-[24px] leading-none text-medium-green"
            >
              FARMACIA COSENTINO
            </Link>
          </div>

          <div className="flex shrink-0 items-center gap-4 lg:order-3 lg:gap-6">
            <nav className="hidden items-center gap-8 md:flex">
              <a
                href="#"
                className="text-xs font-bold text-gray-text transition-colors hover:text-dark-green"
              >
                Contacto
              </a>
              {isAdmin ? (
                <Link
                  href="/reservations"
                  className="text-xs font-bold text-gray-text transition-colors hover:text-dark-green"
                >
                  Reservas
                </Link>
              ) : null}
              {user ? (
                <Link href="/account">
                  <Button
                    type="submit"
                    variant="ghost"
                    className="h-auto p-0 text-xs font-bold text-gray-text hover:bg-transparent hover:text-dark-green"
                  >
                    Mi cuenta
                  </Button>
                </Link>
              ) : (
                <Link
                  href="/login"
                  className="text-xs font-bold text-gray-text transition-colors hover:text-dark-green"
                >
                  Iniciar sesión
                </Link>
              )}
            </nav>
            <ReservedProductsSheet />
          </div>
        </div>

        <Suspense fallback={<HeaderSearchFallback />}>
          <HeaderSearch />
        </Suspense>
      </div>
    </header>
  );
}
