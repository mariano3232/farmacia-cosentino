import Link from "next/link";

export default function AuthErrorPage() {
  return (
    <main className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center px-4 py-16">
      <h1 className="font-editorial text-3xl text-dark-green">
        Error de autenticación
      </h1>
      <p className="mt-3 text-sm text-gray-text">
        No se pudo completar el inicio de sesión. Probá de nuevo o volvé al
        inicio.
      </p>
      <Link
        href="/login"
        className="mt-8 inline-flex h-10 items-center justify-center rounded-lg bg-dark-green px-4 text-sm font-medium text-white hover:bg-dark-green/90"
      >
        Ir al login
      </Link>
    </main>
  );
}
