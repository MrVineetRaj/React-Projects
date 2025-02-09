import { useAuth } from "../context/globalContext";

const Authpage = () => {
  const { user } = useAuth();
  return (
    <div className=" flex flex-col justify-center items-center m-auto  shadow-lg shadow-white rounded-md p-4 gap-2 border min-w-[300px]">
      <h1>Org Monitor</h1>
      <hr className="w-full" />
      <h3>Welcome Abroad</h3>

      <div className="flex flex-col gap-2 mt-2 w-full">
        <button
          className="bg-white text-gray-600 px-4 py-2 rounded-md shadow-lg"
          onClick={() => {
            user!.methods.loginUser("github");
          }}
        >
          {user!.loading ? "Loading..." : "Continue with Github"}
        </button>
      </div>
    </div>
  );
};

export default Authpage;
