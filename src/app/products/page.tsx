"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { productsService } from "@/modules/products";
import { Product } from "@/types/api";

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    productsService
      .getAll()
      .then(setProducts)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const handleDelete = async (sku: string) => {
    if (!confirm("Eliminar este producto?")) return;
    try {
      await productsService.delete(sku);
      setProducts((prev) => prev.filter((p) => p.sku !== sku));
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
        <p className="text-gray-600">{products.length} productos registrados</p>
        <Link
          href="/products/create"
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Nuevo Producto
        </Link>
      </div>

      {products.length === 0 ? (
        <p className="text-gray-500 text-center py-8">
          No hay productos aun.
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {products.map((product) => (
            <div
              key={product.sku}
              className="bg-white rounded-lg shadow-md p-6"
            >
              <span className="text-xs text-gray-400 font-mono">
                {product.sku}
              </span>
              <h3 className="text-lg font-semibold mt-1">{product.name}</h3>
              {product.description && (
                <p className="text-gray-600 text-sm mt-1">
                  {product.description}
                </p>
              )}
              <p className="text-xl font-bold text-green-600 mt-2">
                ${Number(product.price).toFixed(2)}
              </p>
              <div className="flex gap-3 mt-4 text-sm">
                <Link
                  href={`/products/${product.sku}`}
                  className="text-blue-600 hover:underline"
                >
                  Ver
                </Link>
                <button
                  onClick={() => handleDelete(product.sku)}
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
