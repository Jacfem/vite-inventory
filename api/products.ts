import { useQuery } from "@tanstack/react-query";
import { notifications } from '@mantine/notifications';

import { Product, ProductId } from './types';

// update domains

export const getProducts = () => {
  const {status, data} = useQuery({
    queryKey: ["products"],
    queryFn: async () => {
      try {
        const response = await fetch("http://localhost:3000/api/products");
        return await response.json();
      } catch (error) {
        console.error("Error fetching message:", error);
      }
    },
  })
  return { status, data };
}

export const postProduct = async (item: Product) => {
  try {
    const response = await fetch("http://localhost:3000/api/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(item),
    });

    const data = await response.json();
    notifications.show({
      title: 'Success!',
      message: 'Product added to your inventory.',
    })
    return data;
  } catch (error) {
    console.error("Error posting product:", error);
    notifications.show({
      title: 'Oops!',
      message: 'Something went wrong, please try again.',
    })
  }
};

export const putProduct = async (item: Product) => {
  try {
    const response = await fetch(`http://localhost:3000/api/products/${item.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(item),
    });

    const data = await response.json();
    notifications.show({
      title: 'Success!',
      message: 'Product updated.',
    })
    return data;
  } catch (error) {
    console.error("Error updating product:", error);
    notifications.show({
      title: 'Oops!',
      message: 'Something went wrong, please try again.',
    })
  }
};

export const deleteProduct = async (id: ProductId) => {
  try {
    await fetch(`http://localhost:3000/api/products/${id}`, {
      method: "DELETE",

    });
    notifications.show({
      title: 'Success!',
      message: 'Product removed.',
    })
    return id;
  } catch (error) {
    console.error("Error deleting product:", error);
    notifications.show({
      title: 'Oops!',
      message: 'Something went wrong, please try again.',
    })
  }
};
