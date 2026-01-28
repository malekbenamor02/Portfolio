"use client";

import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Edit2, Trash2, ExternalLink, Eye, EyeOff, RefreshCw } from "lucide-react";
import { Modal } from "./modal";
import { ProjectForm } from "./project-form";
import { ExperienceForm } from "./experience-form";
import { PostForm } from "./post-form";

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
  featured?: boolean | null;
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
  type?: "internship" | "part-time" | "full-time" | "freelance" | null;
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
  views?: number | null;
};

type Analytics = {
  totalVisitors: number;
  uniqueVisitors?: { today?: number; week?: number; month?: number };
  topPages?: { path: string; count: number }[];
};

export function AdminDashboard() {
  const [tab, setTab] = useState<Tab>("projects");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const [projects, setProjects] = useState<Project[]>([]);
  const [experience, setExperience] = useState<Experience[]>([]);
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [analytics, setAnalytics] = useState<Analytics | null>(null);

  // Modal states
  const [showProjectModal, setShowProjectModal] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [showExperienceModal, setShowExperienceModal] = useState(false);
  const [editingExperience, setEditingExperience] = useState<Experience | null>(null);
  const [showPostModal, setShowPostModal] = useState(false);
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);

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
    setSuccess(null);
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

  // Project handlers
  const handleSaveProject = async (project: Omit<Project, "id"> & { id?: string }) => {
    const url = editingProject
      ? `/api/admin/projects/${editingProject.id}`
      : "/api/admin/projects";
    const method = editingProject ? "PUT" : "POST";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(project),
    });

    if (!res.ok) {
      const data = await res.json();
      throw new Error(data?.error || "Failed to save project");
    }

    setShowProjectModal(false);
    setEditingProject(null);
    setSuccess(editingProject ? "Project updated!" : "Project created!");
    await fetchTab("projects");
  };

  const handleDeleteProject = async (id: string) => {
    if (!confirm("Are you sure you want to delete this project?")) return;

    const res = await fetch(`/api/admin/projects/${id}`, { method: "DELETE" });
    if (res.ok) {
      setProjects((prev) => prev.filter((x) => x.id !== id));
      setSuccess("Project deleted!");
    }
  };

  // Experience handlers
  const handleSaveExperience = async (exp: Omit<Experience, "id"> & { id?: string }) => {
    const url = editingExperience
      ? `/api/admin/experience/${editingExperience.id}`
      : "/api/admin/experience";
    const method = editingExperience ? "PUT" : "POST";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(exp),
    });

    if (!res.ok) {
      const data = await res.json();
      throw new Error(data?.error || "Failed to save experience");
    }

    setShowExperienceModal(false);
    setEditingExperience(null);
    setSuccess(editingExperience ? "Experience updated!" : "Experience created!");
    await fetchTab("experience");
  };

  const handleDeleteExperience = async (id: string) => {
    if (!confirm("Are you sure you want to delete this experience entry?")) return;

    const res = await fetch(`/api/admin/experience/${id}`, { method: "DELETE" });
    if (res.ok) {
      setExperience((prev) => prev.filter((x) => x.id !== id));
      setSuccess("Experience deleted!");
    }
  };

  // Post handlers
  const handleSavePost = async (post: Omit<BlogPost, "id"> & { id?: string }) => {
    const url = editingPost
      ? `/api/admin/posts/${editingPost.id}`
      : "/api/admin/posts";
    const method = editingPost ? "PUT" : "POST";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(post),
    });

    if (!res.ok) {
      const data = await res.json();
      throw new Error(data?.error || "Failed to save post");
    }

    setShowPostModal(false);
    setEditingPost(null);
    setSuccess(editingPost ? "Post updated!" : "Post created!");
    await fetchTab("posts");
  };

  const handleDeletePost = async (id: string) => {
    if (!confirm("Are you sure you want to delete this post?")) return;

    const res = await fetch(`/api/admin/posts/${id}`, { method: "DELETE" });
    if (res.ok) {
      setPosts((prev) => prev.filter((x) => x.id !== id));
      setSuccess("Post deleted!");
    }
  };

  const openProjectModal = (project?: Project) => {
    setEditingProject(project || null);
    setShowProjectModal(true);
  };

  const openExperienceModal = (exp?: Experience) => {
    setEditingExperience(exp || null);
    setShowExperienceModal(true);
  };

  const openPostModal = (post?: BlogPost) => {
    setEditingPost(post || null);
    setShowPostModal(true);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-3xl font-display font-bold">Admin Dashboard</h1>
          <p className="text-sm text-muted-foreground">
            Manage your content: {activeLabel}
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => fetchTab(tab)}
            disabled={loading}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </Button>
          <Button variant="outline" onClick={logout}>
            Logout
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 border-b pb-2">
        {(["projects", "experience", "posts", "analytics"] as Tab[]).map((t) => (
          <Button
            key={t}
            variant={tab === t ? "default" : "ghost"}
            onClick={() => setTab(t)}
            className="capitalize"
          >
            {t}
          </Button>
        ))}
      </div>

      {/* Messages */}
      {error && (
        <div className="rounded-lg border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-400">
          {error}
        </div>
      )}

      {success && (
        <div className="rounded-lg border border-green-500/30 bg-green-500/10 p-4 text-sm text-green-400">
          {success}
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div className="rounded-lg border bg-card p-8 text-center text-muted-foreground">
          <RefreshCw className="h-6 w-6 animate-spin mx-auto mb-2" />
          Loading...
        </div>
      )}

      {/* Analytics Tab */}
      {!loading && tab === "analytics" && analytics && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Visitors
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                {analytics.totalVisitors?.toLocaleString() || 0}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Unique Today
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                {analytics.uniqueVisitors?.today?.toLocaleString() || 0}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Unique This Month
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                {analytics.uniqueVisitors?.month?.toLocaleString() || 0}
              </div>
            </CardContent>
          </Card>

          {analytics.topPages && analytics.topPages.length > 0 && (
            <Card className="md:col-span-3">
              <CardHeader>
                <CardTitle>Top Pages</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {analytics.topPages.map((page, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between p-2 rounded-md bg-muted/50"
                    >
                      <span className="text-sm font-mono">{page.path}</span>
                      <span className="text-sm font-medium">{page.count} views</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {/* Projects Tab */}
      {!loading && tab === "projects" && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Projects ({projects.length})</h2>
            <Button onClick={() => openProjectModal()}>
              <Plus className="h-4 w-4 mr-2" />
              New Project
            </Button>
          </div>

          {projects.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center text-muted-foreground">
                No projects yet. Create your first project!
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {projects.map((p) => (
                <Card key={p.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <CardTitle className="text-lg line-clamp-2">{p.title}</CardTitle>
                      {p.featured && (
                        <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">
                          Featured
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground capitalize">{p.category}</p>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                      {p.description}
                    </p>
                    <div className="flex flex-wrap gap-1 mb-4">
                      {p.technologies?.slice(0, 3).map((tech, i) => (
                        <span
                          key={i}
                          className="text-xs bg-muted px-2 py-1 rounded"
                        >
                          {tech}
                        </span>
                      ))}
                      {p.technologies && p.technologies.length > 3 && (
                        <span className="text-xs text-muted-foreground">
                          +{p.technologies.length - 3}
                        </span>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openProjectModal(p)}
                        className="flex-1"
                      >
                        <Edit2 className="h-3 w-3 mr-1" />
                        Edit
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteProject(p.id)}
                        className="text-red-400 hover:text-red-500"
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Experience Tab */}
      {!loading && tab === "experience" && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Experience ({experience.length})</h2>
            <Button onClick={() => openExperienceModal()}>
              <Plus className="h-4 w-4 mr-2" />
              New Experience
            </Button>
          </div>

          {experience.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center text-muted-foreground">
                No experience entries yet. Add your first experience!
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {experience.map((e) => (
                <Card key={e.id}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle>{e.role}</CardTitle>
                        <p className="text-sm text-muted-foreground">{e.company}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {e.duration} {e.location && `• ${e.location}`}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => openExperienceModal(e)}
                        >
                          <Edit2 className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteExperience(e.id)}
                          className="text-red-400 hover:text-red-500"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-3">{e.description}</p>
                    {e.achievements && e.achievements.length > 0 && (
                      <div className="space-y-1 mb-3">
                        {e.achievements.slice(0, 3).map((ach, i) => (
                          <p key={i} className="text-xs text-muted-foreground">
                            • {ach}
                          </p>
                        ))}
                      </div>
                    )}
                    {e.technologies && e.technologies.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {e.technologies.slice(0, 5).map((tech, i) => (
                          <span
                            key={i}
                            className="text-xs bg-muted px-2 py-1 rounded"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Posts Tab */}
      {!loading && tab === "posts" && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Posts ({posts.length})</h2>
            <Button onClick={() => openPostModal()}>
              <Plus className="h-4 w-4 mr-2" />
              New Post
            </Button>
          </div>

          {posts.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center text-muted-foreground">
                No posts yet. Create your first blog post!
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {posts.map((p) => (
                <Card key={p.id}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <CardTitle>{p.title}</CardTitle>
                          {p.published ? (
                            <span className="text-xs bg-green-500/10 text-green-400 px-2 py-1 rounded flex items-center gap-1">
                              <Eye className="h-3 w-3" />
                              Published
                            </span>
                          ) : (
                            <span className="text-xs bg-muted px-2 py-1 rounded flex items-center gap-1">
                              <EyeOff className="h-3 w-3" />
                              Draft
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground font-mono mt-1">
                          /blog/{p.slug}
                        </p>
                        {p.excerpt && (
                          <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
                            {p.excerpt}
                          </p>
                        )}
                      </div>
                      <div className="flex gap-2">
                        {p.published && (
                          <Button
                            variant="ghost"
                            size="sm"
                            asChild
                          >
                            <a
                              href={`/blog/${p.slug}`}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <ExternalLink className="h-4 w-4" />
                            </a>
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => openPostModal(p)}
                        >
                          <Edit2 className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeletePost(p.id)}
                          className="text-red-400 hover:text-red-500"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      {p.category && <span>Category: {p.category}</span>}
                      {p.views !== null && <span>Views: {p.views}</span>}
                      {p.published_at && (
                        <span>
                          Published: {new Date(p.published_at).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                    {p.tags && p.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-3">
                        {p.tags.map((tag, i) => (
                          <span
                            key={i}
                            className="text-xs bg-muted px-2 py-1 rounded"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Modals */}
      <Modal
        isOpen={showProjectModal}
        onClose={() => {
          setShowProjectModal(false);
          setEditingProject(null);
        }}
        title={editingProject ? "Edit Project" : "New Project"}
        size="lg"
      >
        <ProjectForm
          project={editingProject}
          onSave={handleSaveProject}
          onCancel={() => {
            setShowProjectModal(false);
            setEditingProject(null);
          }}
        />
      </Modal>

      <Modal
        isOpen={showExperienceModal}
        onClose={() => {
          setShowExperienceModal(false);
          setEditingExperience(null);
        }}
        title={editingExperience ? "Edit Experience" : "New Experience"}
        size="lg"
      >
        <ExperienceForm
          experience={editingExperience}
          onSave={handleSaveExperience}
          onCancel={() => {
            setShowExperienceModal(false);
            setEditingExperience(null);
          }}
        />
      </Modal>

      <Modal
        isOpen={showPostModal}
        onClose={() => {
          setShowPostModal(false);
          setEditingPost(null);
        }}
        title={editingPost ? "Edit Post" : "New Post"}
        size="xl"
      >
        <PostForm
          post={editingPost}
          onSave={handleSavePost}
          onCancel={() => {
            setShowPostModal(false);
            setEditingPost(null);
          }}
        />
      </Modal>
    </div>
  );
}
