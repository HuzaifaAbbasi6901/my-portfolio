export interface GitHubProfile {
  name: string;
  followers: number;
  publicRepos: number;
  avatarUrl: string;
  bio: string;
}

export interface GitHubRepo {
  name: string;
  description: string;
  stars: number;
  forks: number;
  language: string;
  url: string;
}

export interface GitHubStats {
  profile: GitHubProfile;
  topRepos: GitHubRepo[];
  topLanguages: Array<{ name: string; share: number }>;
}

/** Placeholder used when the GitHub API is unreachable or misconfigured. */
export const fallbackStats: GitHubStats = {
  profile: {
    name: "Your GitHub",
    followers: 0,
    publicRepos: 0,
    avatarUrl: "",
    bio: "Live GitHub stats appear here once GITHUB_USERNAME is configured in .env — this is the graceful fallback.",
  },
  topRepos: [
    {
      name: "your-project",
      description: "Your top repositories will be listed here.",
      stars: 0,
      forks: 0,
      language: "TypeScript",
      url: "https://github.com",
    },
  ],
  topLanguages: [{ name: "TypeScript", share: 100 }],
};

interface ApiRepo {
  name: string;
  description: string | null;
  stargazers_count: number;
  forks_count: number;
  language: string | null;
  html_url: string;
  fork: boolean;
}

export async function getGitHubStats(username: string): Promise<GitHubStats> {
  const headers: HeadersInit = {
    Accept: "application/vnd.github+json",
    "User-Agent": "portfolio-site",
  };

  const profileRes = await fetch(
    `https://api.github.com/users/${encodeURIComponent(username)}`,
    { headers, next: { revalidate: 3600 } }
  );
  if (!profileRes.ok) throw new Error(`GitHub profile fetch failed: ${profileRes.status}`);
  const profile = (await profileRes.json()) as {
    name: string | null;
    followers: number;
    public_repos: number;
    avatar_url: string;
    bio: string | null;
  };

  const reposRes = await fetch(
    `https://api.github.com/users/${encodeURIComponent(
      username
    )}/repos?sort=updated&per_page=100`,
    { headers, next: { revalidate: 3600 } }
  );
  if (!reposRes.ok) throw new Error(`GitHub repos fetch failed: ${reposRes.status}`);
  const repos = (await reposRes.json()) as ApiRepo[];

  const owned = repos.filter((r) => !r.fork);
  const topRepos = [...owned]
    .sort((a, b) => b.stargazers_count - a.stargazers_count)
    .slice(0, 4)
    .map((r) => ({
      name: r.name,
      description: r.description ?? "",
      stars: r.stargazers_count,
      forks: r.forks_count,
      language: r.language ?? "Code",
      url: r.html_url,
    }));

  const langCount = new Map<string, number>();
  for (const repo of owned) {
    if (!repo.language) continue;
    langCount.set(repo.language, (langCount.get(repo.language) ?? 0) + 1);
  }
  const langTotal = [...langCount.values()].reduce((a, b) => a + b, 0) || 1;
  const topLanguages = [...langCount.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([name, count]) => ({ name, share: Math.round((count / langTotal) * 100) }));

  return {
    profile: {
      name: profile.name ?? username,
      followers: profile.followers,
      publicRepos: profile.public_repos,
      avatarUrl: profile.avatar_url,
      bio: profile.bio ?? "",
    },
    topRepos: topRepos.length > 0 ? topRepos : fallbackStats.topRepos,
    topLanguages: topLanguages.length > 0 ? topLanguages : fallbackStats.topLanguages,
  };
}
