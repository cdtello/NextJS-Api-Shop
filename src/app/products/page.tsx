"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { productsService } from "@/modules/products";
import { Product } from "@/types/api";
import { ProductCard } from "@/components/products/ProductCard";

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
            <ProductCard
              key={product.sku}
              product={product}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
}
