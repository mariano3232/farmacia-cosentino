export function Footer() {
  return (
    <footer className="mt-auto p-15 px-30 h-[350px] bg-[#F5F5F5] shadow-2xl">
      <div className="">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
          <p className="font-bold text-2xl leading-none text-medium-green">
            FARMACIA COSENTINO
          </p>

          <div className="flex flex-col items-start gap-6 sm:items-end">
            <p className="text-right text-[25px] font-bold leading-tight text-gray-text">
              Belgrano 302, San Cayetano
            </p>
            <button
              type="button"
              className="rounded-[3px] bg-offers-red px-5 py-3 text-xs font-extrabold tracking-[0.03em] text-white transition-opacity hover:opacity-90"
            >
              BOTÓN DE ARREPENTIMIENTO
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
