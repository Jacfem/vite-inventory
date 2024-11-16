import { useQuery } from "@tanstack/react-query";
import { notifications } from "@mantine/notifications";

import { Product, ProductId } from "./types";

// update domains

const showErrorNotification = () => {
  notifications.show({
    title: "Oops!",
    message: "Something went wrong, please try again.",
    color: "red",
  });
};

export const getProducts = () => {
  const { status, data } = useQuery({
    queryKey: ["products"],
    queryFn: async () => {
      try {
        const response = await fetch("http://localhost:3000/api/products");
        return await response.json();
      } catch (error) {
        console.error("Error fetching message:", error);
      }
    },
  });
  return { status, data };
};

export const postProduct = async (item: Product) => {
  try {
    const response = await fetch("http://localhost:3000/api/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(item),
    });

    const data = await response.json();
    if (data.error) {
      console.error("Error posting product:", data.error);
      showErrorNotification();
    } else {
      notifications.show({
        title: "Success!",
        message: "Product added to your inventory.",
        color: "green",
      });
      return data;
    }
  } catch (error) {
    console.error("Error posting product:", error);
    showErrorNotification();
  }
};

export const putProduct = async (item: Product) => {
  try {
    const response = await fetch(
      `http://localhost:3000/api/products/${item.id}`,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(item),
      }
    );

    const data = await response.json();
    notifications.show({
      title: "Success!",
      message: "Product updated.",
      color: "green",
    });
    return data;
  } catch (error) {
    console.error("Error updating product:", error);
    showErrorNotification();
  }
};

export const deleteProduct = async (id: ProductId) => {
  try {
    await fetch(`http://localhost:3000/api/products/${id}`, {
      method: "DELETE",
    });
    notifications.show({
      title: "Success!",
      message: "Product removed.",
      color: "green",
    });
    return id;
  } catch (error) {
    console.error("Error deleting product:", error);
    showErrorNotification();
  }
};
