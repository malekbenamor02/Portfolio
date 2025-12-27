
export interface Skill {
  name: string;
  level: number; // 1-100
  icon?: string;
}

export interface SkillCategory {
  title: string;
  icon: string;
  skills: Skill[];
}

export const skillsData: SkillCategory[] = [
  {
    title: "Programming Languages",
    icon: "💻",
    skills: [
      { name: "JavaScript", level: 90 },
      { name: "TypeScript", level: 85 },
      { name: "Java", level: 75 },
      { name: "Dart", level: 70 }
    ]
  },
  {
    title: "Frontend Development",
    icon: "🎨",
    skills: [
      { name: "HTML", level: 90 },
      { name: "CSS", level: 88 },
      { name: "React.js", level: 90 },
      { name: "Next.js", level: 85 },
      { name: "Angular", level: 75 },
      { name: "Tailwind CSS", level: 90 }
    ]
  },
  {
    title: "Backend & Databases",
    icon: "⚙️",
    skills: [
      { name: "Node.js", level: 88 },
      { name: "Express.js", level: 85 },
      { name: "PostgreSQL", level: 85 },
      { name: "Supabase", level: 90 },
      { name: "SQLite", level: 80 }
    ]
  },
  {
    title: "Tools & Platforms",
    icon: "🛠️",
    skills: [
      { name: "Git & GitHub", level: 90 },
      { name: "Vercel", level: 88 },
      { name: "Cloudflare", level: 85 },
      { name: "Figma", level: 75 },
      { name: "Postman", level: 85 }
    ]
  }
];