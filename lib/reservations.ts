export const RESERVATION_STATUSES = [
  "cancelado",
  "pendiente",
  "confirmado",
  "para retirar",
  "retirado",
] as const;

export type ReservationStatus = (typeof RESERVATION_STATUSES)[number];

export const RESERVATION_STATUS_LABELS: Record<ReservationStatus, string> = {
  cancelado: "Cancelado",
  pendiente: "Pendiente",
  confirmado: "Confirmado",
  "para retirar": "Para retirar",
  retirado: "Retirado",
};

export function isReservationStatus(value: string): value is ReservationStatus {
  return (RESERVATION_STATUSES as readonly string[]).includes(value);
}
