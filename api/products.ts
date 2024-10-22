// to do - use react query
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
