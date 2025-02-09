import { Link } from "react-router";
import { images } from "../../constants/assets";
import { useAuth } from "../../context/globalContext";

const Hero = () => {
  const { isLogged } = useAuth();
  return (
    <div className="flex justify-center  gap-4 p-4 my-auto w-[80%]">
      <div className="flex-1 flex  justify-center items-start flex-col gap-4">
        <h1 className="text-6xl font-semibold ">
          Find Recipe of <br />
          Your
          <br /> Favorite Food
        </h1>
        <h1 className="text-5xl font-semibold ">
          {"@"}
          <span className="text-orange-500"> YumYard</span>
        </h1>

        <p className="text-base font-semibold text-gray-600 italic">
          Here you can find over 10000 recopies and can easily save them for
          easy access{" "}
        </p>

        <Link to={isLogged ? "/recipes" : "/auth"}>
          <button className="bg-orange-500 text-white font-semibold px-4 py-2 rounded-md">
            Get Started
          </button>
        </Link>
      </div>
      <div className="flex-1">
        <img
          src={images.hero}
          alt=""
          className="rounded-lg shadow-black/90 shadow-lg"
        />
      </div>
    </div>
  );
};

export default Hero;
