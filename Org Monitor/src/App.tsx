import { Outlet } from "react-router";
import Navbar from "./components/Navbar";

function App() {
  return (
    <div className="w-screen px-[10%] min-h-screen flex flex-col ">
      <Navbar />
      <Outlet />
    </div>
  );
}

export default App;
