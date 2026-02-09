"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Quote, Star } from "lucide-react";
import Image from "next/image";
import { TestimonialSubmitForm } from "./testimonial-submit-form";

type Testimonial = {
  id: string;
  name: string;
  role: string;
  company?: string | null;
  content: string;
  avatar_url?: string | null;
  rating?: number | null;
};

export function Testimonials() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/public/testimonials")
      .then((res) => res.json())
      .then((data) => {
        setTestimonials(data.testimonials || []);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <section className="py-20 px-4 bg-muted/30">
        <div className="container mx-auto max-w-6xl text-center">
          <p className="text-muted-foreground">Loading testimonials...</p>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 px-4 bg-muted/30">
      <div className="container mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-display font-bold mb-4">
            What People <span className="gradient-text">Say</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Testimonials from clients and colleagues
          </p>
        </motion.div>

        {testimonials.length > 0 && (
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          variants={{
            hidden: {},
            visible: {
              transition: { staggerChildren: 0.1, delayChildren: 0.05 },
            },
          }}
        >
          {testimonials.map((testimonial) => (
            <motion.div
              key={testimonial.id}
              variants={{
                hidden: { opacity: 0, y: 24, scale: 0.96 },
                visible: { opacity: 1, y: 0, scale: 1 },
              }}
              transition={{ type: "spring", stiffness: 260, damping: 20 }}
              whileHover={{ y: -4, scale: 1.02 }}
              className="h-full"
            >
              <Card className="h-full transition-shadow duration-300 hover:shadow-xl hover:shadow-primary/5">
                <CardContent className="p-6">
                  <Quote className="h-8 w-8 text-primary/50 mb-4" />
                  <p className="text-muted-foreground mb-4 italic">
                    &quot;{testimonial.content}&quot;
                  </p>
                  {testimonial.rating && (
                    <div className="flex gap-1 mb-4">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 ${
                            i < (testimonial.rating || 0)
                              ? "fill-yellow-400 text-yellow-400"
                              : "text-muted-foreground"
                          }`}
                        />
                      ))}
                    </div>
                  )}
                  <div className="flex items-center gap-3">
                    {testimonial.avatar_url ? (
                      <Image
                        src={testimonial.avatar_url}
                        alt={testimonial.name}
                        width={48}
                        height={48}
                        className="rounded-full"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                        <span className="text-primary font-semibold">
                          {testimonial.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                    )}
                    <div>
                      <p className="font-semibold">{testimonial.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {testimonial.role}
                        {testimonial.company && ` at ${testimonial.company}`}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
        )}

        <TestimonialSubmitForm />
      </div>
    </section>
  );
}
