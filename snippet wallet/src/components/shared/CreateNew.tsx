import { useState } from "react";
import FormField from "./FormField";
import { dbServices } from "../../utils/appwrite";
import { availableLanguages } from "../../utils/constants";
import PrismCodeRenderer from "./PrismCodeRenderer";

interface IFormData {
  title: string;
  createNew: string;
  language: string;
  code: string;
  description: string;
}
const CreateNew = ({
  setCreating,
  currentActiveDirectory,
  userId,
  setReload,
  reload,
}: {
  setCreating: (value: boolean) => void;
  currentActiveDirectory: string;
  userId: string;
  setReload: (value: boolean) => void;
  reload: boolean;
}) => {
  const [loading, setLoading] = useState<boolean>();
  const [isCreatingSnippet, setIsCreatingSnippet] = useState<boolean>(false);
  const [formData, setFormData] = useState<IFormData>({
    title: "",
    createNew: "",
    language: "",
    code: "",
    description: "",
  });

  async function handleSubmit() {
    setLoading(true);
    if (formData.createNew === "FOLDER") {
      await dbServices.createFolder({
        title: formData.title,
        parent: currentActiveDirectory,
        isShared: false,
        owner: userId,
        pinned: false,
      });
      
      setLoading(false);
    } else if (formData.createNew === "SNIPPET") {
      await dbServices.createSnippet({
        title: formData.title,
        folderId: currentActiveDirectory,
        language: formData.language,
        code: formData.code,
        owner: userId,
        description: formData.description,
      });
      
      setLoading(false);
    }
    setFormData({
      title: "",
      createNew: "",
      language: "",
      code: "",
      description: "",
    });
    setCreating(false);
    setReload(!reload);
  }
  return (
    <div className="w-full absolute bg-white top-0 left-0 ">
      <span
        onClick={() => {
          setCreating(false);
        }}
      >
        <i className="fa-solid fa-x absolute top-4 right-4 text-red-500 text-2xl"></i>
      </span>

      <form
        action=""
        className=" flex flex-col w-full overflow-y-scroll gap-4  p-5 rounded-md shadow-lg shadow-black/50 mb-5"
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit();
        }}
      >
        <legend className="text-2xl font-bold text-black">Create New</legend>
        <FormField
          value={formData?.createNew! || ""}
          label="Create New *"
          type="select"
          handleChange={(val) => {
            setIsCreatingSnippet(val === "SNIPPET");
            setFormData({
              ...formData,
              createNew: val,
            });
          }}
          name="createNew"
          selectOptions={[
            { value: "SNIPPET", label: "Snippet" },
            { value: "FOLDER", label: "folder" },
          ]}
        />
        <FormField
          value={formData?.title! || ""}
          label="Title *"
          type="text"
          handleChange={(val) => {
            setFormData({
              ...formData,
              title: val,
            });
          }}
          name="title"
        />

        {isCreatingSnippet && (
          <>
            <FormField
              value={formData?.language! || ""}
              label="Language *"
              type="select"
              handleChange={(val) => {
                
                setFormData({
                  ...formData,
                  language: val,
                });
              }}
              name="language"
              selectOptions={availableLanguages}
            />
            <FormField
              value={formData?.description! || ""}
              label="Description"
              type="textarea"
              handleChange={(val) => {
                
                setFormData({
                  ...formData,
                  description: val,
                });
              }}
              name="description"
              noOfRows={4}
              maxChar={200}
              isRequired={false}
            />
            <PrismCodeRenderer
              code={formData?.code! || ""}
              label="Code *"
              handleChange={(val) => {
                
                setFormData({
                  ...formData,
                  code: val,
                });
              }}
              name="code"
              noOfRows={12}
              maxChar={10000}
              language={formData.language}
              asInputField={true}
            />
          </>
        )}
        <button className="bg-primary text-white p-2" disabled={loading}>
          {loading ? (
            <i className="fa-solid fa-circle-notch animate-spin"></i>
          ) : (
            "Submit"
          )}
        </button>
      </form>
    </div>
  );
};

export default CreateNew;
