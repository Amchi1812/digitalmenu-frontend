export type UserRole = 'SuperAdmin' | 'RestoranAdmin';

// --- AUTH (Prijava) ---
export interface LoginRequestDto {
  email: string;
  password: string;
}

export interface LoginResponseDto {
  token: string;
  email: string;
  role: UserRole;
  restaurantId?: string | null;
}

export interface User {
  email: string;
  role: UserRole;
  restaurantId?: string | null;
}

// restoran dto

export interface RestaurantDto{
  name: string;
}

// --- SUPERADMIN (Upravljanje restoranima i adminima) ---
export interface CreateRestaurantDto {
  name: string;
  slug: string;
}

export interface RestaurantResponseDto {
  id: string;
  name: string;
  slug: string;
  isActive: boolean;
}

export interface CreateRestaurantAdminDto {
  email: string;
  password: string;
  restaurantId?: string | null;
}

// --- KATEGORIJE (Admin panel) ---
export interface CategoryDto {
  id: string;
  name: string;
  displayOrder: number;
}

export interface CreateCategoryDto {
  name: string;
  displayOrder: number;
}

export interface UpdateCategoryDto {
  name: string;
  displayOrder: number;
}

// --- ARTIKLI / MENU ITEMS (Admin panel) ---
export interface MenuItemDto {
  id: string;
  name: string;
  description?: string | null;
  basePrice: number;
  imageUrl?: string | null;
  isAvailable: boolean;
  categoryId: string;
}

export interface CreateMenuItemDto {
  name: string;
  description?: string | null;
  basePrice: number;
  imageUrl?: string | null;
  categoryId: string;
}

export interface UpdateMenuItemDto {
  name: string;
  description?: string | null;
  basePrice: number;
  imageUrl?: string | null;
  isAvailable: boolean;
  categoryId: string;
}


// Drag and drop
export interface ReorderCategoryDto {
  id: string;
  displayOrder: number;
}