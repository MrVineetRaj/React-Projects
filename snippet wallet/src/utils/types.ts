export interface IFolder {
  parent: string;
  title: string;
  isShared?: boolean;
  owner: string;
  pinned: boolean;
  $id?: string;
  $createdAt?: string;
  $updatedAt?: string;
}

export interface ISnippet {
  title: string; //
  description?: string;
  isShared?: boolean;
  language: string;
  code: string;
  owner: string;
  folderId: string; //
  pinned?: boolean;
  $id?: string; //
  $createdAt?: string;
  $updatedAt?: string;
}

export interface IUser {
  $id?: string;
  name: string;
  email: string;
}
