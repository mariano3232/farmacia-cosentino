"use client";

import { useActionState } from "react";
import {
  updateProfile,
  type ProfileState,
  type ProfileValues,
} from "@/app/account/actions";
import { Button } from "@/components/ui/button";

const initialState: ProfileState = { error: null, success: null };

const fields: { name: keyof ProfileValues; label: string; type: string }[] = [
  { name: "name", label: "Nombre", type: "text" },
  { name: "last_name", label: "Apellido", type: "text" },
  { name: "dni", label: "DNI", type: "text" },
  { name: "phone", label: "Teléfono", type: "tel" },
  { name: "birth_date", label: "Fecha de nacimiento", type: "date" },
];

type AccountProfileFormProps = {
  initialValues: ProfileValues;
};

export function AccountProfileForm({ initialValues }: AccountProfileFormProps) {
  const [state, formAction, pending] = useActionState(
    updateProfile,
    initialState,
  );

  return (
    <form
      action={formAction}
      className="flex w-full flex-col gap-5 rounded-[10px] border border-placeholder px-6 py-8 sm:px-10 sm:py-10"
    >
      {fields.map((field) => (
        <label key={field.name} className="flex flex-col gap-2">
          <span className="text-sm font-medium text-foreground">
            {field.label}
          </span>
          <input
            name={field.name}
            type={field.type}
            defaultValue={initialValues[field.name]}
            autoComplete={
              field.name === "name"
                ? "given-name"
                : field.name === "last_name"
                  ? "family-name"
                  : field.name === "phone"
                    ? "tel"
                    : field.name === "birth_date"
                      ? "bday"
                      : "off"
            }
            className="h-12 rounded-lg border border-placeholder bg-white px-3 text-sm outline-none focus:border-medium-green"
          />
        </label>
      ))}

      {state.error && (
        <p className="text-sm text-offers-red" role="alert">
          {state.error}
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
        className="mt-2 h-12 w-full rounded-lg bg-dark-green text-sm font-bold tracking-wide text-white uppercase hover:bg-dark-green/90"
      >
        {pending ? "Guardando..." : "Guardar cambios"}
      </Button>
    </form>
  );
}
