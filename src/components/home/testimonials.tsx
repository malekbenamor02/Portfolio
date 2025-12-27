"use client";

import { motion } from "framer-motion";
import { Quote } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const testimonials = [
  {
    id: 1,
    quote: "Manan is an invaluable and crucial member of our team. Her technical expertise, problem-solving abilities, and collaborative spirit have made a significant impact on our projects. She consistently goes above and beyond, making her an exceptional colleague and friend.",
    author: "Achyut Katiyar",
    role: "5x Hackathon Winner",
    company: "",
    avatar: "/images/testimonials/achyut.jpg"
  },
  {
    id: 2,
    quote: "Manan demonstrates exceptional proficiency in DevOps environments. Her deep understanding of CI/CD pipelines, cloud infrastructure, and automation tools has significantly improved our deployment processes. She's a true asset to any technical team.",
    author: "Anand Pinnamaneni",
    role: "Salesforce Developer",
    company: "",
    avatar: "/images/testimonials/anand.jpg"
  }
];

export function Testimonials() {
  return (
    <section className="py-20 bg-muted/50">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl font-bold mb-4">What People Say</h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Recommendations from colleagues and mentors I&apos;ve worked with
          </p>
        </motion.div>

        <div className="grid gap-8 md:grid-cols-2 max-w-4xl mx-auto">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className="h-full relative">
                <CardContent className="pt-8 pb-6">
                  <Quote className="w-8 h-8 text-primary/20 absolute top-4 left-4" />
                  <p className="text-muted-foreground mb-6 italic pl-8">
                    &ldquo;{testimonial.quote}&rdquo;
                  </p>
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarImage src={testimonial.avatar} alt={testimonial.author} />
                      <AvatarFallback>
                        {testimonial.author.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-semibold">{testimonial.author}</p>
                      <p className="text-sm text-muted-foreground">
                        {testimonial.role}{testimonial.company && ` at ${testimonial.company}`}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
