import { icons } from "../constants/assets";
import { authServices } from "../lib/appwrite";

const AuthenticationPage = () => {
  return (
    <div className="m-auto p-5 bg-white shadow-lg shadow-black/30 rounded-md flex flex-col items-center justify-center gap-4">
      <img src={icons.logo} alt="" className="size-20 rounded-lg " />
      <h2 className="text-xl font-semibold">Thankyou for trusting !</h2>
      <div className="">
        <button
          className="px-4 py-2 border rounded-md flex items-center gap-2 font-semibold"
          onClick={() => {
            authServices.createAccountWithOAuth();
          }}
        >
          Login with Github
        </button>
      </div>
    </div>
  );
};

export default AuthenticationPage;
