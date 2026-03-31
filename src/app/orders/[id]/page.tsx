export default async function OrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <div className="bg-white rounded-lg shadow-md p-6"><h2 className="text-xl font-semibold mb-4">Orden #{id}</h2><p className="text-gray-500">Detalle — pendiente de implementar</p></div>;
}
