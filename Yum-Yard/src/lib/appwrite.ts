import { Client, Account, OAuthProvider, Databases, Query, ID } from "appwrite";
import axios from "axios";

const conf = {
  webUrl: import.meta.env.VITE_PUBLIC_WEB_URL,
  projectId: import.meta.env.VITE_PUBLIC_PROJECT_ID,
  databaseId: import.meta.env.VITE_PUBLIC_DATABASE_ID,
  savedRecipeCollectionId: import.meta.env
    .VITE_PUBLIC_SAVED_RECIPE_COLLECTION_ID,
};

const client = new Client();
client.setEndpoint("https://cloud.appwrite.io/v1").setProject(conf.projectId);

export class AuthServices {
  account;
  constructor() {
    this.account = new Account(client);
  }

  async createAccountWithOAuth() {
    this.account.createOAuth2Session(
      OAuthProvider.Github,
      `${conf.webUrl}/profile`, // redirect here on success
      `${conf.webUrl}`, // redirect here on failing
      ["name", "email"] // requested scopes] // scopes
    );
  }

  async logout() {
    try {
      const result = await this.account.deleteSession("current");
      console.log(result);
      return result;
    } catch (error) {
      console.error(error);
      return false;
    }
  }

  //   async createAccount(email, password) {
}

export class UserServices {
  account;
  constructor() {
    this.account = new Account(client);
  }

  async userSession() {
    try {
      const session = await this.account.getSession("current");
      return session;
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  async getCurrentUser() {
    try {
      const result = await this.account.get();
      return result;
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  async updateUser({
    updating,
    data,
    password = "",
  }: {
    updating: string;
    data: string;
    password?: string;
  }) {
    // updating : {name,email,password}  , data : {name,email,password}
    try {
      if (updating === "email") {
        const result = await this.account.updateEmail(data, password!);
        return result;
      }
      if (updating === "password") {
        const result = await this.account.updatePassword(data);
        return result;
      }
      const result = await this.account.updateName(data);
      return result;
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  async fetchDetailsFromGithub(providerAccessToken: string) {
    try {
      const res = await axios.get("https://api.github.com/user", {
        headers: {
          Authorization: `Bearer ${providerAccessToken}`,
        },
      });

      return res.data;
    } catch (error) {
      console.error(error);
      return null;
    }
  }
}

export class DatabaseServices {
  databases;
  constructor() {
    this.databases = new Databases(client);
  }

  async saveRecipe(data: {
    title: string;
    ingredients: string;
    instructions: string;
    servings: string;
    userId: string;
  }) {
    try {
      const result = await this.databases.createDocument(
        conf.databaseId!,
        conf.savedRecipeCollectionId!,
        ID.unique(),
        data
      );
      return result;
    } catch (error) {
      console.error(error);
      return false;
    }
  }

  async getSavedRecipes(userId: string) {
    try {
      console.log("userId", userId);
      const result = await this.databases.listDocuments(
        conf.databaseId!,
        conf.savedRecipeCollectionId!,
        [Query.search("userId", userId)]
      );
      return result.documents;
    } catch (error) {
      console.error(error);
      return [];
    }
  }
}
const userServices = new UserServices();
const authServices = new AuthServices();
const databaseServices = new DatabaseServices();

export { authServices, userServices, databaseServices };
