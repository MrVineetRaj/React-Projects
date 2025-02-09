import { Link } from "react-router";
import { useAuth } from "../context/globalContext";

const Homepage = () => {
  const { user } = useAuth();
  return (
    <div className="m-auto flex flex-col items-center justify-center gap-4">
      <h1 className="text-6xl text-center ">
        Stop Wasting time while <br />
        Tracking Repo{" "}
        <span className="text-orange-500 italic">Instead Work on it</span>{" "}
      </h1>

      <p className="text-center text-lg font-semibold pt-4 border-t">
        Are you struggling to keep track of multiple organizations and Repos for
        Events like GSoC ? <br />
        Worry not we are here to save you
      </p>

      <Link to={user?.isLogged ? "/repos" : "/auth"}>
        <button className="bg-white text-black">Get Started</button>
      </Link>
      <ul className="text-lg text-left flex flex-col gap-2 items-center">
        <h1 className="text-orange-500">Features </h1>
        <li>Load The Organization</li>
        <li>Filter Repos Check description and comments</li>
        <li>Mark it as a contributing and start working on it</li>
      </ul>
    </div>
  );
};

export default Homepage;
