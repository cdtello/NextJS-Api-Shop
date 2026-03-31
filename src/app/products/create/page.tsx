"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { productsService } from "@/modules/products";
import { ApiError } from "@/lib/api";

export default function CreateProductPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({
    sku: "",
    name: "",
    description: "",
    price: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      await productsService.create({
        sku: form.sku,
        name: form.name,
        description: form.description || undefined,
        price: Number(form.price),
      });
      router.push("/products");
    } catch (err) {
      if (err instanceof ApiError) {
        if (err.status === 409) {
          setError("Ya existe un producto con ese SKU");
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
      <h2 className="text-xl font-semibold">Crear Producto</h2>

      {error && (
        <div className="bg-red-50 border border-red-200 p-3 rounded text-red-800 text-sm">
          {error}
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          SKU
        </label>
        <input
          name="sku"
          value={form.sku}
          onChange={handleChange}
          required
          className="w-full border border-gray-300 rounded-md p-2"
          placeholder="Ej: ABC-123"
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
          placeholder="Ej: Proteina Whey"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Descripcion (opcional)
        </label>
        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          className="w-full border border-gray-300 rounded-md p-2"
          placeholder="Ej: Proteina de suero de leche 2kg"
          rows={3}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Precio
        </label>
        <input
          name="price"
          type="number"
          step="0.01"
          value={form.price}
          onChange={handleChange}
          required
          className="w-full border border-gray-300 rounded-md p-2"
          placeholder="Ej: 29.99"
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
          href="/products"
          className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
        >
          Cancelar
        </Link>
      </div>
    </form>
  );
}
