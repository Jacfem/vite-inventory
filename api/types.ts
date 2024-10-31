export interface Product {
  id: number;
  name: string;
  size?: string;
  quantity?: number;
  expirationDate: Date;
}

export type ProductId = Pick<Product, "id">;