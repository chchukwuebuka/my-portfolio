import { portfolioData } from "./data/portfolio";

/**
 * Legacy compatibility config synchronized with src/data/portfolio.ts.
 * Edit src/data/portfolio.ts as the primary single source of truth.
 */
export const config = {
  developer: {
    name: portfolioData.profile.firstName,
    fullName: portfolioData.profile.fullName,
    title: portfolioData.profile.role,
    description: portfolioData.hero.description,
  },
  social: {
    github: "chchukwuebuka",
    email: portfolioData.contact.email,
    location: portfolioData.profile.location,
  },
  about: {
    title: "About",
    description: portfolioData.about.paragraphs.join(" "),
  },
  experiences: portfolioData.experiences.map((exp) => ({
    position: exp.role,
    company: exp.company,
    period: exp.period,
    location: exp.location,
    description: exp.summary,
    responsibilities: exp.contributions,
    technologies: exp.technologies,
  })),
  projects: portfolioData.projects.map((project, idx) => ({
    id: idx + 1,
    slug: project.slug,
    title: project.title,
    category: project.category,
    technologies: project.technologies.join(", "),
    image: project.image ?? "",
    link: project.links[0]?.url ?? "",
    description: project.summary,
  })),
  contact: {
    email: portfolioData.contact.email,
    github: portfolioData.contact.github,
    linkedin: portfolioData.contact.linkedin,
    twitter: portfolioData.contact.twitter,
    instagram: portfolioData.contact.instagram,
  },
};
