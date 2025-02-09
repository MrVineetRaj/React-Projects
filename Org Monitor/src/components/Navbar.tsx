import { Link } from "react-router";
import { useAuth } from "../context/globalContext";

const Navbar = () => {
  const { user } = useAuth();
  return (
    <div className="py-2 border-b bg-transparent flex items-center justify-between">
      <Link to={"/"}>
        <h2>Org Monitor</h2>
      </Link>

      <div className="">
        {!user?.loading && user?.isLogged ? (
          <>
            <Link to={"/repos"} className="btn">
              Repos
            </Link>
            <Link to={"/profile"} className="btn">
              <button className="bg-white text-black w-32">Profile</button>
            </Link>
          </>
        ) : (
          <Link to={"/auth"} className="btn">
            <button className="bg-white text-black w-32">Login</button>
          </Link>
        )}
      </div>
    </div>
  );
};

export default Navbar;
