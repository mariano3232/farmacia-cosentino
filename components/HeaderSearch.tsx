"use client";

import { useRouter, useSearchParams } from "next/navigation";
import type { FormEvent } from "react";
import { EnterIcon, SearchIcon } from "./icons";

function SearchForm({ defaultQuery = "" }: { defaultQuery?: string }) {
  const router = useRouter();

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const q = String(formData.get("q") ?? "").trim();

    if (q) {
      router.push(`/products?q=${encodeURIComponent(q)}`);
      return;
    }

    router.push("/products");
  }

  return (
    <form
      role="search"
      action="/products"
      onSubmit={onSubmit}
      className="flex h-[38px] w-full min-w-0 items-center gap-3 rounded-md border border-placeholder bg-white px-4 lg:order-2 lg:mx-auto lg:max-w-[620]"
    >
      <SearchIcon className="size-[18px] shrink-0" />
      <input
        key={defaultQuery}
        type="search"
        name="q"
        defaultValue={defaultQuery}
        placeholder="¿Qué estás buscando?"
        aria-label="Buscar productos"
        className="w-full min-w-0 bg-transparent text-xs text-foreground outline-none placeholder:text-gray-text"
      />
      <button
        type="submit"
        title="Presioná Enter para buscar"
        aria-label="Buscar productos"
        className="inline-flex shrink-0 items-center gap-1 rounded border border-placeholder px-1.5 py-0.5 text-[10px] font-medium tracking-wide text-gray-text transition-colors hover:border-dark-green hover:text-dark-green"
      >
        <EnterIcon className="size-3.5" />
        <span className="hidden sm:inline">Enter</span>
      </button>
    </form>
  );
}

export function HeaderSearch() {
  const searchParams = useSearchParams();
  return <SearchForm defaultQuery={searchParams.get("q") ?? ""} />;
}

export function HeaderSearchFallback() {
  return <SearchForm />;
}
