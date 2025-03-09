import { authServices } from "../utils/appwrite";

const Authenticate = () => {
  return (
    <div className=" m-auto ">
      <button
        className="text-black bg-white p-4 rounded-lg flex gap-4 items-center "
        onClick={() => {
          authServices.loginUser();
        }}
      >
        <h3 className="text-xl">Login with Github</h3>
        <i className="fa-brands fa-github text-3xl"></i>
      </button>
    </div>
  );
};

export default Authenticate;
