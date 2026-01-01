
export interface Project {
  id: string;
  title: string;
  description: string;
  longDescription: string;
  technologies: string[];
  features: string[];
  image: string;
  demoUrl?: string;
  githubUrl?: string;
  category: "mobile" | "web" | "blockchain" | "ai";
}

export const projects: Project[] = [
  {
    id: "andiamo-events-platform",
    title: "Andiamo Events",
    description: "Specialized in alcohol-free events, Andiamo Events focuses primarily on young people and students seeking festive, safe, and well-supervised atmospheres.",
    longDescription: "Andiamo Events is a complete web platform specialized in alcohol-free events, focusing primarily on young people and students seeking festive, safe, and well-supervised atmospheres. The platform allows users to browse events, purchase tickets, and place Cash On Delivery orders. It includes an ambassador system for order confirmation, admin dashboards, ticket scanning, and real-time updates across the system.",
    technologies: ["React.js", "Next.js", "TypeScript", "Node.js", "Express.js", "Supabase", "PostgreSQL", "Tailwind CSS", "Vercel", "Cloudflare"],
    features: [
      "Event creation and management",
      "Cash On Delivery & online payment system",
      "Ambassador assignment and management",
      "Admin and ambassador dashboards",
      "Ticket scanning and validation",
      "Real-time order status updates",
      "Alcohol-free event focus",
      "Safe and supervised event environments"
    ],
    image: "/images/projects/andiamo.png",
    demoUrl: "https://www.andiamoevents.com",
    category: "web"
  },
];