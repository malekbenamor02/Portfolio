"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

type Testimonial = {
  id?: string;
  name: string;
  role: string;
  company?: string | null;
  content: string;
  avatar_url?: string | null;
  rating?: number | null;
  featured?: boolean | null;
  order_index?: number | null;
  approved?: boolean | null;
};

interface TestimonialFormProps {
  testimonial?: Testimonial | null;
  onSave: (testimonial: Testimonial) => Promise<void>;
  onCancel: () => void;
}

export function TestimonialForm({ testimonial, onSave, onCancel }: TestimonialFormProps) {
  const [formData, setFormData] = useState<Testimonial>(() => {
    const base = {
      name: "",
      role: "",
      company: "",
      content: "",
      avatar_url: "",
      rating: undefined as number | undefined,
      featured: false,
      order_index: 0,
      approved: false,
    };
    if (testimonial) {
      return {
        ...base,
        ...testimonial,
        company: testimonial.company ?? "",
        avatar_url: testimonial.avatar_url ?? "",
        rating: testimonial.rating ?? undefined,
        featured: testimonial.featured ?? false,
        order_index: testimonial.order_index ?? 0,
        approved: testimonial.approved ?? false,
      };
    }
    return base;
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const payload = {
        ...formData,
        company: formData.company || undefined,
        avatar_url: formData.avatar_url || undefined,
        rating: formData.rating ? Number(formData.rating) : undefined,
        order_index: Number(formData.order_index) || 0,
      };
      await onSave(payload);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save testimonial");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-400">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Name *</label>
          <input
            type="text"
            required
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            placeholder="John Doe"
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Role *</label>
          <input
            type="text"
            required
            value={formData.role}
            onChange={(e) => setFormData({ ...formData, role: e.target.value })}
            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            placeholder="Senior Developer"
          />
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Company (optional)</label>
        <input
          type="text"
          value={formData.company ?? ""}
          onChange={(e) => setFormData({ ...formData, company: e.target.value })}
          className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
          placeholder="Acme Inc."
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Testimonial content *</label>
        <textarea
          required
          rows={4}
          value={formData.content}
          onChange={(e) => setFormData({ ...formData, content: e.target.value })}
          className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm resize-none"
          placeholder="&quot;Working with you was great...&quot;"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Avatar URL (optional)</label>
          <input
            type="url"
            value={formData.avatar_url ?? ""}
            onChange={(e) => setFormData({ ...formData, avatar_url: e.target.value })}
            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            placeholder="https://..."
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Rating (1–5, optional)</label>
          <select
            value={formData.rating ?? ""}
            onChange={(e) =>
              setFormData({
                ...formData,
                rating: e.target.value ? Number(e.target.value) : undefined,
              })
            }
            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
          >
            <option value="">No rating</option>
            {[1, 2, 3, 4, 5].map((n) => (
              <option key={n} value={n}>
                {n} star{n > 1 ? "s" : ""}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex flex-wrap gap-4 items-center">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={formData.featured ?? false}
            onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
            className="rounded border-input"
          />
          <span className="text-sm">Featured</span>
        </label>
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={formData.approved ?? false}
            onChange={(e) => setFormData({ ...formData, approved: e.target.checked })}
            className="rounded border-input"
          />
          <span className="text-sm">Approved (show on site)</span>
        </label>
        <div className="space-y-2">
          <label className="text-sm font-medium">Order</label>
          <input
            type="number"
            min={0}
            value={formData.order_index ?? 0}
            onChange={(e) =>
              setFormData({ ...formData, order_index: parseInt(e.target.value, 10) || 0 })
            }
            className="w-20 rounded-md border border-input bg-background px-3 py-2 text-sm"
          />
        </div>
      </div>

      <div className="flex justify-end gap-2 pt-2">
        <Button type="button" variant="outline" onClick={onCancel} disabled={loading}>
          Cancel
        </Button>
        <Button type="submit" disabled={loading}>
          {loading ? "Saving..." : "Save"}
        </Button>
      </div>
    </form>
  );
}
