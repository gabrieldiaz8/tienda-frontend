export interface ProductCategory {
  id: number;
  nombre: string;
  activo: boolean;
}

export interface ProductInterface {
  id: number;
  name: string;
  description: string;
  price: number;
  category?: string;
  categoriaId?: number;
  categoria?: ProductCategory;
  material: string;
  imageUrl?: string | null;
  createdByUserId: number;
  stock: number;
}
