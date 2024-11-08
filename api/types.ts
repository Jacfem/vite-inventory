export interface Product {
  id: ProductId;
  name: string;
  size?: string;
  quantity?: number;
  expirationDate: Date;
}

export type ProductId = Pick<Product, "id">;