import { useEffect, useState } from "react";
import Authenticate from "./components/Authenticate";
import Navbar from "./components/Navbar";
import { authServices } from "./utils/appwrite";
import Home from "./components/Home";
import { IUser } from "./utils/types";

const App = () => {
  const [user, setUser] = useState<IUser | null>(null);
  // const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [view, setView] = useState<string>("login");
  useEffect(() => {
    authServices.getProfile().then((res) => {
      if (!!res.$id === false) {
        setView("login");
      } else {
        setUser({
          $id: res.$id,
          name: res.name,
          email: res.email,
        });
        setView("home");
      }
    });
  }, []);
  return (
    <div className="min-h-screen flex flex-col w-[80vw] lg:w-[60vw] min-w-[350px] relative">
      <Navbar />
      {view === "login" && <Authenticate />}
      {view === "home" && <Home user={user!} />}
    </div>
  );
};

export default App;
