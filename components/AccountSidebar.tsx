import Link from "next/link";
import { signOut } from "@/app/auth/actions";
import { cn } from "@/lib/utils";

type AccountSidebarProps = {
  section: "datos" | "pedidos";
};

const links = [
  { href: "/account", section: "datos" as const, label: "Mis Datos" },
  {
    href: "/account?section=pedidos",
    section: "pedidos" as const,
    label: "Mis Pedidos",
  },
];

export function AccountSidebar({ section }: AccountSidebarProps) {
  return (
    <aside className="flex w-full mt-5 shrink-0 flex-col gap-5 sm:w-40">
      <nav className="flex flex-row gap-6 sm:flex-col sm:gap-5">
        {links.map((link) => {
          const active = section === link.section;
          return (
            <Link
              key={link.section}
              href={link.href}
              className={cn(
                "w-fit text-sm font-bold transition-colors",
                active
                  ? "border-b border-medium-green pb-0.5 text-medium-green"
                  : "text-gray-text hover:text-dark-green",
              )}
            >
              {link.label}
            </Link>
          );
        })}
      </nav>

      <form action={signOut}>
        <button
          type="submit"
          className="text-sm font-bold text-gray-text transition-colors hover:text-dark-green"
        >
          Cerrar Sesión
        </button>
      </form>
    </aside>
  );
}
