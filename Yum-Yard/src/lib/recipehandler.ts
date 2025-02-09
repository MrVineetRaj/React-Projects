import axios from "axios";

export const getRecipes = async (food: string, page: number) => {
  const response = await axios.get(
    `https://api.api-ninjas.com/v1/recipe?query=${food}${
      page > 1 ? `&offset=${page-1}` : ""
    }`,
    {
      headers: {
        "X-Api-Key": import.meta.env.VITE_PUBLIC_RECIPE_API_KEY,
      },
    }
  );
  return response.data;
};
