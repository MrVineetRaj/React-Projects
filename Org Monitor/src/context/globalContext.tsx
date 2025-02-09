import { createContext, useContext, useEffect, useState } from "react";
import {
  authServices,
  dbServices,
  IContributingTo,
  IOrganization,
} from "../lib/appwrite";

export interface IUSer {
  name: string;
  email: string;
  $id: string;
}

export interface IGlobalContext {
  user: {
    data: IUSer | null;
    loading: boolean;
    methods: {
      loginUser: (provider: string) => void;
      logoutUser: () => void;
      getUser: () => void;
      updateUser: (field: string, value: string) => void;
    };
    error: string | null;
    isLogged: boolean;
  };
  organization?: {
    data: IOrganization[];
    loading: boolean;
    error: string | null;
    methods: {
      addOrganization: (data: IOrganization) => void;
      getOrganizations: () => void;
      deleteOrganization: (organizationId: string) => void;
    };
  };
  contributingTo?: {
    data: IContributingTo[];
    loading: boolean;
    error: string | null;
    methods: {
      addContributingTo: (data: IContributingTo) => void;
      getContributingTo: (userId: string) => void;
      removeFromContributingTo: (documentId: string) => void;
    };
  };
}

export const GlobalContext = createContext<IGlobalContext | null>(null);

const GlobalProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<IUSer | null>(null);
  const [loadingUser, setLoadingUser] = useState<boolean>(false);
  const [errorUser, setErrorUser] = useState<string | null>(null);
  const [isLogged, setIsLogged] = useState<boolean>(false);
  const [organization, setOrganizations] = useState<IOrganization[] | null>(
    null
  );
  const [errorOrganization, setErrorOrganization] = useState<string | null>(
    null
  );
  const [loadingOrganization, setLoadingOrganization] =
    useState<boolean>(false);
  const [contributingTo, setContributingTo] = useState<
    IContributingTo[] | null
  >(null);
  const [errorContributingTo, setErrorContributingTo] = useState<string | null>(
    null
  );
  const [loadingContributingTo, setLoadingContributingTo] =
    useState<boolean>(false);

  useEffect(() => {
    getUser();
  }, []);

  // user related functions
  const loginUser = async (provider: string) => {
    setLoadingUser(true);
    try {
      await authServices.loginOAuth(provider);
    } catch (error) {
      setErrorUser("Not able to login");
    } finally {
      setLoadingUser(false);
    }
  };

  const logoutUser = async () => {
    setLoadingUser(true);
    try {
      await authServices.logout();
      setUser(null);
      setIsLogged(false);
    } catch (error) {
      setErrorUser("Not able to logout");
    } finally {
      setLoadingUser(false);
    }
  };

  const getUser = async () => {
    setLoadingUser(true);
    try {
      setLoadingUser(true);
      const user = await authServices.getAccount();
      if (!user) {
        setErrorUser("Not able to get user");
        return;
      }
      setUser({
        name: user.name,
        email: user.email,
        $id: user.$id,
      });
      setIsLogged(true);

      // get contributing to
      getContributingTo(user.$id);
    } catch (error) {
      setErrorUser("Not able to get user");
    } finally {
      setLoadingUser(false);
    }
  };

  const updateUser = async (field: string, value: string) => {
    setLoadingUser(true);
    try {
      await authServices.updateCurrentUser(field, value);
    } catch (error) {
      setErrorUser("Not able to update user");
    } finally {
      setLoadingUser(false);
    }
  };

  // organization related functions
  const addOrganization = async (data: IOrganization) => {
    setLoadingOrganization(true);
    try {
      await dbServices.addNewOrganization(data);
      getOrganizations();
    } catch (error) {
      setErrorUser("Not able to add organization");
    } finally {
      setLoadingOrganization(false);
    }
  };

  const getOrganizations = async () => {
    setLoadingOrganization(true);
    try {
      const res = await dbServices.getSavedOrganizations(user?.$id!);
      const tempOrganizations: IOrganization[] = (res?.documents || []).map(
        (org) => {
          return {
            organizationName: org.organizationName as string,
            userId: org.userId! as string,
            $id: org.$id as string,
          };
        }
      );

      setOrganizations(tempOrganizations!);
    } catch (error) {
      console.log("Error : -> ", error);
      setErrorOrganization("Not able to get organizations");
    } finally {
      setLoadingOrganization(false);
    }
  };

  const deleteOrganization = async (organizationId: string) => {
    setLoadingOrganization(true);
    try {
      await dbServices.deleteSavedOrganization(organizationId);
      getOrganizations();
    } catch (error) {
      console.log("Error : -> ", error);
      setErrorOrganization("Not able to delete organization");
    } finally {
      setLoadingOrganization(false);
    }
  };

  // contributing to related functions
  const addContributingTo = async (data: IContributingTo) => {
    setLoadingContributingTo(true);
    try {
      await dbServices.addContributingTo(data);
      getContributingTo(data.userId);
    } catch (error) {
      setErrorContributingTo("Not able to add contributing to");
    } finally {
      setLoadingContributingTo(false);
    }
  };

  const getContributingTo = async (userId: string) => {
    setLoadingContributingTo(true);
    try {
      const res = await dbServices.getContributingTo(userId);
      const tempContributingTo: IContributingTo[] = res!.map((issue) => {
        return {
          organizationName: issue.organizationName as string,
          repoName: issue.repoName as string,
          issueNumber: issue.issueNumber as number,
          userId: issue.userId as string,
          $id: issue.$id as string,
        };
      });

      setContributingTo(tempContributingTo!);
    } catch (error) {
      console.log("Error : -> ", error);
      setErrorContributingTo("Not able to get contributing to");
    } finally {
      setLoadingContributingTo(false);
    }
  };

  const removeFromContributingTo = async (documentId: string) => {
    setLoadingContributingTo(true);
    try {
      dbServices.deleteContributingTo(documentId);
    } catch (error) {
      console.log("Error : -> ", error);
      setErrorContributingTo("Not able to delete contributing to");
    } finally {
      setLoadingContributingTo(false);
    }
  };

  const contextValue: IGlobalContext = {
    user: {
      data: user,
      loading: loadingUser,
      methods: {
        loginUser,
        logoutUser,
        getUser,
        updateUser,
      },
      error: errorUser,
      isLogged: isLogged,
    },
    organization: {
      data: organization!,
      loading: loadingOrganization,
      error: errorOrganization,
      methods: {
        addOrganization,
        getOrganizations,
        deleteOrganization,
      },
    },
    contributingTo: {
      data: contributingTo!,
      loading: loadingContributingTo,
      error: errorContributingTo,
      methods: {
        addContributingTo,
        getContributingTo,
        removeFromContributingTo,
      },
    },
  };

  return (
    <GlobalContext.Provider value={contextValue}>
      {children}
    </GlobalContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(GlobalContext);

  if (context === undefined) {
    throw new Error("useAuth must be used within a GlobalProvider");
  }
  return { user: context?.user };
};

export const useOrganization = () => {
  const context = useContext(GlobalContext);

  if (context === undefined) {
    throw new Error("useOrganization must be used within a GlobalProvider");
  }
  return { organization: context?.organization };
};

export const useContributingTo = () => {
  const context = useContext(GlobalContext);

  if (context === undefined) {
    throw new Error("useContributingTo must be used within a GlobalProvider");
  }
  return { contributingTo: context?.contributingTo };
};
export default GlobalProvider;
