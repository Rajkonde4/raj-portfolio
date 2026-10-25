import { resolveSiteUrl } from "@/lib/site-url";
import type { SiteConfig } from "@/types/content";

/**
 * Central site configuration. Edit this file to change your name,
 * introduction, social links and resume. See docs/CONTENT_GUIDE.md.
 *
 * The public URL and contact email come from environment variables so that
 * nothing personal has to be committed by accident. Both are optional.
 */
export const siteConfig: SiteConfig = {
  name: "Raj Konde",
  title: "Raj Konde | AI/ML Engineer",
  description:
    "Portfolio of Raj Konde, a final-year B.Tech Computer Science and Engineering student focused on artificial intelligence and machine learning.",
  url: resolveSiteUrl(),
  locale: "en_IN",
  location: "Pune, India",
  roles: ["AI/ML Engineer", "Aspiring Generative AI Engineer"],
  headline:
    "I build AI systems that ground their answers in evidence, starting with satellite imagery.",
  summary:
    "Final-year B.Tech Computer Science and Engineering student at Pimpri Chinchwad University, Pune. I focus on artificial intelligence and machine learning, backed by software engineering fundamentals across Python, web development and cloud.",
  focusAreas: [
    "Generative AI",
    "Computer Vision",
    "NLP",
    "Vision-Language Models",
    "AI Agents",
    "Intelligent Automation",
  ],
  about: {
    paragraphs: [
      "I am a final-year B.Tech Computer Science and Engineering student at Pimpri Chinchwad University, Pune, graduating in June 2027. My focus is artificial intelligence and machine learning, supported by software engineering across Python, web development and cloud.",
      "My main project is GeoVision AI, a multimodal system that answers questions about satellite imagery and ties each answer to evidence in the image. I have also built TrustChain AI, an OCR-based document verification platform, and AquaMind, an AI system for sustainable data-center cooling.",
      "Alongside the AI work I ship web software: a web development internship at Shizen Wrap, and EventSphere, the event platform for the International Mastermind Meet. I also lead documentation and technical teams for university events.",
    ],
    direction:
      "I am looking for AI/ML engineering roles, with a growing interest in Generative AI.",
  },
  // Set NEXT_PUBLIC_CONTACT_EMAIL in .env.local to show an email address.
  email: process.env.NEXT_PUBLIC_CONTACT_EMAIL || undefined,
  social: {
    github: "https://github.com/Rajkonde4",
    linkedin: "https://www.linkedin.com/in/rajkonde/",
  },
  resume: {
    path: "/resume/Raj_Konde_Resume.pdf",
    label: "Resume",
  },
  copyrightYear: 2026,
};
