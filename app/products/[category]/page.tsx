const categoryLabels: Record<string, string> = {
  ofertas: "Ofertas",
  insumos: "Insumos",
  medicamentos: "Medicamentos",
  perfumeria: "Perfumería",
  "cuidado-personal": "Cuidado Personal",
  belleza: "belleza",
  bebes: "Bebes",
  otros: "Otros",
};

export default async function ProductsCategoryPage({
  params,
}: PageProps<"/products/[category]">) {
  const { category } = await params;
  const label = categoryLabels[category] ?? category;

  return (
    <main className="flex flex-1 flex-col bg-white">
      <div className="mx-auto w-full max-w-[1512px] px-4 py-8 sm:px-6 lg:px-[60px]">
        <h1 className="font-bold text-2xl text-gray-text">{label}</h1>
        <p className="mt-2 text-sm text-gray-text">
          Catálogo de {label.toLowerCase()}.
        </p>
      </div>
    </main>
  );
}
