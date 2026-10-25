import type { Experience } from "@/types/content";

/**
 * Internship, development and leadership roles, newest first.
 *
 * Source: Raj's notes and resumes. Dates that the two resumes disagree on
 * are left open (see TODO comments) instead of guessed.
 */
export const experience: Experience[] = [
  {
    id: "shizen-wrap-web-development-intern",
    role: "Web Development Intern",
    organization: "Shizen Wrap Pvt. Ltd.",
    type: "internship",
    start: "2026-05",
    end: "2026-08",
    summary:
      "Digital Identity and Web Ecosystem Development Project. Associated brands: Blew Hydration and SHOTT'S.",
    highlights: [
      "Contributed to website development and enhancement.",
      "Built responsive web interfaces and worked on user experience.",
      "Implemented frontend components, website integrations, deployment workflows and production environment configuration.",
    ],
  },
  {
    id: "eventsphere-full-stack-developer",
    role: "Full-Stack Developer",
    organization: "EventSphere, Pimpri Chinchwad University",
    type: "development",
    // The resume says "2026 – Present" with no month, so no start is set.
    end: "present",
    summary:
      "Event management platform for the International Mastermind Meet (IM#).",
    highlights: [
      "Designed and built the platform end to end: responsive frontend, backend services, REST API integration, database operations and authentication workflows.",
      "Implemented reusable UI components, dynamic event modules, participant workflows and administrative functionality.",
      "Handled deployment, hosting, domain integration and production setup for the live platform.",
    ],
  },
  {
    id: "im3-documentation-lead",
    role: "Documentation Team Lead",
    organization: "International Mastermind Meet (IM3)",
    type: "leadership",
    start: "2026-05",
    end: "2026-07",
    highlights: [
      "Oversaw documentation, operational records and event reporting for an international collaborative initiative.",
    ],
  },
  {
    id: "ideathon-documentation-lead",
    role: "Documentation Team Lead",
    organization: "PCU IDEATHON 3.0",
    type: "leadership",
    start: "2026-02",
    end: "2026-03",
    highlights: [
      "Managed event documentation, reporting and milestone tracking for a 24-hour innovation event.",
    ],
  },
  {
    id: "vibenity-technical-core-member",
    role: "Technical Team Core Member",
    organization: "VIBENITY 2025",
    type: "leadership",
    start: "2025-10",
    end: "2025-11",
    highlights: [
      "Supported technical operations and participant management for a university event with 1,500+ participants.",
    ],
  },
  {
    id: "pcu-explore-germany-organizing-lead",
    role: "Event Organizing Lead",
    organization: "PCU Explore Germany 2025",
    type: "leadership",
    highlights: [
      "Coordinated event operations and engagement activities with international academic representatives.",
    ],
  },
  {
    id: "tedxpcu-mentor",
    role: "Mentor",
    organization: "TEDxPCU",
    type: "leadership",
    // TODO(Raj): add dates and what the mentoring involved.
    highlights: [],
  },
  {
    id: "deutschfeast-media-team-lead",
    role: "Media Team Lead",
    organization: "Deutschfeast",
    type: "leadership",
    highlights: [
      "Led media planning and content execution for a university-level event.",
    ],
  },
  {
    id: "aicte-eduskills-data-engineering-intern",
    role: "Data Engineering Virtual Intern",
    organization: "AICTE EduSkills (AWS Academy)",
    type: "internship",
    start: "2024-07",
    end: "2024-09",
    highlights: [
      "Completed a 10-week internship on cloud computing and data engineering.",
      "Gained hands-on exposure to AWS services, cloud infrastructure and data workflows.",
    ],
  },
];
