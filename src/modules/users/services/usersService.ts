import { apiClient } from "@/lib/api";
import { User, CreateUserDto, UpdateUserDto } from "@/types/api";

export const usersService = {
  getAll: () => apiClient.get<User[]>("/api/users"),

  getById: (id: number) => apiClient.get<User>(`/api/users/${id}`),

  create: (data: CreateUserDto) => apiClient.post<User>("/api/users", data),

  update: (id: number, data: UpdateUserDto) =>
    apiClient.patch<User>(`/api/users/${id}`, data),

  delete: (id: number) => apiClient.delete<User>(`/api/users/${id}`),
};
