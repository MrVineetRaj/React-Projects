import { useEffect, useState } from "react";
import { ISnippet } from "../../utils/types";
import { dbServices } from "../../utils/appwrite";
import PrismCodeRenderer from "./PrismCodeRenderer";

const ReadSnippet = ({
  snippetId = "67cd98750031c0bef00d",
}: // setIsReading,
{
  snippetId: string;
  // setIsReading: (value: boolean) => void;
  // isReading: boolean;
}) => {
  const [snippet, setSnippet] = useState<ISnippet | null>(null);
  useEffect(() => {
    dbServices.getSnippetById(snippetId).then((res) => {
      
      setSnippet({
        $id: res?.id,
        $createdAt: res?.$createdAt,
        $updatedAt: res?.$updatedAt,
        title: res?.title,
        description: res?.description,
        isShared: res?.isShared,
        language: res?.language,
        code: res?.code,
        owner: res?.owner,
        folderId: res?.folderId,
        pinned: res?.pinned,
      });
    });
  }, [snippetId]);
  return (
    <div className="relative w-full">
      {/* <i
        className="fa fa-x absolute top-2 right-2 text-red-500 text-2xl"
        onClick={() => {
          setIsReading(false);
          setSnippet(null);
        }}
      ></i> */}
      {/* <Navbar /> */}
      <div className="p-2">
        <h2 className="text-xl font-bold text-black">{snippet!?.title}</h2>
        {snippet?.description && <p>{snippet?.description}</p>}

        <div className="relative">
          <PrismCodeRenderer
            code={snippet?.code!}
            language={snippet?.language!}
          />
          <i
            className="fa fa-copy text-white absolute top-2 right-2 cursor-pointer"
            onClick={() => {
              navigator.clipboard.writeText(snippet?.code!);
            }}
          ></i>
        </div>
      </div>
    </div>
  );
};

export default ReadSnippet;
