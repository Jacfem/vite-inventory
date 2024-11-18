export interface Product {
  id: ProductId;
  name: string;
  size?: string;
  quantity?: number;
  expirationDate?: Date | string; //add datepicker
  image?: string;
  upc?: string;
  tags?: string[];
}

export type ProductId = Pick<Product, "id">;