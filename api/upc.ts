import { useQuery } from "@tanstack/react-query";

export const findProductByUPC = (code?: string) => {
  const {status, data, isFetching, isFetched, refetch} = useQuery({
    // enabled: enabled || false,
    queryKey: ["upc"],
    queryFn: async () => {
      try {
        const response = await fetch(`http://localhost:3000/api/proxy/upc/${code}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });
        const result = await response.json();
        return JSON.parse(result);
      } catch (error) {
        console.error("Error fetching message:", error);
      }
    },
  })
  return { isFetched, isFetching, status, data, refetch };
}
