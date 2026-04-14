import Link from "next/link";
import { Order } from "@/types/api";

interface OrderCardProps {
  order: Order;
  onDelete?: (id: number) => void;
}

export function OrderCard({ order, onDelete }: OrderCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
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
        <Link href={`/orders/${order.id}`} className="text-blue-600 hover:underline">
          Ver detalle
        </Link>
        {onDelete && (
          <button
            onClick={() => onDelete(order.id)}
            className="text-red-600 hover:underline"
          >
            Eliminar
          </button>
        )}
      </div>
    </div>
  );
}
