"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ordersService } from "@/modules/orders";
import { Order } from "@/types/api";

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    ordersService
      .getAll()
      .then(setOrders)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const handleDelete = async (id: number) => {
    if (!confirm("Eliminar esta orden?")) return;
    try {
      await ordersService.delete(id);
      setOrders((prev) => prev.filter((o) => o.id !== id));
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
        <p className="text-gray-600">{orders.length} ordenes registradas</p>
        <Link
          href="/orders/create"
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Nueva Orden
        </Link>
      </div>

      {orders.length === 0 ? (
        <p className="text-gray-500 text-center py-8">No hay ordenes aun.</p>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div
              key={order.id}
              className="bg-white rounded-lg shadow-md p-6"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-semibold">Orden #{order.id}</h3>
                  <p className="text-sm text-gray-500 mt-1">
                    {new Date(order.date).toLocaleDateString("es-CO", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                </div>
                <p className="text-xl font-bold text-green-600">
                  ${Number(order.total).toFixed(2)}
                </p>
              </div>

              <div className="mt-3">
                <p className="text-sm text-gray-500 mb-1">
                  Productos ({order.products.length}):
                </p>
                <div className="flex flex-wrap gap-2">
                  {order.products.map((p) => (
                    <span
                      key={p.sku}
                      className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded"
                    >
                      {p.name}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex gap-3 mt-4 text-sm">
                <Link
                  href={`/orders/${order.id}`}
                  className="text-blue-600 hover:underline"
                >
                  Ver detalle
                </Link>
                <button
                  onClick={() => handleDelete(order.id)}
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
