import { useEffect } from "react";
import { Link } from "react-router";

const Unauthorized = () => {
  useEffect(() => {
    setTimeout(() => {
      window.location.href = "/";
    }, 10 * 1000);
  }, []);
  return (
    <div className="m-auto flex-col justify-center items-center text-center gap-20">
      <img src="/unauthorized.jpg" alt="" className="rounded-lg" />

      <Link to="/" className="text-blue-500 underline">
        <h1 className="text-6xl text-blue-500 italic mt-8">Go to Home</h1>
      </Link>
      <p>Redirecting in few seconds</p>
    </div>
  );
};

export default Unauthorized;
