"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ordersService } from "@/modules/orders";
import { Order } from "@/types/api";
import { OrderCard } from "@/components/orders/OrderCard";

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
            <OrderCard key={order.id} order={order} onDelete={handleDelete} />
          ))}
        </div>
      )}
    </div>
  );
}
