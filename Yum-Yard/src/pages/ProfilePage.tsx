import { useEffect, useState } from "react";
import { useAuth, useMethods, useUser } from "../context/globalContext";
import { databaseServices } from "../lib/appwrite";
import RecipeCard, { IRecipe } from "../components/recipe/RecipeCard";
// import { authServices } from "../lib/appwrite";

const ProfilePage = () => {
  const { isLogged } = useAuth();
  const { user } = useUser();
  const {
    methods: { logoutUser },
  } = useMethods();
  const [recipes, setRecipes] = useState<IRecipe[] | null>(null);

  // console.log("fetching user", user.isFetchingUser);
  useEffect(() => {
    if (isLogged && user.$id) {
      console.log(user.$id);
      databaseServices.getSavedRecipes(user?.$id).then((res) => {
        const tempRecipes: IRecipe[] = res.map((recipe: any) => {
          return {
            title: recipe.title,
            ingredients: recipe.ingredients.split(";"),
            instructions: recipe.instructions?.split(";"),
            servings: recipe.servings,
          };
        });

        setRecipes(tempRecipes);
      });
    }
  }, [isLogged, user?.$id]);

  if (user.isFetchingUser) {

    console.log("fetching user", user);
    return <div>Loading...</div>;
  }

  if (!isLogged) {
    window.location.href = "/";
  }

  return (
    <div className="flex flex-col items-start  h-screen space-y-4 w-full my-8">
      <div className="flex flex-col items-start space-y-4 w-full relative border-b-4 border-orange-200 pb-4">
        <h1 className="text-4xl font-semibold">Profile</h1>
        <div className="flex flex-col items-start space-y-2">
          <p className="text-lg font-semibold">{user.name}</p>
          <p className="text-sm ">{user.email}</p>
        </div>
        <button
          className="px-4 py-2 rounded-md text-red-500 font-semibold border-2 border-red-500 absolute right-8 top-0"
          onClick={() => {
            logoutUser!();
          }}
        >
          Logout
        </button>
      </div>

      <div className=" w-full mx-auto mt-4">
        <h1 className="text-4xl font-semibold">Saved Recipes</h1>

        <div className="flex flex-wrap gap-4 my-8 justify-around  ">
          {recipes &&
            recipes?.map((recipe, index) => {
              return <RecipeCard key={index} recipe={recipe} isSaved={true} />;
            })}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
