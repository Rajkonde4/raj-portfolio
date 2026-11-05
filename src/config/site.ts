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
  title: "Raj Konde | Full-Stack Developer Building AI-Powered Web Applications",
  description:
    "Portfolio of Raj Konde, a full-stack developer building AI-powered web applications with modern frontend, backend and machine learning technologies.",
  url: resolveSiteUrl(),
  locale: "en_IN",
  location: "Pune, India",
  roles: [
    "Full-Stack Developer",
    "AI Application Developer",
    "Generative AI Enthusiast",
  ],
  headline:
    "I build AI-powered web applications, combining full-stack engineering with practical artificial intelligence.",
  summary:
    "Final-year B.Tech Computer Science and Engineering student at Pimpri Chinchwad University, Pune, graduating in June 2027. I build end-to-end web applications using modern frontend, backend, database and cloud technologies, and integrate AI/ML capabilities to solve practical problems.",
  focusAreas: [
    "Full-Stack Development",
    "AI-Powered Applications",
    "Generative AI",
    "Computer Vision",
    "Backend Engineering",
    "Intelligent Automation",
  ],
  about: {
    paragraphs: [
      "I am a final-year B.Tech Computer Science and Engineering student at Pimpri Chinchwad University, Pune, graduating in June 2027. I focus on full-stack development and building AI-powered web applications, combining frontend engineering, backend systems, databases and applied machine learning.",
      "I enjoy taking ideas from interface to implementation: building responsive applications, designing APIs, integrating databases and connecting intelligent capabilities to useful workflows. My primary project, GeoVision AI, is a multimodal satellite-image analysis system that brings together a web application, computer vision and vision-language reasoning. I have also worked on TrustChain AI, an OCR-based document verification platform, and AquaMind, an AI-driven approach to sustainable data-center cooling.",
      "My software engineering experience includes EventSphere, an event management platform, and a Web Development Internship at Shizen Wrap Pvt. Ltd. Across these projects, I have worked with technologies including React, Next.js, Python, FastAPI, Flask, Node.js and databases. I have also taken documentation, technical and organizing leadership responsibilities across university initiatives.",
    ],
    direction:
      "I am interested in full-stack development roles focused on building AI-powered products, as well as opportunities to work on practical Generative AI and intelligent application systems.",
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
