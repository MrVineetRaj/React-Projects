import { useState } from "react";
import { useAuth, useUser } from "../../context/globalContext";
import { databaseServices } from "../../lib/appwrite";

export interface IRecipe {
  title: string;
  ingredients: string[];
  instructions: string[];
  servings: string;
  userId?: string;
}

const RecipeCard = ({
  recipe: { title, ingredients, instructions, servings },
  isSaved,
}: {
  recipe: IRecipe;
  isSaved: boolean;
}) => {
  const { user } = useUser();
  const { isLogged } = useAuth();
  const [showFullRecipe, setShowFullRecipe] = useState(false);

  const handleSave = () => {
    if (isSaved) {
      return;
    }
    if (!isLogged) {
      alert("Login to save");
      return;
    }
    databaseServices.saveRecipe({
      title,
      ingredients: ingredients.join(";"),
      instructions: instructions.join(";"),
      servings: servings,
      userId: user.$id,
    });
  };
  return (
    <div className="border-2 text-wrap hover:border-orange-500 p-4 rounded-lg w-[45%] bg-gradient-to-tl from-white to-orange-50 ">
      <h1
        className="text-xl font-bold p-4  cursor-pointer active:scale-95 transition-all duration-100"
        onClick={() => {
          setShowFullRecipe(!showFullRecipe);
        }}
      >
        {title}
      </h1>

      {showFullRecipe && (
        <div className="fixed inset-0 flex items-center justify-center  bg-black bg-opacity-50">
          <div className="flex flex-col gap-4 p-4 bg-white w-[60%] rounded-lg border-2 border-orange-500 max-h-[500px] max-w-[800px] overflow-y-scroll">
            <div className="flex justify-between items-center">
              <h1 className="text-2xl font-bold text-orange-500">{title}</h1>
              <div className="flex gap-4 items-center ">
                <button
                  className="text-lg font-semibold bg-orange-500 text-white px-4 py-2 rounded-md shadow-none disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={isSaved}
                  onClick={() => {
                    handleSave();
                  }}
                >
                  {!isLogged
                    ? "Login to save"
                    : isSaved
                    ? "Already Saved"
                    : "Save"}
                </button>
                <button
                  className="text-xl font-bold text-red-500 bg-transparent shadow-none"
                  onClick={() => setShowFullRecipe(false)}
                >
                  X
                </button>
              </div>
            </div>
            <div>
              <h2 className="text-lg font-semibold">Ingredients</h2>
              <ul className="list-disc pl-4">
                {ingredients.map((ingredient, index) => (
                  <li key={index}>{ingredient}</li>
                ))}
              </ul>
            </div>
            <div>
              <h2 className="text-lg font-semibold">Instructions</h2>
              <ul className="list-decimal pl-4">
                {instructions.map((instruction, index) => (
                  <li key={index}>{instruction}</li>
                ))}
              </ul>
            </div>
            <div>
              <h2 className="text-lg font-semibold">Servings</h2>
              <p>{servings}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RecipeCard;
