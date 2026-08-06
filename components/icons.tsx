export function LogoIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 26 26"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <rect width="26" height="26" rx="4" fill="#006A4E" />
      <path
        d="M13 6v14M6 13h14"
        stroke="white"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function SearchIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 18 18"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <circle cx="8" cy="8" r="6" stroke="#8C8C8C" strokeWidth="1.5" />
      <path
        d="M12.5 12.5L16 16"
        stroke="#8C8C8C"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function CartIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 18 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <path
        d="M1 1h2.5l2.2 9.2a1 1 0 001 .8h7.6a1 1 0 00.98-.8L16.5 4H4.5"
        stroke="white"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="7.5" cy="14" r="1" fill="white" />
      <circle cx="13.5" cy="14" r="1" fill="white" />
    </svg>
  );
}

export function HeadsetIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <path
        d="M4 10a6 6 0 0112 0v3a2 2 0 01-2 2h-1v-5H7v5H6a2 2 0 01-2-2v-3z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
    </svg>
  );
}
