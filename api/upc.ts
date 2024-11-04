import { useQuery } from "@tanstack/react-query";

// import { Product, ProductId } from './types';

// update domains

export const findProductByUPC = (item: any) => {
  const {status, data, isFetching, isFetched} = useQuery({
    queryKey: ["upc"],
    queryFn: async () => {
      try {
        const response = await fetch(`http://localhost:3000/api/proxy/upc/4002293401102`, {
          method: "GET", // post/get are both allowed
          headers: {
            "Content-Type": "application/json",
          },
        });
        console.log({response})
        return await response.json();
      } catch (error) {
        console.error("Error fetching message:", error);
      }
    },
  })
  return { isFetched, isFetching, status, data };
}
