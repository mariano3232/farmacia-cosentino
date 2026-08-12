"use client";

import { useActionState } from "react";
import Link from "next/link";
import {
  signIn,
  signInWithGoogle,
  signUp,
  type AuthState,
} from "@/app/auth/actions";
import { Button } from "@/components/ui/button";
import { GoogleIcon } from "@/components/icons";

const initialState: AuthState = { error: null };

type AuthFormProps = {
  mode: "login" | "register";
  oauthError?: string | null;
};

export function AuthForm({ mode, oauthError }: AuthFormProps) {
  const action = mode === "login" ? signIn : signUp;
  const [state, formAction, pending] = useActionState(action, initialState);

  const title = mode === "login" ? "Iniciar sesión" : "Crear cuenta";
  const submitLabel = mode === "login" ? "Entrar" : "Registrarme";
  const switchHref = mode === "login" ? "/register" : "/login";
  const switchLabel =
    mode === "login"
      ? "¿No tenés cuenta? Registrate"
      : "¿Ya tenés cuenta? Iniciá sesión";

  return (
    <div className="w-full max-w-md flex flex-col">
      <h1 className="font-inter font-bold text-base m-auto text-dark-green sm:text-4xl">
        {title}
      </h1>
      <p className="mt-2 text-sm text-gray-text m-auto">
        Accede para reservar productos.
      </p>

      <form action={signInWithGoogle} className="mt-8">
        <Button
          type="submit"
          variant="outline"
          size="lg"
          className="h-11 w-full gap-2 border-placeholder text-foreground"
        >
          <GoogleIcon className="size-4" />
          Continuar con Google
        </Button>
      </form>

      <div className="my-6 flex items-center gap-3">
        <div className="h-px flex-1 bg-placeholder" />
        <span className="text-xs text-gray-text">o con email</span>
        <div className="h-px flex-1 bg-placeholder" />
      </div>

      <form action={formAction} className="flex flex-col gap-4">
        <label className="flex flex-col gap-1.5">
          <span className="text-xs font-semibold text-dark-green">Email</span>
          <input
            name="email"
            type="email"
            required
            autoComplete="email"
            className="h-11 rounded-lg border border-placeholder bg-white px-3 text-sm outline-none focus:border-medium-green"
          />
        </label>

        <label className="flex flex-col gap-1.5">
          <span className="text-xs font-semibold text-dark-green">
            Contraseña
          </span>
          <input
            name="password"
            type="password"
            required
            minLength={6}
            autoComplete={
              mode === "login" ? "current-password" : "new-password"
            }
            className="h-11 rounded-lg border border-placeholder bg-white px-3 text-sm outline-none focus:border-medium-green"
          />
        </label>

        {(state.error || oauthError) && (
          <p className="text-sm text-offers-red" role="alert">
            {state.error ?? oauthError}
          </p>
        )}

        {state.success && (
          <p className="text-sm text-medium-green" role="status">
            {state.success}
          </p>
        )}

        <Button
          type="submit"
          size="lg"
          disabled={pending}
          className="mt-1 h-11 w-full bg-dark-green text-white hover:bg-dark-green/90"
        >
          {pending ? "Esperá..." : submitLabel}
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-gray-text">
        <Link
          href={switchHref}
          className="font-medium text-medium-green hover:text-dark-green"
        >
          {switchLabel}
        </Link>
      </p>
    </div>
  );
}
