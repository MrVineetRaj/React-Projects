import { createContext, useContext, useEffect, useState } from "react";
import { authServices, userServices } from "../lib/appwrite";

// defining type for the context
export interface IGlobalContext {
  user: {
    name: string;
    email: string;
    $id: string;
    isFetchingUser?: boolean;
  };
  isAuthenticated: boolean;
  methods: {
    getUser: () => Promise<any>;
    logoutUser?: () => Promise<any>;
  };
}

// creating context
export const GlobalContext = createContext<IGlobalContext | null>(null);

// creating provider
function GlobalProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState<IGlobalContext["user"]>({
    name: "",
    email: "",
    $id: "",
    isFetchingUser: true,
  });
  // for loading state of user
  const [isFetchingUser, setIsFetchingUser] = useState<boolean>(false);

  useEffect(() => {
    setIsFetchingUser(true);
    console.log("fetching user context");

    // fetching checking if user is authenticated and then saving the token
    userServices
      .userSession()
      .then((session) => {
        if (session?.current) {
          console.log("fetching user context current");
          setIsAuthenticated(true);
          userServices.getCurrentUser().then((fetchedUser) => {
            if (!fetchedUser?.name) {
              if (session.provider === "github") {
                userServices
                  .fetchDetailsFromGithub(session.providerAccessToken)
                  .then((data) => {
                    userServices.updateUser({
                      updating: "name",
                      data: data.name || data.login,
                    });
                  });
              }
            }
          });
        }
      })
      .catch((error) => {
        console.error("Error fetching current user:", error);
      })
      .finally(() => {
        setIsFetchingUser(false);
      });

    // fetching the user
    setIsFetchingUser(true);
    userServices
      .getCurrentUser()
      .then((res) => {
        if (!res) {
          setIsAuthenticated(false);
          setUser({
            ...user,
            isFetchingUser: false,
          });
          return;
        }
        setUser({
          name: res!.name,
          email: res!.email,
          $id: res!.$id,
          isFetchingUser: false,
        });
      })
      .catch((error) => {
        console.error("Error fetching current user:", error);
      })
      .finally(() => {
        setIsFetchingUser(false);
      });
    setIsFetchingUser(false);
  }, []);

  console.log("isFetchingUser", isFetchingUser);
  // function to get user
  const getUser = async () => {
    const user = await userServices.getCurrentUser();
    return user;
  };

  const logoutUser = async () => {
    await authServices.logout();
    setIsAuthenticated(false);
  };

  // context value
  const contextValue: IGlobalContext = {
    user: user,
    isAuthenticated: isAuthenticated,
    methods: {
      getUser,
      logoutUser,
    },
  };

  return (
    <GlobalContext.Provider value={contextValue}>
      {children}
    </GlobalContext.Provider>
  );
}

// just for easy access to isAuthenticated
export const useAuth = () => {
  const context = useContext(GlobalContext);
  if (!context) {
    throw new Error("useAuth must be used within a AuthProvider");
  }
  return { isLogged: context.isAuthenticated };
};

// just for easy access to user
export const useUser = () => {
  const context = useContext(GlobalContext);
  if (!context) {
    throw new Error("useUser must be used within a AuthProvider");
  }
  return { user: context.user };
};

export const useMethods = () => {
  const context = useContext(GlobalContext);
  if (!context) {
    throw new Error("useMethods must be used within a AuthProvider");
  }
  return { methods: context.methods };
};

export default GlobalProvider;
