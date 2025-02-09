import { useEffect, useState } from "react";
import { getComments, IComments, IIssue } from "../../lib/github";
import MarkdownPreview from "@uiw/react-markdown-preview";
import clsx from "clsx";
import { useAuth, useContributingTo } from "../../context/globalContext";

const IssueCard = ({ issue }: { issue: IIssue }) => {
  const { user } = useAuth();
  const { contributingTo } = useContributingTo();
  const [watchingDescription, setWatchingDescription] =
    useState<boolean>(false);

  const [watchingComments, setWatchingComments] = useState<boolean>(false);
  const [comments, setComments] = useState<IComments[] | null>(null);
  const [isContributing, setIsContributing] = useState<boolean>(false);

  useEffect(() => {
    if (!contributingTo?.data) return;
    setIsContributing(
      contributingTo?.data.some((item) => item.issueNumber === issue.number)
    );
  }, [contributingTo?.data, issue.number]);

  useEffect(() => {
    if (!watchingComments) return;
    getComments(issue.issue_url).then((data) => {
      const tempComments = data
        .map((comment: any) => {
          return {
            name: comment.user.login,
            body: comment.body,
            created_at: comment.created_at,
          };
        })
        .sort((a: IComments, b: IComments) => {
          return (
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
          );
        });

      setComments(tempComments);
    });
  }, [watchingComments]);
  return (
    <div className="bg-gray-100 p-2 rounded-md flex flex-col gap-2 text-gray-600 items-start border border-gray-600 w-full">
      <h4 className="text-black">
        {issue.title}
        <a
          href={issue?.issue_url.replace("api.", "").replace("repos/", "")}
          className="text-sm text-blue-500"
          target="_blank"
        >
          {" #"}
          {issue.number}
        </a>
        <span
          onClick={() => {
            
            contributingTo?.methods.addContributingTo({
              issueNumber: issue.number,
              organizationName: issue.issue_url.split("/")[4],
              repoName: issue.issue_url.split("/")[5],
              userId: user?.data?.$id!,
            });
          }}
          className={clsx(
            "btn text-xs ml-2",
            isContributing
              ? "text-white border bg-orange-500 cursor-not-allowed opacity-55"
              : "text-orange-500 border border-orange-500"
          )}
        >
          {isContributing ? "Contributing" : "Contribute"}
        </span>
      </h4>
      <small className="text-black text-sm">
        {issue?.created_at}
        {" | "}
        {issue?.state}
      </small>
      <div className="flex gap-2 ">
        {issue.labels.map((label) => (
          <div
            key={label.id}
            className="bg-gray-300 text-black px-2 py-1 rounded-md"
          >
            {label.name}
          </div>
        ))}
      </div>
      <button
        className="bg-black text-white text-xs px-2"
        onClick={() => setWatchingDescription(!watchingDescription)}
      >
        See Description
      </button>
      {watchingDescription && (
        <MarkdownPreview source={issue.body} style={{ padding: 16 }} />
      )}
      <button
        className="bg-black text-white text-xs px-2"
        onClick={() => setWatchingComments(!watchingComments)}
      >
        See Comments
      </button>

      {watchingComments && (
        <div className="flex flex-col gap-2 items-start w-full mt-2 pt-2 border-t border-black max-h-[400px] overflow-y-scroll">
          {comments?.map((comment) => (
            <div
              key={comment.created_at}
              className="bg-gray-200 p-2 rounded-md"
            >
              <h4 className="text-black">{comment.name}</h4>
              <MarkdownPreview source={comment.body} style={{ padding: 16 }} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default IssueCard;
