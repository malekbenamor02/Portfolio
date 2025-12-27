
export interface Experience {
  id: string;
  company: string;
  role: string;
  duration: string;
  location: string;
  description: string;
  achievements: string[];
  technologies: string[];
  logo?: string;
  type?: "internship" | "part-time" | "full-time";
}

export const experienceData: Experience[] = [
  {
    id: "andiamo-events",
    company: "Andiamo Events",
    role: "Junior Full Stack Developer",
    duration: "2024 - Present",
    location: "Sousse, Tunisia",
    description: "Designed and developed a complete nightlife events platform including ticketing, ambassador management, Cash On Delivery & online payments, admin dashboards, and real-time order tracking.",
    achievements: [
      "Built a full order lifecycle with multiple statuses",
      "Implemented ambassador assignment using Round Robin logic",
      "Developed secure authentication and role-based access control",
      "Deployed production-ready platform using Vercel & Cloudflare"
    ],
    technologies: ["React.js", "Next.js", "TypeScript", "Node.js", "Express.js", "Supabase", "PostgreSQL", "Tailwind CSS", "Vercel", "Cloudflare"],
    type: "full-time"
  },
];