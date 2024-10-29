export interface Product {
  id: number;
  name: string;
}

export type ProductId = Pick<Product, "id">;