export const runtime = "nodejs";

const CACHE_CONTROL = "public, max-age=300, s-maxage=3600, stale-while-revalidate=86400";

const QUERY = `
  query ContributionCalendar {
    viewer {
      contributionsCollection {
        contributionCalendar {
          totalContributions
          weeks {
            contributionDays {
              date
              contributionCount
              contributionLevel
            }
          }
        }
      }
    }
  }
`;

type GitHubDay = {
  date: string;
  contributionCount: number;
  contributionLevel: "NONE" | "FIRST_QUARTILE" | "SECOND_QUARTILE" | "THIRD_QUARTILE" | "FOURTH_QUARTILE";
};

const LEVELS: Record<GitHubDay["contributionLevel"], number> = {
  NONE: 0,
  FIRST_QUARTILE: 1,
  SECOND_QUARTILE: 2,
  THIRD_QUARTILE: 3,
  FOURTH_QUARTILE: 4,
};

export async function GET() {
  const token = process.env.GITHUB_TOKEN;
  if (!token) {
    return Response.json({ error: "GitHub activity is unavailable" }, { status: 503 });
  }

  try {
    const response = await fetch("https://api.github.com/graphql", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
        Accept: "application/vnd.github+json",
      },
      body: JSON.stringify({ query: QUERY }),
      cache: "no-store",
    });

    if (!response.ok) {
      return Response.json({ error: "GitHub activity is unavailable" }, { status: 502 });
    }

    const payload = (await response.json()) as {
      data?: {
        viewer?: {
          contributionsCollection?: {
            contributionCalendar?: { totalContributions: number; weeks: { contributionDays: GitHubDay[] }[] };
          };
        };
      };
    };
    const calendar = payload.data?.viewer?.contributionsCollection?.contributionCalendar;

    if (!calendar) {
      return Response.json({ error: "GitHub activity is unavailable" }, { status: 502 });
    }

    return Response.json(
      {
        total: calendar.totalContributions,
        contributions: calendar.weeks.flatMap((week) =>
          week.contributionDays.map((day) => ({
            date: day.date,
            count: day.contributionCount,
            level: LEVELS[day.contributionLevel],
          }))
        ),
      },
      { headers: { "Cache-Control": CACHE_CONTROL } }
    );
  } catch {
    return Response.json({ error: "GitHub activity is unavailable" }, { status: 502 });
  }
}
