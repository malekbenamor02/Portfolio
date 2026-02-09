"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { MessageSquarePlus, Send, Loader2, CheckCircle, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ANIMATION_VARIANTS } from "@/lib/constants";

export function TestimonialSubmitForm() {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    role: "",
    company: "",
    content: "",
    avatar_url: "",
    rating: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    setErrorMessage(null);

    const payload = {
      name: formData.name.trim(),
      role: formData.role.trim(),
      company: formData.company.trim() || undefined,
      content: formData.content.trim(),
      avatar_url: formData.avatar_url.trim() || undefined,
      rating: formData.rating ? Number(formData.rating) : undefined,
    };

    try {
      const res = await fetch("/api/public/testimonials", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();

      if (!res.ok) {
        setErrorMessage(data?.error || "Something went wrong. Please try again.");
        setStatus("error");
        return;
      }

      setStatus("success");
      setFormData({ name: "", role: "", company: "", content: "", avatar_url: "", rating: "" });
    } catch {
      setErrorMessage("Network error. Please try again.");
      setStatus("error");
    }
  };

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      variants={ANIMATION_VARIANTS.fadeUp}
      className="mt-16 max-w-2xl mx-auto"
    >
      <div className="rounded-xl border bg-card p-6 md:p-8">
        <div className="flex items-center gap-2 mb-6">
          <MessageSquarePlus className="h-5 w-5 text-primary" />
          <h3 className="text-xl font-semibold">Leave a testimonial</h3>
        </div>
        <p className="text-sm text-muted-foreground mb-6">
          Worked with me? Share your experience. Your submission will be reviewed before it appears here.
        </p>

        {status === "success" && (
          <div className="mb-6 flex items-center gap-2 rounded-lg border border-green-500/30 bg-green-500/10 p-3 text-sm text-green-400">
            <CheckCircle className="h-4 w-4 shrink-0" />
            Thank you! Your testimonial has been submitted for review.
          </div>
        )}

        {status === "error" && errorMessage && (
          <div className="mb-6 flex items-center gap-2 rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-400">
            <AlertCircle className="h-4 w-4 shrink-0" />
            {errorMessage}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="t-name" className="block text-sm font-medium mb-1">
                Your name *
              </label>
              <input
                id="t-name"
                type="text"
                required
                maxLength={200}
                value={formData.name}
                onChange={(e) => setFormData((p) => ({ ...p, name: e.target.value }))}
                className="w-full px-4 py-2 rounded-lg border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="John Doe"
              />
            </div>
            <div>
              <label htmlFor="t-role" className="block text-sm font-medium mb-1">
                Your role *
              </label>
              <input
                id="t-role"
                type="text"
                required
                maxLength={200}
                value={formData.role}
                onChange={(e) => setFormData((p) => ({ ...p, role: e.target.value }))}
                className="w-full px-4 py-2 rounded-lg border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="Senior Developer"
              />
            </div>
          </div>

          <div>
            <label htmlFor="t-company" className="block text-sm font-medium mb-1">
              Company (optional)
            </label>
            <input
              id="t-company"
              type="text"
              maxLength={200}
              value={formData.company}
              onChange={(e) => setFormData((p) => ({ ...p, company: e.target.value }))}
              className="w-full px-4 py-2 rounded-lg border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="Acme Inc."
            />
          </div>

          <div>
            <label htmlFor="t-content" className="block text-sm font-medium mb-1">
              Your testimonial *
            </label>
            <textarea
              id="t-content"
              required
              minLength={10}
              maxLength={2000}
              rows={4}
              value={formData.content}
              onChange={(e) => setFormData((p) => ({ ...p, content: e.target.value }))}
              className="w-full px-4 py-2 rounded-lg border bg-background focus:outline-none focus:ring-2 focus:ring-primary resize-none"
              placeholder="Share your experience working together..."
            />
            <p className="text-xs text-muted-foreground mt-1">
              Min 10 characters, max 2000
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="t-rating" className="block text-sm font-medium mb-1">
                Rating (optional)
              </label>
              <select
                id="t-rating"
                value={formData.rating}
                onChange={(e) => setFormData((p) => ({ ...p, rating: e.target.value }))}
                className="w-full px-4 py-2 rounded-lg border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="">No rating</option>
                {[1, 2, 3, 4, 5].map((n) => (
                  <option key={n} value={n}>
                    {n} star{n > 1 ? "s" : ""}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="t-avatar" className="block text-sm font-medium mb-1">
                Avatar URL (optional)
              </label>
              <input
                id="t-avatar"
                type="url"
                maxLength={500}
                value={formData.avatar_url}
                onChange={(e) => setFormData((p) => ({ ...p, avatar_url: e.target.value }))}
                className="w-full px-4 py-2 rounded-lg border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="https://..."
              />
            </div>
          </div>

          <Button
            type="submit"
            disabled={status === "loading"}
            className="w-full sm:w-auto"
          >
            {status === "loading" ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Submitting...
              </>
            ) : (
              <>
                <Send className="h-4 w-4 mr-2" />
                Submit testimonial
              </>
            )}
          </Button>
        </form>
      </div>
    </motion.div>
  );
}
