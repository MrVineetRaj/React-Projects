import { useEffect, useState } from "react";
import { getRecipes } from "../lib/recipehandler";
import RecipeCard, { IRecipe } from "../components/recipe/RecipeCard";

const indianIngredients = [
  "Paneer",
  "Chicken",
  "Mutton", // Key for biryani
  "Gobi",
  "Aloo",
  "Tomato",
  "Onion",
  "Garlic",
  "Ginger",
  "Green Chilies",
  "Biryani", // Essential for biryani
  "Pizza", // Common in biryani marinades
  "Pasta", // Common in biryani marinades
];

const RecipesPage = () => {
  let food = new URL(window.location.href).searchParams.get("food");
  const page = new URL(window.location.href).searchParams.get("page");
  const [recipes, setRecipes] = useState<IRecipe[] | null>(null);

  console.log(food);

  useEffect(() => {
    let pageInt = parseInt(page!) || 1;

    if (!food) {
      food =
        indianIngredients[Math.floor(Math.random() * indianIngredients.length)];
    }

    getRecipes(food!, pageInt).then((data) => {
      const tempRecipes: IRecipe[] = data.map(
        (recipe: {
          title: string;
          ingredients: string;
          instructions: string;
          servings: number;
        }) => {
          return {
            title: recipe.title,
            ingredients: recipe.ingredients.split(";"),
            instructions: recipe.instructions
              ?.concat("Thankyou ! Enjoy your meal")
              .split(".")
              .join(".;")
              .split(";"),
            servings: recipe.servings,
          };
        }
      );
      setRecipes(tempRecipes);
    });
  }, [food]);

  return (
    <div className="max-w-[80%] w-full mx-auto mt-4 ">
      {food && (
        <h1 className="text-2xl font-semibold border-b-2 py-2 text-gray-400">
          Showing Results for :{" "}
          <span className="text-orange-500 italic">{food}</span>
        </h1>
      )}
      <div className="flex flex-wrap gap-4 my-8 justify-around  ">
        {recipes &&
          recipes?.map((recipe, index) => {
            return <RecipeCard key={index} recipe={recipe} isSaved={false} />;
          })}
      </div>

      <div className=" flex justify-center items-center gap-4">
        {food && (
          <form action={`/recipes`}>
            {food && (
              <>
                <input
                  type="text"
                  value={food!}
                  name="food"
                  className="hidden"
                />
                <input
                  type="text"
                  value={parseInt(page!) - 1}
                  name="page"
                  className="hidden"
                />
              </>
            )}
            <button
              className="px-8 py-2 rounded-md border-2 border-orange-500 font-bold text-orange-500 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={(parseInt(page!) || 1) === 1}
            >
              Prev
            </button>
          </form>
        )}

        <form action={`/recipes`}>
          {food && (
            <>
              <input type="text" value={food!} name="food" className="hidden" />
              <input
                type="text"
                value={(parseInt(page!) || 1) + 1}
                name="page"
                className="hidden"
              />
            </>
          )}
          <button className="px-8 py-2 rounded-md border-2 border-orange-500 bg-orange-500  font-bold text-white text-lg">
            {!food ? "Refresh" : "Next"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default RecipesPage;
