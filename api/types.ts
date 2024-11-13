export interface Product {
  id: ProductId;
  name: string;
  size?: string;
  quantity?: number;
  expirationDate: Date;
  image?: string;
}

export type ProductId = Pick<Product, "id">;