export default async function EditUserPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <div className="bg-white rounded-lg shadow-md p-6"><h2 className="text-xl font-semibold mb-4">Editar Usuario #{id}</h2><p className="text-gray-500">Formulario de edicion — pendiente de implementar</p></div>;
}
