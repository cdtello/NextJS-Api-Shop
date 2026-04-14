import Link from "next/link";
import { Product } from "@/types/api";

interface ProductCardProps {
  product: Product;
  onDelete?: (sku: string) => void;
}

export const ProductCard = ({ product, onDelete }: ProductCardProps) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
      <span className="font-mono text-xs text-gray-400">{product.sku}</span>
      <h3 className="text-lg font-semibold mt-1">{product.name}</h3>
      {product.description && (
        <p className="text-gray-600 text-sm mt-1">{product.description}</p>
      )}
      <p className="text-xl font-bold text-green-600 mt-2">
        ${Number(product.price).toFixed(2)}
      </p>
      <div className="flex gap-3 mt-4 text-sm">
        <Link href={`/products/${product.sku}`} className="text-blue-600 hover:underline">
          Ver
        </Link>
        {onDelete && (
          <button
            onClick={() => onDelete(product.sku)}
            className="text-red-600 hover:underline"
          >
            Eliminar
          </button>
        )}
      </div>
    </div>
  );
}
