import { SITE_CONFIG } from "@/lib/constants";
import { educationData, achievementsData } from "@/data/achievements";
import { experienceData } from "@/data/experience";

export function JsonLd() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: SITE_CONFIG.name,
    url: SITE_CONFIG.url,
    email: SITE_CONFIG.links.email,
    telephone: SITE_CONFIG.links.phone,
    jobTitle: "Junior Full Stack Developer",
    description: SITE_CONFIG.description,
    sameAs: [
      SITE_CONFIG.links.github,
      SITE_CONFIG.links.linkedin,
    ],
    alumniOf: educationData.map(edu => ({
      "@type": "EducationalOrganization",
      name: edu.institution,
      address: {
        "@type": "PostalAddress",
        addressLocality: edu.location.split(", ")[0],
        addressCountry: edu.location.split(", ")[1] || edu.location,
      },
    })),
    worksFor: experienceData.map(exp => ({
      "@type": "Organization",
      name: exp.company,
      address: {
        "@type": "PostalAddress",
        addressLocality: exp.location,
      },
    })),
    knowsAbout: [
      "Full Stack Development",
      "React",
      "Next.js",
      "Node.js",
      "Express.js",
      "Supabase",
      "PostgreSQL",
      "TypeScript",
      "JavaScript",
      "Web Development",
    ],
    memberOf: achievementsData.map(achievement => ({
      "@type": "Organization",
      name: achievement.organization,
      description: achievement.description,
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
}