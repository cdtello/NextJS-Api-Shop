export default async function ProductDetailPage({ params }: { params: Promise<{ sku: string }> }) {
  const { sku } = await params;
  return <div className="bg-white rounded-lg shadow-md p-6"><h2 className="text-xl font-semibold mb-4">Producto: {sku}</h2><p className="text-gray-500">Detalle — pendiente de implementar</p></div>;
}
