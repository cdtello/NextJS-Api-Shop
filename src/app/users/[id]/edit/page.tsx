"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { usersService } from "@/modules/users";
import { ApiError } from "@/lib/api";

export default function EditUserPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({
    name: "",
    email: "",
    age: "",
  });

  useEffect(() => {
    usersService
      .getById(Number(id))
      .then((user) => {
        setForm({
          name: user.name,
          email: user.email,
          age: String(user.age),
        });
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      await usersService.update(Number(id), {
        name: form.name,
        email: form.email,
        age: Number(form.age),
      });
      router.push(`/users/${id}`);
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
      }
    }
  };

  if (loading) return <p className="text-center py-8">Cargando...</p>;

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white rounded-lg shadow-md p-6 max-w-lg space-y-4"
    >
      <h2 className="text-xl font-semibold">Editar Usuario #{id}</h2>

      {error && (
        <div className="bg-red-50 border border-red-200 p-3 rounded text-red-800 text-sm">
          {error}
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Nombre
        </label>
        <input
          name="name"
          value={form.name}
          onChange={handleChange}
          required
          className="w-full border border-gray-300 rounded-md p-2"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Email
        </label>
        <input
          name="email"
          type="email"
          value={form.email}
          onChange={handleChange}
          required
          className="w-full border border-gray-300 rounded-md p-2"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Edad
        </label>
        <input
          name="age"
          type="number"
          value={form.age}
          onChange={handleChange}
          required
          className="w-full border border-gray-300 rounded-md p-2"
        />
      </div>

      <div className="flex gap-3 pt-2">
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Guardar
        </button>
        <Link
          href={`/users/${id}`}
          className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
        >
          Cancelar
        </Link>
      </div>
    </form>
  );
}
