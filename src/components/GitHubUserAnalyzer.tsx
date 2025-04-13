import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer
} from "recharts";

interface Repo {
  id: number;
  name: string;
  html_url: string;
  description: string;
}

interface CommitActivity {
  date: string;
  count: number;
}

const GitHubUserAnalyzer: React.FC = () => {
  const [username, setUsername] = useState("");
  const [repos, setRepos] = useState<Repo[]>([]);
  const [commits, setCommits] = useState<CommitActivity[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchReposAndCommits = async () => {
    setLoading(true);
    setError("");
    setRepos([]);
    setCommits([]);

    try {
      // First: Check if user exists
      const userRes = await fetch(`https://api.github.com/users/${username}`);
      if (userRes.status === 404) throw new Error("User not found");
      if (!userRes.ok) throw new Error("Failed to fetch user");

      // Then fetch repos
      const reposRes = await fetch(
        `https://api.github.com/users/${username}/repos`
      );
      if (!reposRes.ok) throw new Error("Failed to fetch repositories");
      const reposData: Repo[] = await reposRes.json();
      setRepos(reposData);

      // Then fetch events
      const eventsRes = await fetch(
        `https://api.github.com/users/${username}/events/public`
      );
      if (!eventsRes.ok) throw new Error("Failed to fetch user events");
      const events = await eventsRes.json();

      const commitEvents = events.filter((e: any) => e.type === "PushEvent");
      const commitCounts: Record<string, number> = {};

      commitEvents.forEach((event: any) => {
        const date = new Date(event.created_at).toISOString().split("T")[0];
        commitCounts[date] =
          (commitCounts[date] || 0) + event.payload.commits.length;
      });

      const commitsArray: CommitActivity[] = Object.entries(commitCounts).map(
        ([date, count]) => ({
          date,
          count
        })
      );

      setCommits(commitsArray.reverse());
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 max-w-3xl mx-auto">
      <Card className="bg-gradient-to-br from-white to-slate-100 shadow-lg border border-gray-200">
        <CardContent className="p-6 space-y-6">
          <h1 className="text-3xl font-bold text-indigo-600">
            GitHub User Analyzer
          </h1>
          <div className="flex gap-2 items-center">
            <Input
              className="bg-white border-indigo-300 focus:border-indigo-500"
              placeholder="Enter GitHub username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <Button
              className="bg-indigo-600 hover:bg-indigo-700 text-white"
              onClick={fetchReposAndCommits}
              disabled={!username || loading}
            >
              Analyze
            </Button>
          </div>
          {loading && <p className="text-yellow-600 font-medium">Loading...</p>}
          {error && <p className="text-red-600 font-medium">{error}</p>}

          {error && (
            <div className="text-center text-red-600 text-lg font-semibold">
              {error === "User not found"
                ? `User "${username}" not found. Please try another username.`
                : error}
            </div>
          )}

          {repos.length > 0 && (
            <div className="bg-white p-4 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold text-indigo-500 mb-3">
                Repositories
              </h2>
              <ul className="list-disc ml-6 space-y-2">
                {repos.map((repo) => (
                  <li key={repo.id}>
                    <a
                      className="text-blue-600 font-medium hover:underline"
                      href={repo.html_url}
                      target="_blank"
                      rel="noreferrer"
                    >
                      {repo.name}
                    </a>{" "}
                    <span className="text-gray-600">
                      - {repo.description || "No description"}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {commits.length > 0 && (
            <div className="bg-white mt-6 p-4 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold text-indigo-500 mb-3">
                Daily Commits
              </h2>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={commits}>
                  <XAxis dataKey="date" stroke="#64748b" />
                  <YAxis allowDecimals={false} stroke="#64748b" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#f3f4f6",
                      borderColor: "#cbd5e1"
                    }}
                  />
                  <Bar dataKey="count" fill="#6366f1" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default GitHubUserAnalyzer;
