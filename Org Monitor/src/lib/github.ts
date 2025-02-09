// https://api.github.com/orgs/aossie-org/repos
// https://api.github.com/repos/AOSSIE-Org/Social-Street-Smart/issues
// https://api.github.com/repos/AOSSIE-Org/Social-Street-Smart/issues/68

import axios from "axios";

const token = import.meta.env.VITE_PUBLIC_GITHUB_PAT_TOKEN as string;
export interface IRepo {
  git_url: string;
  full_name: string;
  has_issues: boolean;
  open_issues_count: number;
  updated_at: string;
}

export interface IIssue {
  created_at: string;
  labels: any[];
  number: number;
  state: string;
  body: string;
  issue_url: string;
  title: string;
}

export interface IComments {
  name: string;
  body: string;
  created_at: string;
}
const getRepos = async (org: string) => {
  const res = await axios.get(`https://api.github.com/orgs/${org}/repos`, {
    headers: {
      Authorization: `token ${token}`,
    },
  });
  return res.data;
};

const getIssues = async (repo: string) => {
  
  const res = await axios.get(`https://api.github.com/repos/${repo}/issues`, {
    headers: {
      Authorization: `token ${token}`,
    },
  });
  return res.data;
};

const getComments = async (issue_url: string) => {
  
  const res = await axios.get(`${issue_url}/comments`, {
    headers: {
      Authorization: `token ${token}`,
    },
  });
  return res.data;
};
const checkGithubApiQuota = async () => {
  if (!token) {
    throw new Error("Token not found");
  }

  const res = await axios.get("https://api.github.com/rate_limit", {
    headers: {
      Authorization: `token ${token}`,
    },
  });

  return res.data.resources.core;
};

export { getRepos, getIssues, checkGithubApiQuota, getComments };
