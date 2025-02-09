import { Link } from "react-router";
import { icons } from "../constants/assets";
import { useAuth, useUser } from "../context/globalContext";

const Navbar = () => {
  const food = new URL(window.location.href).searchParams.get("food");
  const { isLogged } = useAuth();
  const {
    user: { isFetchingUser, name },
  } = useUser();

  return (
    <div className="flex gap-4 items-center justify-between px-4 py-2 w-[80vw] bg-transparent border-b-2">
      <Link
        to={"/"}
        className="flex gap-2 items-center justify-between cursor-pointer"
      >
        <img src={icons.logo} alt="" className="rounded-lg w-10" />
        <h2 className="text-xl font-semibold">Yum Yard</h2>
      </Link>
      <div className="flex gap-4 items-center">
        <form className="flex items-center gap-2 " action="/recipes">
          <input
            name="food"
            type="text"
            className="outline-none border-orange-300 border rounded-md bg-transparent p-2"
            placeholder="Food name"
            defaultValue={food ? food : ""}
          />
          <button className="p-2 rounded-md border">Search</button>
        </form>
        <Link to={"/recipes"} className="text-lg ">
          Recipes
        </Link>
        {isLogged && !isFetchingUser && name ? (
          <Link to={"/profile"}>
            <button className="bg-orange-500 text-white font-semibold px-4 py-2 rounded-md">
              {name}
            </button>
          </Link>
        ) : (
          <Link to={"/auth"}>
            <button className="bg-orange-500 text-white font-semibold px-4 py-2 rounded-md">
              Get Started
            </button>
          </Link>
        )}
      </div>
    </div>
  );
};

export default Navbar;
