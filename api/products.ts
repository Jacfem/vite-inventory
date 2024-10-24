import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

// update domains
export const postProduct = async (inputValue: string) => {
  try {
    const response = await fetch("http://localhost:3000/api/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: inputValue }),
    });

    const data = await response.json();
    console.log({ data });
  } catch (error) {
    console.error("Error posting product:", error);
  }
};

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