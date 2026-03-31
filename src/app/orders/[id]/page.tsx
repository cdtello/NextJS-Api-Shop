"use client";

import { useState, useEffect, use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ordersService } from "@/modules/orders";
import { Order } from "@/types/api";

export default function OrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    ordersService
      .getById(Number(id))
      .then(setOrder)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [id]);

  const handleDelete = async () => {
    if (!confirm("Eliminar esta orden?")) return;
    await ordersService.delete(Number(id));
    router.push("/orders");
  };

  if (loading) return <p className="text-center py-8">Cargando...</p>;
  if (error)
    return <p className="text-center py-8 text-red-600">Error: {error}</p>;
  if (!order) return <p className="text-center py-8">Orden no encontrada</p>;

  return (
    <div className="bg-white rounded-lg shadow-md p-6 max-w-lg">
      <div className="flex justify-between items-start mb-4">
        <h2 className="text-xl font-semibold">Orden #{order.id}</h2>
        <p className="text-2xl font-bold text-green-600">
          ${Number(order.total).toFixed(2)}
        </p>
      </div>

      <p className="text-sm text-gray-500 mb-4">
        Fecha:{" "}
        {new Date(order.date).toLocaleDateString("es-CO", {
          year: "numeric",
          month: "long",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        })}
      </p>

      <div className="border-t pt-4">
        <h3 className="text-sm font-medium text-gray-700 mb-3">
          Productos ({order.products.length})
        </h3>
        <div className="space-y-2">
          {order.products.map((p) => (
            <div
              key={p.sku}
              className="flex justify-between items-center bg-gray-50 rounded p-3"
            >
              <div>
                <p className="font-medium">{p.name}</p>
                <p className="text-xs text-gray-400 font-mono">{p.sku}</p>
              </div>
              <p className="font-medium text-green-600">
                ${Number(p.price).toFixed(2)}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div className="flex gap-3 mt-6">
        <button
          onClick={handleDelete}
          className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
        >
          Eliminar
        </button>
        <Link
          href="/orders"
          className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
        >
          Volver
        </Link>
      </div>
    </div>
  );
}
