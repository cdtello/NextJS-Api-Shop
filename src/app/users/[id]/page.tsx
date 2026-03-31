"use client";

import { useState, useEffect, use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { usersService } from "@/modules/users";
import { User } from "@/types/api";

export default function UserDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    usersService
      .getById(Number(id))
      .then(setUser)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [id]);

  const handleDelete = async () => {
    if (!confirm("Eliminar este usuario?")) return;
    await usersService.delete(Number(id));
    router.push("/users");
  };

  if (loading) return <p className="text-center py-8">Cargando...</p>;
  if (error)
    return <p className="text-center py-8 text-red-600">Error: {error}</p>;
  if (!user) return <p className="text-center py-8">Usuario no encontrado</p>;

  return (
    <div className="bg-white rounded-lg shadow-md p-6 max-w-lg">
      <h2 className="text-xl font-semibold mb-4">{user.name}</h2>

      <dl className="space-y-3">
        <div>
          <dt className="text-sm text-gray-500">ID</dt>
          <dd className="font-medium">{user.id}</dd>
        </div>
        <div>
          <dt className="text-sm text-gray-500">Email</dt>
          <dd className="font-medium">{user.email}</dd>
        </div>
        <div>
          <dt className="text-sm text-gray-500">Edad</dt>
          <dd className="font-medium">{user.age} años</dd>
        </div>
      </dl>

      <div className="flex gap-3 mt-6">
        <Link
          href={`/users/${user.id}/edit`}
          className="px-4 py-2 bg-yellow-500 text-white rounded-md hover:bg-yellow-600"
        >
          Editar
        </Link>
        <button
          onClick={handleDelete}
          className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
        >
          Eliminar
        </button>
        <Link
          href="/users"
          className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
        >
          Volver
        </Link>
      </div>
    </div>
  );
}
