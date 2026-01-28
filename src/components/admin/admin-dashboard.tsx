"use client";

import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";

type Tab = "projects" | "experience" | "posts" | "analytics";

type Project = {
  id: string;
  title: string;
  description: string;
  long_description?: string | null;
  technologies?: string[] | null;
  features?: string[] | null;
  image_url?: string | null;
  demo_url?: string | null;
  github_url?: string | null;
  category?: "web" | "mobile" | "blockchain" | "ai";
  order_index?: number | null;
};

type Experience = {
  id: string;
  company: string;
  role: string;
  duration: string;
  location?: string | null;
  description: string;
  achievements?: string[] | null;
  technologies?: string[] | null;
  type?: string | null;
  order_index?: number | null;
};

type BlogPost = {
  id: string;
  title: string;
  slug: string;
  excerpt?: string | null;
  content: string;
  published?: boolean | null;
  published_at?: string | null;
  tags?: string[] | null;
  category?: string | null;
};

export function AdminDashboard() {
  const [tab, setTab] = useState<Tab>("projects");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [projects, setProjects] = useState<Project[]>([]);
  const [experience, setExperience] = useState<Experience[]>([]);
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [analytics, setAnalytics] = useState<{
    totalVisitors: number;
    uniqueVisitors?: { today?: number; week?: number; month?: number };
  } | null>(null);

  const activeLabel = useMemo(() => {
    switch (tab) {
      case "projects":
        return "Projects";
      case "experience":
        return "Experience";
      case "posts":
        return "Posts";
      case "analytics":
        return "Analytics";
    }
  }, [tab]);

  const fetchTab = async (t: Tab) => {
    setLoading(true);
    setError(null);
    try {
      const url =
        t === "projects"
          ? "/api/admin/projects"
          : t === "experience"
            ? "/api/admin/experience"
            : t === "posts"
              ? "/api/admin/posts"
              : "/api/admin/analytics";

      const res = await fetch(url, { cache: "no-store" });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Request failed");

      if (t === "projects") setProjects(data.projects || []);
      if (t === "experience") setExperience(data.experience || []);
      if (t === "posts") setPosts(data.posts || []);
      if (t === "analytics") setAnalytics(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void fetchTab(tab);
  }, [tab]);

  const logout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    window.location.href = "/admin/login";
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-3xl font-display font-bold">Admin Dashboard</h1>
          <p className="text-sm text-muted-foreground">
            Manage your content: {activeLabel}
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => fetchTab(tab)} disabled={loading}>
            Refresh
          </Button>
          <Button variant="outline" onClick={logout}>
            Logout
          </Button>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {(["projects", "experience", "posts", "analytics"] as Tab[]).map((t) => (
          <Button
            key={t}
            variant={tab === t ? "default" : "outline"}
            onClick={() => setTab(t)}
          >
            {t}
          </Button>
        ))}
      </div>

      {error && (
        <div className="rounded-lg border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-400">
          {error}
        </div>
      )}

      {loading && (
        <div className="rounded-lg border bg-card p-4 text-sm text-muted-foreground">
          Loading...
        </div>
      )}

      {!loading && tab === "analytics" && analytics && (
        <div className="rounded-xl border bg-card p-6 space-y-2">
          <h2 className="text-xl font-semibold">Visitors</h2>
          <p className="text-sm text-muted-foreground">
            Total visitors:{" "}
            <span className="text-foreground font-medium">
              {analytics.totalVisitors?.toLocaleString?.() ?? analytics.totalVisitors}
            </span>
          </p>
          <p className="text-sm text-muted-foreground">
            Unique today:{" "}
            <span className="text-foreground font-medium">
              {analytics.uniqueVisitors?.today?.toLocaleString?.() ?? analytics.uniqueVisitors?.today}
            </span>
          </p>
        </div>
      )}

      {!loading && tab === "projects" && (
        <div className="rounded-xl border bg-card p-6">
          <h2 className="text-xl font-semibold mb-4">Projects ({projects.length})</h2>
          <div className="space-y-3">
            {projects.map((p) => (
              <div key={p.id} className="flex items-start justify-between gap-4 border rounded-lg p-4">
                <div>
                  <div className="font-medium">{p.title}</div>
                  <div className="text-sm text-muted-foreground line-clamp-2">{p.description}</div>
                </div>
                <Button
                  variant="outline"
                  onClick={async () => {
                    if (!confirm("Delete this project?")) return;
                    const res = await fetch(`/api/admin/projects/${p.id}`, { method: "DELETE" });
                    if (res.ok) setProjects((prev) => prev.filter((x) => x.id !== p.id));
                  }}
                >
                  Delete
                </Button>
              </div>
            ))}
          </div>
          <p className="text-xs text-muted-foreground mt-4">
            Editing UI is minimal right now; we can add full create/edit forms next.
          </p>
        </div>
      )}

      {!loading && tab === "experience" && (
        <div className="rounded-xl border bg-card p-6">
          <h2 className="text-xl font-semibold mb-4">Experience ({experience.length})</h2>
          <div className="space-y-3">
            {experience.map((e) => (
              <div key={e.id} className="flex items-start justify-between gap-4 border rounded-lg p-4">
                <div>
                  <div className="font-medium">{e.role} — {e.company}</div>
                  <div className="text-sm text-muted-foreground">{e.duration}</div>
                </div>
                <Button
                  variant="outline"
                  onClick={async () => {
                    if (!confirm("Delete this experience entry?")) return;
                    const res = await fetch(`/api/admin/experience/${e.id}`, { method: "DELETE" });
                    if (res.ok) setExperience((prev) => prev.filter((x) => x.id !== e.id));
                  }}
                >
                  Delete
                </Button>
              </div>
            ))}
          </div>
          <p className="text-xs text-muted-foreground mt-4">
            Next: add create/edit forms.
          </p>
        </div>
      )}

      {!loading && tab === "posts" && (
        <div className="rounded-xl border bg-card p-6">
          <h2 className="text-xl font-semibold mb-4">Posts ({posts.length})</h2>
          <div className="space-y-3">
            {posts.map((p) => (
              <div key={p.id} className="flex items-start justify-between gap-4 border rounded-lg p-4">
                <div>
                  <div className="font-medium">{p.title}</div>
                  <div className="text-sm text-muted-foreground">/{p.slug}</div>
                </div>
                <Button
                  variant="outline"
                  onClick={async () => {
                    if (!confirm("Delete this post?")) return;
                    const res = await fetch(`/api/admin/posts/${p.id}`, { method: "DELETE" });
                    if (res.ok) setPosts((prev) => prev.filter((x) => x.id !== p.id));
                  }}
                >
                  Delete
                </Button>
              </div>
            ))}
          </div>
          <p className="text-xs text-muted-foreground mt-4">
            Next: add create/edit markdown editor.
          </p>
        </div>
      )}
    </div>
  );
}

