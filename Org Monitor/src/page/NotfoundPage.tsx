import { useEffect } from "react";
import { Link } from "react-router";

const NotfoundPage = () => {
  
  useEffect(() => {
    setTimeout(() => {
      window.location.href = "/";
    }, 30*1000);
  }, []);
  return (
    <div className="m-auto flex-col justify-center items-center text-center gap-20">
      <div className="flex justify-center items-center gap-8">
        <div className="text-red-500">
          <h1 className="text-6xl">4</h1>
          <h1 className="text-6xl">0</h1>
          <h1 className="text-6xl">4</h1>
        </div>
        <img src="/not-found.png" alt="" className="w-48" />
      </div>

      <Link to="/" className="text-blue-500 underline">
        <h1 className="text-6xl text-blue-500 italic mt-8">Go to Home</h1>
      </Link>
      <p>Redirecting in few seconds</p>
    </div>
  );
};

export default NotfoundPage;
