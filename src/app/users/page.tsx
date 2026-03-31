"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usersService } from "@/modules/users";
import { User } from "@/types/api";

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    usersService
      .getAll()
      .then(setUsers)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const handleDelete = async (id: number) => {
    if (!confirm("Eliminar este usuario?")) return;
    try {
      await usersService.delete(id);
      setUsers((prev) => prev.filter((u) => u.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al eliminar");
    }
  };

  if (loading) return <p className="text-center py-8">Cargando...</p>;
  if (error)
    return <p className="text-center py-8 text-red-600">Error: {error}</p>;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <p className="text-gray-600">{users.length} usuarios registrados</p>
        <Link
          href="/users/create"
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Nuevo Usuario
        </Link>
      </div>

      {users.length === 0 ? (
        <p className="text-gray-500 text-center py-8">No hay usuarios aun.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {users.map((user) => (
            <div key={user.id} className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold">{user.name}</h3>
              <p className="text-gray-600 text-sm">{user.email}</p>
              <p className="text-gray-400 text-sm mt-1">Edad: {user.age}</p>
              <div className="flex gap-3 mt-4 text-sm">
                <Link
                  href={`/users/${user.id}`}
                  className="text-blue-600 hover:underline"
                >
                  Ver
                </Link>
                <Link
                  href={`/users/${user.id}/edit`}
                  className="text-yellow-600 hover:underline"
                >
                  Editar
                </Link>
                <button
                  onClick={() => handleDelete(user.id)}
                  className="text-red-600 hover:underline"
                >
                  Eliminar
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
