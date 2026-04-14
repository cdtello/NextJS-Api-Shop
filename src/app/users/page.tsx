"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usersService } from "@/modules/users";
import { User } from "@/types/api";
import { UserCard } from "@/components/users/UserCard";

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
            <UserCard key={user.id} user={user} onDelete={handleDelete} />
          ))}
        </div>
      )}
    </div>
  );
}
