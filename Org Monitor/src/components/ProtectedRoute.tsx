import { useAuth } from "../context/globalContext";
import Unauthorized from "./Unauthorized";

const ProtectedRoute = ({ element }: { element: JSX.Element }) => {
  const { user } = useAuth();
  console.log(user?.loading, user?.isLogged);

  return user?.loading ? (
    <>Loading...</>
  ) : user?.isLogged ? (
    element
  ) : (
    <Unauthorized />
  );
};

export default ProtectedRoute;
