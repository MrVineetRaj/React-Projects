import { Account, Client, Databases, ID, OAuthProvider, Query } from "appwrite";

export interface IOrganization {
  organizationName: string;
  userId: string;
  $id?: string;
}

export interface IContributingTo {
  organizationName: string;
  repoName: string;
  issueNumber: number;
  userId: string;
  $id?: string;
}

export const appwriteConfig = {
  endpoint: "https://cloud.appwrite.io/v1", // Your API Endpoint
  frontend: import.meta.env.VITE_PUBLIC_FRONTEND_ENDPOINT, // Your Frontend URL
  projectId: import.meta.env.VITE_PUBLIC_PROJECT_ID, // Your project ID
  databaseId: import.meta.env.VITE_PUBLIC_DATABASE_ID, // Your database ID
  contributingToCollectionId: import.meta.env
    .VITE_PUBLIC_CONTRIBUTING_TO_COLLECTION_ID, // Your contributing collection ID
  savedOrganizationCollectionId: import.meta.env
    .VITE_PUBLIC_SAVED_ORGANIZATION_COLLECTION_ID, // Your saved organization ID
};

const client = new Client()
  .setEndpoint(appwriteConfig.endpoint) // Your API Endpoint
  .setProject(appwriteConfig.projectId);

//   // Go to OAuth provider login page
// account.createOAuth2Session(
//   OAuthProvider.Github, // provider
//   "https://example.com/success", // redirect here on success
//   "https://example.com/failed", // redirect here on failure
//   ["repo", "user"] // scopes (optional)
// );

export class AuthServices {
  account;

  constructor() {
    this.account = new Account(client);
  }

  async loginOAuth(provider: string) {
    try {
      if (provider === "github") {
        await this.account.createOAuth2Session(
          OAuthProvider.Github,
          `${appwriteConfig.frontend}/profile`, // redirect here on success
          `${appwriteConfig.frontend}`, // redirect here on failure
          ["repo", "user"] // scopes (optional)
        );
      }
    } catch (error) {
      console.error(error);
    }
  }

  async logout() {
    try {
      await this.account.deleteSession("current");
    } catch (error) {
      console.error(error);
    }
  }

  async getAccount() {
    try {
      const user = await this.account.get();
      return user;
    } catch (error) {
      console.error(error);
    }
  }

  async getCurrentSession() {
    try {
      return await this.account.getSession("current");
    } catch (error) {
      console.error(error);
    }
  }

  async updateCurrentUser(field: string, value: string) {
    try {
      if (field === "name") {
        await this.account.updateName(value);
      }
    } catch (error) {
      console.error(error);
    }
  }
}

export class DatabaseServices {
  databases;
  constructor() {
    this.databases = new Databases(client);
  }

  async addNewOrganization(data: IOrganization) {
    const { organizationName, userId } = data;

    try {
      const response = await this.databases.createDocument(
        appwriteConfig.databaseId,
        appwriteConfig.savedOrganizationCollectionId,
        ID.unique(),
        {
          organizationName,
          userId,
        }
      );
      return response;
    } catch (error) {
      console.error(error);
    }
  }

  async getSavedOrganizations(userId: string) {
    try {
      
      const result = await this.databases.listDocuments(
        appwriteConfig.databaseId,
        appwriteConfig.savedOrganizationCollectionId,
        [Query.equal("userId", userId)]
      );

      
      return result;
    } catch (error: any) {
      console.error(error.message);

      throw error;
    }
  }

  async deleteSavedOrganization(documentId: string) {
    try {
      const response = await this.databases.deleteDocument(
        appwriteConfig.databaseId,
        appwriteConfig.savedOrganizationCollectionId,
        documentId
      );
      return response;
    } catch (error) {
      console.error(error);
    }
  }

  async addContributingTo(data: IContributingTo) {
    const { organizationName, repoName, issueNumber, userId } = data;

    try {
      const response = await this.databases.createDocument(
        appwriteConfig.databaseId,
        appwriteConfig.contributingToCollectionId,
        ID.unique(),
        {
          organizationName,
          repoName,
          issueNumber,
          userId,
        }
      );
      return response;
    } catch (error) {
      console.error(error);
    }
  }

  async getContributingTo(userId: string) {
    try {
      const response = await this.databases.listDocuments(
        appwriteConfig.databaseId,
        appwriteConfig.contributingToCollectionId,
        [Query.equal("userId", userId)]
      );
      return response.documents;
    } catch (error) {
      console.error(error);
    }
  }

  async deleteContributingTo(documentId: string) {
    try {
      const response = await this.databases.deleteDocument(
        appwriteConfig.databaseId,
        appwriteConfig.contributingToCollectionId,
        documentId
      );
      return response;
    } catch (error) {
      console.error(error);
    }
  }
}

const dbServices = new DatabaseServices();
const authServices = new AuthServices();

export { authServices, dbServices };
