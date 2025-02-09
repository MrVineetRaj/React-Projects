import { useEffect, useState } from "react";
import { useAuth, useContributingTo } from "../context/globalContext";
import { checkGithubApiQuota } from "../lib/github";

const Profilepage = () => {
  const { user } = useAuth();
  const { contributingTo } = useContributingTo();
  const [quota, setQuota] = useState<{
    limit: number;
    remaining: number;
    reset: Date;
  } | null>(null);

  useEffect(() => {
    checkGithubApiQuota().then((data) => {
      
      // const date = new Date(data.reset * 1000);

      const tempQuota = {
        limit: data.limit,
        remaining: data.remaining,
        reset: new Date(data.reset * 1000),
      };
      
      setQuota(tempQuota);
    });
  }, [user?.data?.$id]);
  return (
    <>
      <div className="mt-4 relative">
        <h1 className="border-b pb-2 border-gray-600">Profile Page</h1>
        <button
          className="absolute top-0 right-4 text-red-500 "
          onClick={() => {
            user?.methods.logoutUser();
          }}
        >
          {user?.loading ? "Loading..." : "Logout"}
        </button>

        <div className="mt-4 text-gray-500">
          <h4 className="">Name: {user?.data?.name}</h4>
          <h4 className="">Email: {user?.data?.email}</h4>
        </div>
      </div>
      <div className="mt-4">
        <p>
          Rate Limit : {quota?.limit} | remaining : {quota?.remaining} | updated
          at : {quota?.reset.toLocaleString()}
        </p>
      </div>
      <div className="mt-8 relative">
        <h1 className="border-b pb-2 border-gray-600">Contributing in</h1>
        {contributingTo?.data?.map((item) => (
          <div className="">
            <h4 className="text-gray-500">
              <a
                href={`https://github.com/${item?.organizationName}/${item?.repoName}/issues/${item?.issueNumber}`}
                target="_blank"
              >{`${item?.organizationName}/${item?.repoName}/issune_no=${item?.issueNumber}`}</a>
            </h4>
          </div>
        ))}
      </div>
    </>
  );
};

export default Profilepage;
