export interface ProductCategory {
  id: number;
  nombre: string;
  activo: boolean;
}

export interface ProductMaterialRel {
  id: number;
  nombre: string;
  activo: boolean;
  orden: number;
}

export interface ProductInterface {
  id: number;
  name: string;
  description: string;
  price: number;
  category?: string;
  categoriaId?: number;
  categoria?: ProductCategory;
  material?: string;
  materialId?: number;
  materialRel?: ProductMaterialRel;
  imageUrl?: string | null;
  createdByUserId: number;
  stock: number;
}
