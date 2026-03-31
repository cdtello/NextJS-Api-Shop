export default function ProductsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="max-w-4xl mx-auto py-8 px-6 w-full">
      <h1 className="text-2xl font-bold mb-6">Gestion de Productos</h1>
      {children}
    </div>
  );
}
