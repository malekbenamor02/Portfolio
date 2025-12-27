
export interface Achievement {
  id: string;
  title: string;
  organization: string;
  description: string;
  impact: string[];
  icon: string;
}

export const achievementsData: Achievement[] = [
  {
    id: "production-platform",
    title: "Production-Ready Full Stack Platform",
    organization: "Academic & Personal Projects",
    description: "Successfully designed, built, and deployed a full-stack platform used in real scenarios, applying real business logic and production practices.",
    impact: [
      "Delivered end-to-end full stack solution",
      "Managed complete development lifecycle",
      "Applied real-world workflows and security"
    ],
    icon: "🏆"
  }
];

// Education data
export interface Education {
  id: string;
  institution: string;
  degree: string;
  duration: string;
  location: string;
  gpa?: string;
  logo?: string;
}

export const educationData: Education[] = [
  {
    id: "essths",
    institution: "ESSTHS",
    degree: "Computer Science / Software Development",
    duration: "2023 - Present",
    location: "Sousse, Tunisia",
  }
];