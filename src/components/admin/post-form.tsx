"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus, X } from "lucide-react";

type BlogPost = {
  id?: string;
  title: string;
  slug: string;
  excerpt?: string | null;
  content: string;
  cover_image_url?: string | null;
  tags?: string[] | null;
  category?: string | null;
  published?: boolean | null;
  published_at?: string | null;
  seo_title?: string | null;
  seo_description?: string | null;
};

interface PostFormProps {
  post?: BlogPost | null;
  onSave: (post: BlogPost) => Promise<void>;
  onCancel: () => void;
}

function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function PostForm({ post, onSave, onCancel }: PostFormProps) {
  const [formData, setFormData] = useState<BlogPost>(() => {
    const base = {
      title: "",
      slug: "",
      excerpt: "",
      content: "",
      cover_image_url: "",
      tags: [] as string[],
      category: "",
      published: false,
      seo_title: "",
      seo_description: "",
    };
    if (post) {
      return {
        ...base,
        ...post,
        tags: post.tags || [],
        published: post.published ?? false,
      };
    }
    return base;
  });

  const [tagInput, setTagInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleTitleChange = (title: string) => {
    setFormData({
      ...formData,
      title,
      slug: formData.slug || generateSlug(title),
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const postData = {
        ...formData,
        published: formData.published ?? false,
        published_at: (formData.published ?? false) && !post?.published_at
          ? new Date().toISOString()
          : formData.published_at,
      };
      await onSave(postData);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save post");
    } finally {
      setLoading(false);
    }
  };

  const addTag = () => {
    if (tagInput.trim()) {
      setFormData({
        ...formData,
        tags: [...(formData.tags || []), tagInput.trim()],
      });
      setTagInput("");
    }
  };

  const removeTag = (index: number) => {
    setFormData({
      ...formData,
      tags: (formData.tags || []).filter((_, i) => i !== index),
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
          onChange={(e) => handleTitleChange(e.target.value)}
          className="w-full rounded-md border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/40"
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Slug *</label>
        <input
          type="text"
          required
          value={formData.slug}
          onChange={(e) => setFormData({ ...formData, slug: generateSlug(e.target.value) })}
          className="w-full rounded-md border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/40"
          placeholder="my-blog-post"
        />
        <p className="text-xs text-muted-foreground">
          URL-friendly version of the title (auto-generated from title)
        </p>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Excerpt</label>
        <textarea
          rows={2}
          value={formData.excerpt || ""}
          onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
          className="w-full rounded-md border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/40"
          placeholder="Short description for preview..."
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Content (Markdown) *</label>
        <textarea
          required
          rows={15}
          value={formData.content}
          onChange={(e) => setFormData({ ...formData, content: e.target.value })}
          className="w-full rounded-md border bg-background px-3 py-2 text-sm font-mono outline-none focus:ring-2 focus:ring-primary/40"
          placeholder="# Title&#10;&#10;Your markdown content here..."
        />
        <p className="text-xs text-muted-foreground">
          Use Markdown syntax. Preview will be available on the blog page.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Category</label>
          <input
            type="text"
            value={formData.category || ""}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            className="w-full rounded-md border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/40"
            placeholder="Tutorial, Tips, etc."
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Cover Image URL</label>
          <input
            type="url"
            value={formData.cover_image_url || ""}
            onChange={(e) => setFormData({ ...formData, cover_image_url: e.target.value })}
            className="w-full rounded-md border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/40"
            placeholder="https://example.com/image.png"
          />
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Tags</label>
        <div className="flex gap-2">
          <input
            type="text"
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                addTag();
              }
            }}
            className="flex-1 rounded-md border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/40"
            placeholder="Add tag..."
          />
          <Button type="button" onClick={addTag} size="sm" variant="outline">
            <Plus className="h-4 w-4" />
          </Button>
        </div>
        <div className="flex flex-wrap gap-2 mt-2">
          {(formData.tags || []).map((tag, i) => (
            <span
              key={i}
              className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-3 py-1 text-xs text-primary"
            >
              {tag}
              <button
                type="button"
                onClick={() => removeTag(i)}
                className="hover:text-red-400"
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={formData.published ?? false}
            onChange={(e) => setFormData({ ...formData, published: e.target.checked })}
            className="rounded"
          />
          <span className="text-sm font-medium">Published</span>
        </label>
        <p className="text-xs text-muted-foreground">
          Published posts are visible on the public blog page
        </p>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">SEO Title</label>
        <input
          type="text"
          value={formData.seo_title || ""}
          onChange={(e) => setFormData({ ...formData, seo_title: e.target.value })}
          className="w-full rounded-md border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/40"
          placeholder="SEO optimized title (optional)"
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">SEO Description</label>
        <textarea
          rows={2}
          value={formData.seo_description || ""}
          onChange={(e) => setFormData({ ...formData, seo_description: e.target.value })}
          className="w-full rounded-md border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/40"
          placeholder="SEO meta description (optional)"
        />
      </div>

      <div className="flex gap-2 justify-end">
        <Button type="button" variant="outline" onClick={onCancel} disabled={loading}>
          Cancel
        </Button>
        <Button type="submit" disabled={loading}>
          {loading ? "Saving..." : post ? "Update Post" : "Create Post"}
        </Button>
      </div>
    </form>
  );
}
