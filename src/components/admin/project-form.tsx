"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { X, Plus, Trash2 } from "lucide-react";

type Project = {
  id?: string;
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

interface ProjectFormProps {
  project?: Project | null;
  onSave: (project: Project) => Promise<void>;
  onCancel: () => void;
}

export function ProjectForm({ project, onSave, onCancel }: ProjectFormProps) {
  const [formData, setFormData] = useState<Project>(() => {
    const base = {
      title: "",
      description: "",
      long_description: "",
      technologies: [] as string[],
      features: [] as string[],
      image_url: "",
      demo_url: "",
      github_url: "",
      category: "web" as const,
      featured: false,
      order_index: 0,
    };
    if (project) {
      return {
        ...base,
        ...project,
        technologies: project.technologies || [],
        features: project.features || [],
        category: project.category || "web",
      };
    }
    return base;
  });

  const [techInput, setTechInput] = useState("");
  const [featureInput, setFeatureInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await onSave(formData);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save project");
    } finally {
      setLoading(false);
    }
  };

  const addTech = () => {
    if (techInput.trim()) {
      setFormData({
        ...formData,
        technologies: [...(formData.technologies || []), techInput.trim()],
      });
      setTechInput("");
    }
  };

  const removeTech = (index: number) => {
    setFormData({
      ...formData,
      technologies: (formData.technologies || []).filter((_, i) => i !== index),
    });
  };

  const addFeature = () => {
    if (featureInput.trim()) {
      setFormData({
        ...formData,
        features: [...(formData.features || []), featureInput.trim()],
      });
      setFeatureInput("");
    }
  };

  const removeFeature = (index: number) => {
    setFormData({
      ...formData,
      features: (formData.features || []).filter((_, i) => i !== index),
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-400">
          {error}
        </div>
      )}

      <div className="space-y-2">
        <label className="text-sm font-medium">Title *</label>
        <input
          type="text"
          required
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          className="w-full rounded-md border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/40"
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Description *</label>
        <textarea
          required
          rows={3}
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          className="w-full rounded-md border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/40"
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Long Description</label>
        <textarea
          rows={5}
          value={formData.long_description || ""}
          onChange={(e) => setFormData({ ...formData, long_description: e.target.value })}
          className="w-full rounded-md border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/40"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Category *</label>
          <select
            required
            value={formData.category || "web"}
            onChange={(e) => setFormData({ ...formData, category: e.target.value as Project["category"] || "web" })}
            className="w-full rounded-md border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/40"
          >
            <option value="web">Web</option>
            <option value="mobile">Mobile</option>
            <option value="blockchain">Blockchain</option>
            <option value="ai">AI</option>
          </select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Order Index</label>
          <input
            type="number"
            value={formData.order_index || 0}
            onChange={(e) => setFormData({ ...formData, order_index: parseInt(e.target.value) || 0 })}
            className="w-full rounded-md border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/40"
          />
        </div>
      </div>

      <div className="space-y-2">
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={formData.featured || false}
            onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
            className="rounded"
          />
          <span className="text-sm font-medium">Featured</span>
        </label>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Image URL</label>
        <input
          type="url"
          value={formData.image_url || ""}
          onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
          className="w-full rounded-md border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/40"
          placeholder="https://example.com/image.png"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Demo URL</label>
          <input
            type="url"
            value={formData.demo_url || ""}
            onChange={(e) => setFormData({ ...formData, demo_url: e.target.value })}
            className="w-full rounded-md border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/40"
            placeholder="https://example.com"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">GitHub URL</label>
          <input
            type="url"
            value={formData.github_url || ""}
            onChange={(e) => setFormData({ ...formData, github_url: e.target.value })}
            className="w-full rounded-md border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/40"
            placeholder="https://github.com/..."
          />
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Technologies</label>
        <div className="flex gap-2">
          <input
            type="text"
            value={techInput}
            onChange={(e) => setTechInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                addTech();
              }
            }}
            className="flex-1 rounded-md border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/40"
            placeholder="Add technology..."
          />
          <Button type="button" onClick={addTech} size="sm" variant="outline">
            <Plus className="h-4 w-4" />
          </Button>
        </div>
        <div className="flex flex-wrap gap-2 mt-2">
          {(formData.technologies || []).map((tech, i) => (
            <span
              key={i}
              className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-3 py-1 text-xs text-primary"
            >
              {tech}
              <button
                type="button"
                onClick={() => removeTech(i)}
                className="hover:text-red-400"
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Features</label>
        <div className="flex gap-2">
          <input
            type="text"
            value={featureInput}
            onChange={(e) => setFeatureInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                addFeature();
              }
            }}
            className="flex-1 rounded-md border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/40"
            placeholder="Add feature..."
          />
          <Button type="button" onClick={addFeature} size="sm" variant="outline">
            <Plus className="h-4 w-4" />
          </Button>
        </div>
        <div className="space-y-1 mt-2">
          {(formData.features || []).map((feature, i) => (
            <div
              key={i}
              className="flex items-center justify-between rounded-md border bg-background px-3 py-2 text-sm"
            >
              <span>{feature}</span>
              <button
                type="button"
                onClick={() => removeFeature(i)}
                className="text-red-400 hover:text-red-500"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="flex gap-2 justify-end">
        <Button type="button" variant="outline" onClick={onCancel} disabled={loading}>
          Cancel
        </Button>
        <Button type="submit" disabled={loading}>
          {loading ? "Saving..." : project ? "Update Project" : "Create Project"}
        </Button>
      </div>
    </form>
  );
}
