"use client";

import { useState, useEffect, use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { productsService } from "@/modules/products";
import { Product, UpdateProductDto } from "@/types/api";
import { ApiError } from "@/lib/api";

export default function ProductDetailPage({
  params,
}: {
  params: Promise<{ sku: string }>;
}) {
  const { sku } = use(params);
  const router = useRouter();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ name: "", description: "", price: "" });

  useEffect(() => {
    productsService
      .getBySku(sku)
      .then((p) => {
        setProduct(p);
        setForm({
          name: p.name,
          description: p.description || "",
          price: String(Number(p.price)),
        });
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [sku]);

  const handleDelete = async () => {
    if (!confirm("Eliminar este producto?")) return;
    await productsService.delete(sku);
    router.push("/products");
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      const data: UpdateProductDto = {
        name: form.name,
        description: form.description || undefined,
        price: Number(form.price),
      };
      const updated = await productsService.update(sku, data);
      setProduct(updated);
      setEditing(false);
    } catch (err) {
      if (err instanceof ApiError) setError(err.message);
    }
  };

  if (loading) return <p className="text-center py-8">Cargando...</p>;
  if (error)
    return <p className="text-center py-8 text-red-600">Error: {error}</p>;
  if (!product)
    return <p className="text-center py-8">Producto no encontrado</p>;

  if (editing) {
    return (
      <form
        onSubmit={handleUpdate}
        className="bg-white rounded-lg shadow-md p-6 max-w-lg space-y-4"
      >
        <h2 className="text-xl font-semibold">Editar: {product.sku}</h2>

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
            Descripcion
          </label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md p-2"
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
          />
        </div>

        <div className="flex gap-3 pt-2">
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Guardar
          </button>
          <button
            type="button"
            onClick={() => setEditing(false)}
            className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
          >
            Cancelar
          </button>
        </div>
      </form>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6 max-w-lg">
      <span className="text-xs text-gray-400 font-mono">{product.sku}</span>
      <h2 className="text-xl font-semibold mt-1">{product.name}</h2>

      {product.description && (
        <p className="text-gray-600 mt-2">{product.description}</p>
      )}

      <p className="text-2xl font-bold text-green-600 mt-4">
        ${Number(product.price).toFixed(2)}
      </p>

      <div className="flex gap-3 mt-6">
        <button
          onClick={() => setEditing(true)}
          className="px-4 py-2 bg-yellow-500 text-white rounded-md hover:bg-yellow-600"
        >
          Editar
        </button>
        <button
          onClick={handleDelete}
          className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
        >
          Eliminar
        </button>
        <Link
          href="/products"
          className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
        >
          Volver
        </Link>
      </div>
    </div>
  );
}
