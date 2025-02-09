import { useEffect, useState } from "react";
import { IOrganization } from "../../lib/appwrite";
import { getRepos, IRepo } from "../../lib/github";
import RepoCard from "./RepoCard";
import { useOrganization } from "../../context/globalContext";

const OrganizationCard = ({ org }: { org: IOrganization }) => {
  const { organization } = useOrganization();
  const [watchingRepo, setWatchingRepo] = useState<boolean>(false);
  const [repos, setRepos] = useState<IRepo[] | null>(null);

  useEffect(() => {
    getRepos(org.organizationName).then((data) => {
      const tempRepos: IRepo[] = data
        .filter((repo: any) => {
          return repo.has_issues && repo.open_issues_count > 0;
        })
        .map((repo: any) => {
          return {
            git_url: repo.git_url,
            full_name: repo.full_name,
            has_issues: repo.has_issues,
            open_issues_count: repo.open_issues_count,
            updated_at: repo.updated_at,
          };
        })
        .sort(
          (a: IRepo, b: IRepo) =>
            new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
        );

      setRepos(tempRepos);
    });
  }, [watchingRepo]);

  return (
    <div className="bg-gray-100 p-4 rounded-md flex flex-col justify-between items-center">
      <div className="flex items-center justify-between w-full">
        <h3
          className="text-gray-600 cursor-pointer"
          onClick={() => {
            setWatchingRepo(!watchingRepo);
          }}
        >
          {org.organizationName}
        </h3>
        <button
          className="bg-red-500 text-white disabled:opacity-60 disabled:cursor-not-allowed"
          onClick={() => {
            organization?.methods.deleteOrganization(org.$id!);
          }}
          disabled={organization?.loading}
        >
          Delete
        </button>
      </div>
      {organization?.loading && <div className="text-center">Loading...</div>}
      {!organization?.loading && watchingRepo && repos && repos!.length > 0 && (
        <div className="flex flex-col gap-2 items-start w-full mt-2 pt-2 border-t border-black max-h-[400px] overflow-y-scroll">
          {repos!.map((repo) => (
            <RepoCard repo={repo} key={repo.full_name} />
          ))}
        </div>
      )}
    </div>
  );
};

export default OrganizationCard;
