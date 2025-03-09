import { Account, Client, Databases, ID, OAuthProvider, Query } from "appwrite";
import { IFolder, ISnippet } from "../types";

export const appwriteConfig = {
  projectId: import.meta.env.VITE_PUBLIC_PROJECT_ID,
  dbId: import.meta.env.VITE_PUBLIC_DB_ID,
  folderCollectionId: import.meta.env.VITE_PUBLIC_FOLDER_COLLECTION_ID,
  savedFolderCollectionId: import.meta.env
    .VITE_PUBLIC_SAVED_FOLDER_COLLECTION_ID,
  snippetsCollectionId: import.meta.env.VITE_PUBLIC_SNIPPETS_COLLECTION_ID,
};
const client = new Client()
  .setEndpoint("https://cloud.appwrite.io/v1")
  .setProject(appwriteConfig.projectId);

export class AuthServices {
  account;
  constructor() {
    this.account = new Account(client);
  }

  async loginUser() {
    // const redirectURL = `chrome-extension://${chrome.runtime.id}/callback.html`;
    const redirectURL = "http://localhost:5173";
    this.account.createOAuth2Session(
      OAuthProvider.Github, // provider
      redirectURL,
      redirectURL,
      ["repo", "user"] // scopes (optional)
    );
  }

  async getProfile() {
    const res = await this.account.get();
    return res;
  }
}

export class DatabaseServices {
  databases;
  constructor() {
    this.databases = new Databases(client);
  }

  async createFolder(formData: IFolder) {
    try {
      const res = await this.databases.createDocument(
        appwriteConfig.dbId,
        appwriteConfig.folderCollectionId,
        ID.unique(),
        {
          title: formData.title,
          parent: formData.parent,
          isShared: formData.isShared,
          owner: formData.owner,
          pinned: formData.pinned,
        }
      );

      return res;
    } catch (error) {
      console.error(error);
    }
  }

  async getAllFolders(userId: string, parent: string) {
    try {
      const res = await this.databases.listDocuments(
        appwriteConfig.dbId,
        appwriteConfig.folderCollectionId,
        [Query.equal("owner", userId), Query.equal("parent", parent)]
      );

      return res;
    } catch (error) {
      console.error(error);
    }
  }

  async createSnippet(formData: ISnippet) {
    try {
      const res = await this.databases.createDocument(
        appwriteConfig.dbId,
        appwriteConfig.snippetsCollectionId,
        ID.unique(),
        {
          title: formData.title,
          folderId: formData.folderId,
          language: formData.language,
          code: formData.code,
          owner: formData.owner,
          description: formData.description,
        }
      );

      return res;
    } catch (error) {
      console.error(error);
    }
  }
  async getAllSnippets(userId: string, folderId: string) {
    try {
      const res = await this.databases.listDocuments(
        appwriteConfig.dbId,
        appwriteConfig.snippetsCollectionId,
        [
          Query.equal("owner", userId),
          Query.equal("folderId", folderId),
          Query.select(["$id", "title", "folderId"]),
        ]
      );

      return res;
    } catch (error) {
      console.error(error);
    }
  }

  async getSnippetById(snippetId: string) {
    try {
      const res = await this.databases.getDocument(
        appwriteConfig.dbId,
        appwriteConfig.snippetsCollectionId,
        snippetId
      );

      return res;
    } catch (error) {
      console.error(error);
    }
  }
}

export const authServices = new AuthServices();


export const dbServices = new DatabaseServices();
// export
