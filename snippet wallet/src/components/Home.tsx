import { useEffect, useState } from "react";
import CreateNew from "./shared/CreateNew";
import { IFolder, ISnippet, IUser } from "../utils/types";
import { dbServices } from "../utils/appwrite";
import ReadSnippet from "./shared/ReadSnippet";

const Home = ({ user }: { user: IUser }) => {
  const [creating, setCreating] = useState<boolean>(false);
  const [reload, setReload] = useState<boolean>(false);
  const [activeFolder, setActiveFolder] = useState<
    IFolder | { title: string; $id: string }
  >({
    title: "root",
    $id: "root",
  });
  const [folders, setFolders] = useState<IFolder[]>([]);
  const [snippets, setSnippets] = useState<ISnippet[]>([]);
  const [path, setPath] = useState<{ title: string; $id: string }[]>([]);

  useEffect(() => {
    dbServices.getAllFolders(user?.$id!, activeFolder.$id!).then((res) => {
      // setFolders(res as IFolder[]);
      let tempFolders = res?.documents.map((doc) => {
        return {
          parent: doc.parent,
          title: doc.title,
          isShared: doc.isShared,
          owner: doc.owner,
          pinned: doc.pinned,
          $id: doc.$id,
          $createdAt: doc.$createdAt,
          $updatedAt: doc?.$updatedAt,
        };
      });
      setFolders(tempFolders!);
    });

    dbServices.getAllSnippets(user?.$id!, activeFolder.$id!).then((res) => {
      // setFolders(res as IFolder[]);
      let tempSnippets = res?.documents.map((doc) => {
        return {
          title: doc.title,
          description: doc.description,
          isShared: doc.isShared,
          language: doc.language,
          code: doc.code,
          owner: doc.owner,
          folderId: doc.folderId,
          pinned: doc.pinned,
          $id: doc.$id,
          $createdAt: doc.$createdAt,
          $updatedAt: doc?.$updatedAt,
        };
      });
      setSnippets(tempSnippets!);
    });
  }, [user, activeFolder, reload]);

  return (
    <div className=" relative">
      <div className="flex items-center justify-between px-3 border-b pb-2">
        <div className="flex gap items-end ">
          <i
            className="fa-solid fa-home cursor-pointer "
            onClick={() => {
              setActiveFolder({
                $id: "root",
                title: "root",
              });

              setPath([]);
            }}
          ></i>
          {path.length <= 2 ? (
            <>
              {path.length >= 1 && (
                <p
                  className="text-xs cursor-pointer"
                  onClick={() => {
                    // while (!stop) {
                    if (path.length <= 1) {
                      return;
                    }
                    let newPath = path;
                    setActiveFolder(newPath[0]);
                    newPath.pop();
                    setPath(newPath);
                    // }
                  }}
                >{`/${path[0]?.title}`}</p>
              )}
              {path.length == 2 && (
                <p className="text-xs cursor-pointer">{`/${path[1]?.title}`}</p>
              )}
            </>
          ) : (
            <>
              <p className="text-xs">{`/...`}</p>
              <p
                className="text-xs cursor-pointer"
                onClick={() => {
                  let newPath = path;
                  setActiveFolder(newPath[newPath.length - 2]);
                  newPath.pop();
                  setPath(newPath);
                }}
              >{`/${path[path.length - 2].title}`}</p>
              <p className="text-xs cursor-pointer">{`/${
                path[path.length - 1].title
              }`}</p>
            </>
          )}
        </div>
        <button
          className="p-2 border-2 border-primary text-primary"
          onClick={() => {
            setCreating(true);
          }}
        >
          Create
        </button>
      </div>

      <div className="p-2">
        {activeFolder?.$id === "root" ? (
          <>
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold">Pinned</h3>
              <span className="text-primary cursor-pointer">More</span>
            </div>
            <div className="flex overflow-x-scroll hide-scrollbar"></div>
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold">Recent</h3>
              <span className="text-primary cursor-pointer">More</span>
            </div>
            <div className="flex overflow-x-scroll hide-scrollbar"></div>{" "}
            <h3 className="text-lg font-bold">{"~root"}</h3>
            <div className="flex flex-wrap gap-8 my-2">
              {folders?.map((folder) => (
                <span
                  key={folder?.$id}
                  className="flex flex-col items-center gap-1 cursor-pointer active:scale-95 transition-all duration-150"
                  onClick={() => {
                    setActiveFolder(folder);
                    setPath([
                      ...path,
                      {
                        title: folder.title,
                        $id: folder.$id!,
                      },
                    ]);
                  }}
                >
                  <i className="fa-solid fa-folder text-yellow-500 text-6xl"></i>
                  <p className="text-xs">{folder?.title}</p>
                </span>
              ))}
            </div>
            <div className="mt-4">
              {snippets?.map((snippet) => (
                <ReadSnippet snippetId={snippet?.$id!} key={snippet?.$id!} />
              ))}
            </div>
          </>
        ) : (
          <>
            <div className="flex overflow-x-scroll hide-scrollbar gap-8 my-2">
              {folders?.map((folder) => (
                <span
                  key={folder?.$id + "j"}
                  className="flex flex-col items-center gap-1 cursor-pointer active:scale-95 transition-all duration-150"
                  onClick={() => {
                    setActiveFolder(folder);
                    setPath([
                      ...path,
                      {
                        title: folder.title,
                        $id: folder.$id!,
                      },
                    ]);
                  }}
                >
                  <i className="fa-solid fa-folder text-yellow-500 text-6xl"></i>
                  <p className="text-xs">{folder?.title}</p>
                </span>
              ))}
            </div>
            <div className="">
              {snippets?.map((snippet) => (
                <ReadSnippet snippetId={snippet?.$id!} key={snippet?.$id!} />
              ))}
            </div>
          </>
        )}
      </div>

      {creating && (
        <CreateNew
          setCreating={setCreating}
          currentActiveDirectory={activeFolder.$id!}
          userId={user?.$id!}
          setReload={setReload}
          reload={reload}
        />
      )}
    </div>
  );
};

export default Home;
