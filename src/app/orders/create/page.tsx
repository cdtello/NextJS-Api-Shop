"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ordersService } from "@/modules/orders";
import { usersService } from "@/modules/users";
import { productsService } from "@/modules/products";
import { User, Product } from "@/types/api";
import { ApiError } from "@/lib/api";

export default function CreateOrderPage() {
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedUser, setSelectedUser] = useState<number>(0);
  const [selectedSkus, setSelectedSkus] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    Promise.all([usersService.getAll(), productsService.getAll()])
      .then(([u, p]) => {
        setUsers(u);
        setProducts(p);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const toggleProduct = (sku: string) => {
    setSelectedSkus((prev) =>
      prev.includes(sku) ? prev.filter((s) => s !== sku) : [...prev, sku]
    );
  };

  const estimatedTotal = selectedSkus.reduce((sum, sku) => {
    const product = products.find((p) => p.sku === sku);
    return sum + (product ? Number(product.price) : 0);
  }, 0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      await ordersService.create({
        userId: selectedUser,
        productSkus: selectedSkus,
      });
      router.push("/orders");
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
      className="bg-white rounded-lg shadow-md p-6 max-w-lg space-y-6"
    >
      <h2 className="text-xl font-semibold">Crear Orden</h2>

      {error && (
        <div className="bg-red-50 border border-red-200 p-3 rounded text-red-800 text-sm">
          {error}
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Usuario
        </label>
        <select
          value={selectedUser}
          onChange={(e) => setSelectedUser(Number(e.target.value))}
          className="w-full border border-gray-300 rounded-md p-2"
        >
          <option value={0}>Seleccionar usuario...</option>
          {users.map((u) => (
            <option key={u.id} value={u.id}>
              {u.name} ({u.email})
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Productos
        </label>
        {products.length === 0 ? (
          <p className="text-gray-500 text-sm">
            No hay productos disponibles.{" "}
            <Link href="/products/create" className="text-blue-600 underline">
              Crear uno
            </Link>
          </p>
        ) : (
          <div className="space-y-2 max-h-60 overflow-y-auto">
            {products.map((p) => (
              <label
                key={p.sku}
                className="flex items-center gap-3 p-2 rounded hover:bg-gray-50 cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={selectedSkus.includes(p.sku)}
                  onChange={() => toggleProduct(p.sku)}
                  className="w-4 h-4"
                />
                <span className="flex-1">{p.name}</span>
                <span className="text-green-600 font-medium">
                  ${Number(p.price).toFixed(2)}
                </span>
              </label>
            ))}
          </div>
        )}
      </div>

      <div className="border-t pt-4">
        <p className="text-lg font-bold">
          Total estimado:{" "}
          <span className="text-green-600">
            ${estimatedTotal.toFixed(2)}
          </span>
        </p>
        <p className="text-xs text-gray-400 mt-1">
          El total final lo calcula el servidor
        </p>
      </div>

      <div className="flex gap-3">
        <button
          type="submit"
          disabled={!selectedUser || selectedSkus.length === 0}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          Crear Orden
        </button>
        <Link
          href="/orders"
          className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
        >
          Cancelar
        </Link>
      </div>
    </form>
  );
}
