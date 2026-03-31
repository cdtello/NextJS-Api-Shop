// ==================== USERS ====================

export interface User {
  id: number;
  name: string;
  email: string;
  age: number;
}

export interface CreateUserDto {
  id: number;
  name: string;
  email: string;
  age: number;
}

export interface UpdateUserDto {
  name?: string;
  email?: string;
  age?: number;
}

// ==================== PRODUCTS ====================

export interface Product {
  sku: string;
  name: string;
  description: string | null;
  price: number;
}

export interface CreateProductDto {
  sku: string;
  name: string;
  description?: string;
  price: number;
}

export interface UpdateProductDto {
  name?: string;
  description?: string;
  price?: number;
}

// ==================== ORDERS ====================

export interface Order {
  id: number;
  total: number;
  date: string;
  products: Product[];
}

export interface CreateOrderDto {
  userId: number;
  productSkus: string[];
}
