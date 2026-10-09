// --- JAVNI MENI ZA GOSTE (Public view) ---
export interface PublicItemVariantDto {
  id: string;
  name: string;
  price: number;
  isAvailable: boolean;
}

export interface PublicMenuItemDto {
  id: string;
  name: string;
  description?: string | null;
  basePrice: number;
  imageUrl?: string | null;
  isAvailable: boolean;
  displayOrder: number;
  variants: PublicItemVariantDto[];
  allergens: string[];
}

export interface PublicCategoryDto {
  id: string;
  name: string;
  displayOrder: number;
  items: PublicMenuItemDto[];
}

export interface PublicMenuResponseDto {
  id: string;
  name: string;
  slug: string;
  isActive: boolean;
  categories: PublicCategoryDto[];
}