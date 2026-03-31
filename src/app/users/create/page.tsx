"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { usersService } from "@/modules/users";
import { ApiError } from "@/lib/api";

export default function CreateUserPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({
    id: "",
    name: "",
    email: "",
    age: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      await usersService.create({
        id: Number(form.id),
        name: form.name,
        email: form.email,
        age: Number(form.age),
      });
      router.push("/users");
    } catch (err) {
      if (err instanceof ApiError) {
        if (err.status === 409) {
          setError("Ya existe un usuario con ese ID o email");
        } else {
          setError(err.message);
        }
      }
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white rounded-lg shadow-md p-6 max-w-lg space-y-4"
    >
      <h2 className="text-xl font-semibold">Crear Usuario</h2>

      {error && (
        <div className="bg-red-50 border border-red-200 p-3 rounded text-red-800 text-sm">
          {error}
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          ID
        </label>
        <input
          name="id"
          type="number"
          value={form.id}
          onChange={handleChange}
          required
          className="w-full border border-gray-300 rounded-md p-2"
          placeholder="Ej: 1"
        />
      </div>

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
          placeholder="Ej: Juan Perez"
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
          placeholder="Ej: juan@email.com"
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
          placeholder="Ej: 25"
        />
      </div>

      <div className="flex gap-3 pt-2">
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Crear
        </button>
        <Link
          href="/users"
          className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
        >
          Cancelar
        </Link>
      </div>
    </form>
  );
}
