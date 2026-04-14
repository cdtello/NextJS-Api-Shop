import Link from "next/link";
import { User } from "@/types/api";

interface UserCardProps {
  user: User;
  onDelete?: (id: number) => void;
}

export function UserCard({ user, onDelete }: UserCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
      <h3 className="text-lg font-semibold">{user.name}</h3>
      <p className="text-gray-600 text-sm">{user.email}</p>
      <p className="text-gray-400 text-sm mt-1">Edad: {user.age}</p>
      <div className="flex gap-3 mt-4 text-sm">
        <Link href={`/users/${user.id}`} className="text-blue-600 hover:underline">
          Ver
        </Link>
        <Link href={`/users/${user.id}/edit`} className="text-yellow-600 hover:underline">
          Editar
        </Link>
        {onDelete && (
          <button
            onClick={() => onDelete(user.id)}
            className="text-red-600 hover:underline"
          >
            Eliminar
          </button>
        )}
      </div>
    </div>
  );
}
