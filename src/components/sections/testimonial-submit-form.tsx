"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageSquarePlus, Send, Loader2, CheckCircle, AlertCircle, Upload, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ANIMATION_VARIANTS } from "@/lib/constants";

const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];

export function TestimonialSubmitForm() {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState<"idle" | "uploading" | "done" | "error">("idle");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [formData, setFormData] = useState({
    name: "",
    role: "",
    company: "",
    content: "",
    rating: "5",
    avatarFile: null as File | null,
    avatarPreview: null as string | null,
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) {
      setFormData((p) => ({ ...p, avatarFile: null, avatarPreview: null }));
      setUploadProgress("idle");
      return;
    }
    if (!ALLOWED_TYPES.includes(file.type)) {
      setErrorMessage("Please choose a JPEG, PNG, WebP or GIF image.");
      setFormData((p) => ({ ...p, avatarFile: null, avatarPreview: null }));
      setUploadProgress("idle");
      return;
    }
    if (file.size > MAX_FILE_SIZE) {
      setErrorMessage("Image must be 2MB or smaller.");
      setFormData((p) => ({ ...p, avatarFile: null, avatarPreview: null }));
      setUploadProgress("idle");
      return;
    }
    setErrorMessage(null);
    setFormData((p) => ({
      ...p,
      avatarFile: file,
      avatarPreview: URL.createObjectURL(file),
    }));
    setUploadProgress("idle");
  };

  const clearAvatar = () => {
    if (formData.avatarPreview) URL.revokeObjectURL(formData.avatarPreview);
    setFormData((p) => ({ ...p, avatarFile: null, avatarPreview: null }));
    setUploadProgress("idle");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setStatus("loading");

    if (!formData.avatarFile) {
      setErrorMessage("Please upload your photo.");
      setStatus("error");
      return;
    }

    try {
      setUploadProgress("uploading");
      const form = new FormData();
      form.append("file", formData.avatarFile);
      const uploadRes = await fetch("/api/public/upload/testimonial", {
        method: "POST",
        body: form,
      });
      const uploadData = await uploadRes.json();

      if (!uploadRes.ok) {
        setErrorMessage(uploadData?.error || "Photo upload failed. Please try again.");
        setUploadProgress("error");
        setStatus("error");
        return;
      }
      setUploadProgress("done");

      const payload = {
        name: formData.name.trim(),
        role: formData.role.trim(),
        company: formData.company.trim(),
        content: formData.content.trim(),
        rating: Number(formData.rating),
        avatar_url: uploadData.url as string,
      };

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
      clearAvatar();
      setFormData({
        name: "",
        role: "",
        company: "",
        content: "",
        rating: "5",
        avatarFile: null,
        avatarPreview: null,
      });
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch {
      setErrorMessage("Network error. Please try again.");
      setStatus("error");
      setUploadProgress("error");
    } finally {
      setStatus((s) => (s === "loading" ? "idle" : s));
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
          Worked with me? Share your experience. All fields are required. Your submission will be reviewed before it appears here.
        </p>

        <AnimatePresence mode="wait">
          {status === "success" && (
            <motion.div
              key="success"
              initial={{ opacity: 0, y: 10, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.98 }}
              transition={{ type: "spring", stiffness: 400, damping: 30 }}
              className="mb-6 overflow-hidden"
            >
              <div className="rounded-xl border border-green-500/30 bg-green-500/5 p-5 shadow-sm">
                <div className="flex items-start gap-4">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 500, damping: 25, delay: 0.1 }}
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-green-500/20"
                  >
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  </motion.div>
                  <div className="min-w-0 flex-1 pt-0.5">
                    <motion.p
                      initial={{ opacity: 0, x: 8 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.2, duration: 0.3 }}
                      className="font-medium text-green-700 dark:text-green-400"
                    >
                      Thank you!
                    </motion.p>
                    <motion.p
                      initial={{ opacity: 0, x: 8 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.3, duration: 0.3 }}
                      className="mt-1 text-sm text-green-600/90 dark:text-green-400/90"
                    >
                      Your testimonial has been submitted and will appear here once it’s approved.
                    </motion.p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {status === "error" && errorMessage && (
            <motion.div
              key="error"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ type: "spring", stiffness: 400, damping: 30 }}
              className="mb-6 flex items-center gap-2 rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-400"
            >
              <AlertCircle className="h-4 w-4 shrink-0" />
              {errorMessage}
            </motion.div>
          )}
        </AnimatePresence>

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
              />
            </div>
          </div>

          <div>
            <label htmlFor="t-company" className="block text-sm font-medium mb-1">
              Company *
            </label>
            <input
              id="t-company"
              type="text"
              required
              maxLength={200}
              value={formData.company}
              onChange={(e) => setFormData((p) => ({ ...p, company: e.target.value }))}
              className="w-full px-4 py-2 rounded-lg border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
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
                Rating *
              </label>
              <select
                id="t-rating"
                required
                value={formData.rating}
                onChange={(e) => setFormData((p) => ({ ...p, rating: e.target.value }))}
                className="w-full px-4 py-2 rounded-lg border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
              >
                {[1, 2, 3, 4, 5].map((n) => (
                  <option key={n} value={n}>
                    {n} star{n > 1 ? "s" : ""}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Your photo *
              </label>
              <input
                ref={fileInputRef}
                type="file"
                accept={ALLOWED_TYPES.join(",")}
                onChange={handleFileChange}
                className="hidden"
                id="t-avatar-upload"
              />
              {!formData.avatarPreview ? (
                <label
                  htmlFor="t-avatar-upload"
                  className="flex items-center justify-center gap-2 w-full px-4 py-3 rounded-lg border border-dashed border-input bg-background cursor-pointer hover:bg-muted/50 transition-colors"
                >
                  <Upload className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">Choose image (max 2MB)</span>
                </label>
              ) : (
                <div className="flex items-center gap-3 p-2 rounded-lg border bg-background">
                  <img
                    src={formData.avatarPreview}
                    alt="Preview"
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <span className="text-sm truncate flex-1">{formData.avatarFile?.name}</span>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 shrink-0"
                    onClick={clearAvatar}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </div>
          </div>

          <Button
            type="submit"
            disabled={status === "loading" || !formData.avatarFile || uploadProgress === "uploading"}
            className="w-full sm:w-auto"
          >
            {status === "loading" || uploadProgress === "uploading" ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                {uploadProgress === "uploading" ? "Uploading photo..." : "Submitting..."}
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
