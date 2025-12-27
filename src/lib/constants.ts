// App constants

export const SITE_CONFIG = {
  name: "Malek Ben Amor",
  description: "Junior Full Stack Developer | Building Real-World Web Platforms",
  url: "https://malekbenamor.dev",
  ogImage: "/images/og-image.png",
  links: {
    email: "contact@malekbenamor.dev",
    github: "https://github.com/malekbenamor02",
    linkedin: "https://www.linkedin.com/in/malekbenamor/",
    phone: "+216 27 169 458"
  }
};

export const NAV_ITEMS = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Experience", href: "/experience" },
  { label: "Projects", href: "/projects" },
  { label: "Contact", href: "/contact" }
];

export const ANIMATION_VARIANTS = {
  fadeUp: {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  },
  fadeDown: {
    hidden: { opacity: 0, y: -20 },
    visible: { opacity: 1, y: 0 }
  },
  fadeIn: {
    hidden: { opacity: 0 },
    visible: { opacity: 1 }
  },
  scaleIn: {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 1 }
  }
};