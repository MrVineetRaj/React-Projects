import { useEffect, useState } from "react";
import { useAuth, useOrganization } from "../context/globalContext";
import OrganizationCard from "../components/repos/OrganizationCard";

const ReposPage = () => {
  const { user } = useAuth();
  const { organization } = useOrganization();
  // const [organizationNames, setOrganizationNames] = useState<string[]>([]);
  const [isAdding, setIsAdding] = useState<boolean>(false);
  const [newOrg, setNewOrg] = useState<string>("");

  useEffect(() => {
    if (!user?.data?.$id) return;
    organization!.methods.getOrganizations();

  }, [user?.data?.$id]);

  useEffect(() => {
    console.log("Organization", organization?.loading);
  }, [organization?.loading]);
  const handleAddOrganization = (organizationName: string) => {
    // console.log("Adding Organization", organizationName);
    if(!organizationName) return;
    organization?.methods.addOrganization({
      organizationName,
      userId: user?.data?.$id!,
    });
  };

  console.log("Organization", organization);
  return (
    <>
      {organization?.error ? (
        <div className="m-auto">
          <h4 className="text-red-400 italic text-center">
            {organization?.error} <br />
            Try again later
          </h4>
        </div>
      ) : organization?.data && organization?.data.length === 0 ? (
        <div className=" m-auto flex items-center flex-col justify-center gap-4">
          <h1 className="text-center">
            Looks like you have not added <br />
            Any Organization yet
          </h1>
          <hr className="w-full" />
          {!isAdding ? (
            <button
              className="bg-pink-500 text-black"
              onClick={() => setIsAdding(true)}
            >
              Start by Adding One
            </button>
          ) : (
            <form
              className="flex flex-col gap-4 mt-4"
              onSubmit={(e) => {
                e.preventDefault();
                handleAddOrganization(newOrg);
              }}
            >
              <input
                type="text"
                className="bg-transparent outline-none border px-4 py-2 rounded-md"
                placeholder="Orgn. Name"
                value={newOrg}
                onChange={(e) => setNewOrg(e.target.value)}
              />
              <button className="w-full bg-pink-500">Add</button>
            </form>
          )}
        </div>
      ) : (
        <div className="flex flex-col gap-4 mt-4">
          <h1 className="text-center">Your Organizations</h1>
          <hr />
          <form
            className="flex gap-4 mt-4"
            onSubmit={(e) => {
              e.preventDefault();

              handleAddOrganization(newOrg);
              // handleAddOrganization(e./);
            }}
          >
            <input
              type="text"
              className="bg-transparent outline-none border px-4 py-2 rounded-md w-full"
              placeholder="Orgn. Name"
              value={newOrg}
              onChange={(e) => setNewOrg(e.target.value)}
            />
            <button className="w-full bg-pink-500">Add</button>
          </form>
          <div className="flex flex-col gap-4">
            {organization?.data?.map((org, index) => (
              <OrganizationCard org={org} key={index} />
            ))}
          </div>
        </div>
      )}
    </>
  );
};

export default ReposPage;
