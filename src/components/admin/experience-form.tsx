"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus, Trash2, X } from "lucide-react";

type Experience = {
  id?: string;
  company: string;
  role: string;
  duration: string;
  location?: string | null;
  description: string;
  achievements?: string[] | null;
  technologies?: string[] | null;
  type?: "internship" | "part-time" | "full-time" | "freelance" | null;
  start_date?: string | null;
  end_date?: string | null;
  current?: boolean | null;
  order_index?: number | null;
};

interface ExperienceFormProps {
  experience?: Experience | null;
  onSave: (experience: Experience) => Promise<void>;
  onCancel: () => void;
}

export function ExperienceForm({ experience, onSave, onCancel }: ExperienceFormProps) {
  const [formData, setFormData] = useState<Experience>(() => {
    const base = {
      company: "",
      role: "",
      duration: "",
      location: "",
      description: "",
      achievements: [] as string[],
      technologies: [] as string[],
      type: "full-time" as const,
      current: false,
      order_index: 0,
    };
    if (experience) {
      return {
        ...base,
        ...experience,
        achievements: experience.achievements || [],
        technologies: experience.technologies || [],
      };
    }
    return base;
  });

  const [achievementInput, setAchievementInput] = useState("");
  const [techInput, setTechInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await onSave(formData);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save experience");
    } finally {
      setLoading(false);
    }
  };

  const addAchievement = () => {
    if (achievementInput.trim()) {
      setFormData({
        ...formData,
        achievements: [...(formData.achievements || []), achievementInput.trim()],
      });
      setAchievementInput("");
    }
  };

  const removeAchievement = (index: number) => {
    setFormData({
      ...formData,
      achievements: (formData.achievements || []).filter((_, i) => i !== index),
    });
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

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-400">
          {error}
        </div>
      )}

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Company *</label>
          <input
            type="text"
            required
            value={formData.company}
            onChange={(e) => setFormData({ ...formData, company: e.target.value })}
            className="w-full rounded-md border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/40"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Role *</label>
          <input
            type="text"
            required
            value={formData.role}
            onChange={(e) => setFormData({ ...formData, role: e.target.value })}
            className="w-full rounded-md border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/40"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Duration *</label>
          <input
            type="text"
            required
            value={formData.duration}
            onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
            className="w-full rounded-md border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/40"
            placeholder="2024 - Present"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Location</label>
          <input
            type="text"
            value={formData.location || ""}
            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
            className="w-full rounded-md border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/40"
            placeholder="City, Country"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Type</label>
          <select
            value={formData.type || "full-time"}
            onChange={(e) => setFormData({ ...formData, type: e.target.value as Experience["type"] })}
            className="w-full rounded-md border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/40"
          >
            <option value="full-time">Full-time</option>
            <option value="part-time">Part-time</option>
            <option value="internship">Internship</option>
            <option value="freelance">Freelance</option>
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
            checked={formData.current || false}
            onChange={(e) => setFormData({ ...formData, current: e.target.checked })}
            className="rounded"
          />
          <span className="text-sm font-medium">Current Position</span>
        </label>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Description *</label>
        <textarea
          required
          rows={4}
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          className="w-full rounded-md border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/40"
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Achievements</label>
        <div className="flex gap-2">
          <input
            type="text"
            value={achievementInput}
            onChange={(e) => setAchievementInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                addAchievement();
              }
            }}
            className="flex-1 rounded-md border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/40"
            placeholder="Add achievement..."
          />
          <Button type="button" onClick={addAchievement} size="sm" variant="outline">
            <Plus className="h-4 w-4" />
          </Button>
        </div>
        <div className="space-y-1 mt-2">
          {(formData.achievements || []).map((achievement, i) => (
            <div
              key={i}
              className="flex items-center justify-between rounded-md border bg-background px-3 py-2 text-sm"
            >
              <span>{achievement}</span>
              <button
                type="button"
                onClick={() => removeAchievement(i)}
                className="text-red-400 hover:text-red-500"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
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

      <div className="flex gap-2 justify-end">
        <Button type="button" variant="outline" onClick={onCancel} disabled={loading}>
          Cancel
        </Button>
        <Button type="submit" disabled={loading}>
          {loading ? "Saving..." : experience ? "Update Experience" : "Create Experience"}
        </Button>
      </div>
    </form>
  );
}
