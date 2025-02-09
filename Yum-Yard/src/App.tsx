import { Outlet } from "react-router";
import Navbar from "./components/Navbar";
function App() {
  return (
    <div className="flex flex-col items-center  min-h-screen ">
      <Navbar />
      <Outlet />
    </div>
  );
}

export default App;
