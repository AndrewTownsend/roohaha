import { cacheTag, cacheLife } from "next/cache";
import logger from "@/logger";

const GITHUB_USERNAME = "AndrewTownsend";

export interface ContributionDay {
  date: string;
  contributionCount: number;
  weekday: number;
}

export interface ContributionWeek {
  contributionDays: ContributionDay[];
}

export interface ContributionData {
  totalContributions: number;
  weeks: ContributionWeek[];
  commits: number;
  pullRequests: number;
  codeReviews: number;
}

interface GithubGraphQLError {
  message: string;
}

interface GithubGraphQLResponse {
  data?: {
    user?: {
      contributionsCollection?: {
        totalCommitContributions?: number;
        totalPullRequestContributions?: number;
        totalPullRequestReviewContributions?: number;
        contributionCalendar?: {
          totalContributions: number;
          weeks: ContributionWeek[];
        };
      };
    };
  };
  errors?: GithubGraphQLError[];
}

const QUERY = `{
  user(login: "${GITHUB_USERNAME}") {
    contributionsCollection {
      totalCommitContributions
      totalPullRequestContributions
      totalPullRequestReviewContributions
      contributionCalendar {
        totalContributions
        weeks {
          contributionDays {
            date
            contributionCount
            weekday
          }
        }
      }
    }
  }
}`;

export async function readContributions(): Promise<ContributionData> {
  "use cache";
  cacheTag("github-contributions");
  cacheLife("days");
  return fetchContributions();
}

async function fetchContributions(): Promise<ContributionData> {
  const token = process.env.GITHUB_PAT;
  if (!token) {
    throw new Error("GITHUB_PAT is not set");
  }

  const res = await fetch("https://api.github.com/graphql", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ query: QUERY }),
  });

  if (!res.ok) {
    throw new Error(`GitHub API responded with status ${res.status}`);
  }

  const json = (await res.json()) as GithubGraphQLResponse;

  if (json.errors?.length) {
    logger.error({ errors: json.errors }, "GitHub GraphQL request returned errors");
    throw new Error("GitHub GraphQL request failed");
  }

  const collection = json.data?.user?.contributionsCollection;
  if (!collection?.contributionCalendar) {
    throw new Error("GitHub response missing contribution calendar data");
  }

  return {
    totalContributions: collection.contributionCalendar.totalContributions,
    weeks: collection.contributionCalendar.weeks,
    commits: collection.totalCommitContributions ?? 0,
    pullRequests: collection.totalPullRequestContributions ?? 0,
    codeReviews: collection.totalPullRequestReviewContributions ?? 0,
  };
}

