"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useForm as useFormspree } from "@formspree/react";
import { ANIMATION_VARIANTS, SITE_CONFIG } from "@/lib/constants";
import { Mail, Phone, Send, Loader2, CheckCircle, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

// Form validation schema
const contactSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  subject: z.string().min(5, "Subject must be at least 5 characters"),
  message: z.string().min(20, "Message must be at least 20 characters"),
});

type ContactFormData = z.infer<typeof contactSchema>;

export function Contact() {
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle");
  
  // Use Formspree's official React hook
  const [formspreeState, submitToFormspree] = useFormspree("xgoeabjo");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
  });

  const onSubmit = async (data: ContactFormData) => {
    try {
      // Submit directly using Formspree's hook
      await submitToFormspree({
        name: data.name,
        email: data.email,
        subject: data.subject,
        message: data.message,
      });
    } catch (error: any) {
      // Silently handle fetch errors - they're often network/CORS related
      if (error?.message?.includes('fetch') || error?.message?.includes('Failed')) {
        // Formspree might have network issues, but form can still work
        console.warn('Formspree network issue:', error);
      } else {
        console.error('Form submission error:', error);
      }
      setSubmitStatus("error");
    }
  };

  // Update status based on Formspree state
  useEffect(() => {
    if (formspreeState?.succeeded) {
      setSubmitStatus("success");
      reset();
      setTimeout(() => setSubmitStatus("idle"), 5000);
    } else if (formspreeState?.errors && Object.keys(formspreeState.errors).length > 0) {
      setSubmitStatus("error");
    }
  }, [formspreeState?.succeeded, formspreeState?.errors, reset]);
  
  // Handle Formspree errors silently
  useEffect(() => {
    if (formspreeState?.errors) {
      const errorKeys = Object.keys(formspreeState.errors);
      if (errorKeys.length > 0) {
        // Log error but don't show it to user unless it's a submission error
        console.warn("Formspree errors:", formspreeState.errors);
      }
    }
  }, [formspreeState?.errors]);
  return (
    <section className="py-20 px-4">
      <div className="container mx-auto max-w-5xl">
        {/* Section Header */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={ANIMATION_VARIANTS.fadeUp}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-display font-bold mb-4">
            Contact <span className="gradient-text">Me</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Have a project in mind or want to collaborate? Feel free to reach out!
            I&apos;m always open to discussing new opportunities.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact Info */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={ANIMATION_VARIANTS.fadeUp}
            transition={{ delay: 0.2 }}
            className="space-y-8"
          >
            <div>
              <h3 className="text-2xl font-semibold mb-6">Let&apos;s Connect</h3>
              <p className="text-muted-foreground mb-8">
                I&apos;m a Research Analyst and
                actively seeking opportunities in Full-Stack Development, Software Testing
                and Emerging Technologies.
              </p>
            </div>
            {/* Contact Cards */}
            <div className="space-y-4">
              <motion.div
                whileHover={{ scale: 1.02 }}
                className="flex items-center gap-4 p-4 rounded-lg border bg-card"
              >
                <div className="p-3 rounded-full bg-primary/10 text-primary">
                  <Mail className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-medium">Email</p>
                  <a
                    href={`mailto:${SITE_CONFIG.links.email}`}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    {SITE_CONFIG.links.email}
                  </a>
                </div>
              </motion.div>

              {/* <motion.div
                whileHover={{ scale: 1.02 }}
                className="flex items-center gap-4 p-4 rounded-lg border bg-card"
              >
                <div className="p-3 rounded-full bg-primary/10 text-primary">
                  <Phone className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-medium">Phone</p>
                  <a
                    href={`tel:${SITE_CONFIG.links.phone}`}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    {SITE_CONFIG.links.phone}
                  </a>
                </div>
              </motion.div> */}
            </div>

            {/* Availability Status */}
            <div className="p-6 rounded-xl bg-primary/5 border border-primary/20">
              <div className="flex items-center gap-2 mb-2">
                <div className="h-3 w-3 bg-green-500 rounded-full animate-pulse" />
                <span className="font-medium">Available for opportunities</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Open to Full-time roles and Contracts 
              </p>
            </div>
          </motion.div>
          {/* Contact Form */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={ANIMATION_VARIANTS.fadeUp}
            transition={{ delay: 0.3 }}
          >
            <form 
              onSubmit={handleSubmit(onSubmit)} 
              className="space-y-6"
            >
              {/* Name Field */}
              <div>
                <label htmlFor="name" className="block text-sm font-medium mb-2">
                  Name
                </label>
                <input
                  {...register("name")}
                  type="text"
                  id="name"
                  className="w-full px-4 py-2 rounded-lg border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Your name"
                />
                {errors.name && (
                  <p className="mt-1 text-sm text-destructive">{errors.name.message}</p>
                )}
              </div>

              {/* Email Field */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium mb-2">
                  Email
                </label>
                <input
                  {...register("email")}
                  type="email"
                  id="email"
                  className="w-full px-4 py-2 rounded-lg border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="your.email@example.com"
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-destructive">{errors.email.message}</p>
                )}
              </div>
              {/* Subject Field */}
              <div>
                <label htmlFor="subject" className="block text-sm font-medium mb-2">
                  Subject
                </label>
                <input
                  {...register("subject")}
                  type="text"
                  id="subject"
                  className="w-full px-4 py-2 rounded-lg border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="What's this about?"
                />
                {errors.subject && (
                  <p className="mt-1 text-sm text-destructive">{errors.subject.message}</p>
                )}
              </div>

              {/* Message Field */}
              <div>
                <label htmlFor="message" className="block text-sm font-medium mb-2">
                  Message
                </label>
                <textarea
                  {...register("message")}
                  id="message"
                  rows={5}
                  className="w-full px-4 py-2 rounded-lg border bg-background focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                  placeholder="Tell me about your project or idea..."
                />
                {errors.message && (
                  <p className="mt-1 text-sm text-destructive">{errors.message.message}</p>
                )}
              </div>

              {/* Honeypot field - hidden from users but visible to bots */}
              <input
                type="text"
                name="_gotcha"
                style={{ display: 'none' }}
                tabIndex={-1}
                autoComplete="off"
              />

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={formspreeState.submitting}
                className="w-full"
                size="lg"
              >
                {formspreeState.submitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Send className="mr-2 h-4 w-4" />
                    Send Message
                  </>
                )}
              </Button>
              {/* Status Messages */}
              {submitStatus === "success" && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center gap-2 p-4 rounded-lg bg-green-500/10 text-green-600"
                >
                  <CheckCircle className="h-5 w-5" />
                  <p>Message sent successfully! I&apos;ll get back to you soon.</p>
                </motion.div>
              )}

              {submitStatus === "error" && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center gap-2 p-4 rounded-lg bg-destructive/10 text-destructive"
                >
                  <AlertCircle className="h-5 w-5" />
                  <p>Something went wrong. Please try again later.</p>
                </motion.div>
              )}
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
}