import { useQuery } from "@tanstack/react-query";

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
  return {status, data};
}

export const postProduct = async (inputValue: string) => {
  try {
    const response = await fetch("http://localhost:3000/api/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: inputValue }),
    });

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error posting product:", error);
  }
};

export const putProduct = async (id: number, inputValue: string) => {
  try {
    const response = await fetch(`http://localhost:3000/api/products/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: inputValue }),
    });

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error updating product:", error);
  }
};

export const deleteProduct = async (id: number) => {
  try {
    await fetch(`http://localhost:3000/api/products/${id}`, {
      method: "DELETE",

    });

    return id;
  } catch (error) {
    console.error("Error deleting product:", error);
  }
};
