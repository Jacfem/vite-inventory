import { useQuery } from "@tanstack/react-query";

export const findProductByUPC = (code?: string, enabled?: boolean) => {
  const { data, isFetching, refetch } = useQuery({
    // ensure we dont fetch until we trigger it with 'enabled' logic
    enabled: enabled || false,
    queryKey: ["upc"],
    queryFn: async () => {
      try {
        const response = await fetch(
          `http://localhost:3000/api/proxy/upc/${code}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        const result = await response.json();
        return JSON.parse(result);
      } catch (error) {
        console.error("Error fetching message:", error);
      }
    },
  });
  return { isFetching, data, refetch };
};
