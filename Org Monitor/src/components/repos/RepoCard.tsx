import { useEffect, useState } from "react";
import { getIssues, IIssue, IRepo } from "../../lib/github";
import IssueCard from "./IssueCard";

const RepoCard = ({ repo }: { repo: IRepo }) => {
  const [watchingIssues, setWatchingIssues] = useState<boolean>(false);
  const [issues, setIssues] = useState<IIssue[] | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    if (!watchingIssues) return;
    setIsLoading(true);
    getIssues(repo.full_name)
      .then((data) => {
        const tempIssues = data
          .filter((issue: any) => {
            return !issue.html_url.includes("pull") && issue.state === "open";
          })
          .map((issue: any) => {
            return {
              created_at: issue.created_at,
              labels: issue.labels,
              number: issue.number,
              state: issue.state,
              body: issue.body,
              issue_url: issue.url,
              title: issue.title,
            };
          })
          .sort((a: IIssue, b: IIssue) => {
            return (
              new Date(b.created_at).getTime() -
              new Date(a.created_at).getTime()
            );
          });

        setIssues(tempIssues);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [watchingIssues]);

  return (
    <div className="w-full">
      <div className="flex justify-between items-center gap-2 w-full">
        <div
          className="flex flex-col w-[60%] cursor-pointer"
          onClick={() => setWatchingIssues(!watchingIssues)}
        >
          <p className="text-black w-full ">{repo.full_name} </p>
          <small className="font-thin text-black ">
            No of issues : {repo.open_issues_count} {"|"}
            {repo.updated_at}
          </small>
        </div>
        <a
          className="text-blue-500 text-sm font-semibold min-w-"
          href={repo.git_url}
        >
          Visit here
        </a>
      </div>

      <div className="">
        {!issues && isLoading && <div>Loading...</div>}

        {issues && watchingIssues && (
          <div className="flex flex-col gap-2 items-start w-full mt-2 pt-2 border-t border-black max-h-[400px] overflow-y-scroll">
            {issues.map((issue) => (
              <IssueCard issue={issue} key={issue.number} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default RepoCard;
