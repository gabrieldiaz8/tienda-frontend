export interface ProductInterface {
  id: number;
  name: string;
  description: string;
  price: number;
  category: string;
  material: string;
  imageUrl?: string | null;
  createdByUserId: number;
}
