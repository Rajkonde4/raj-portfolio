import type { Achievement } from "@/types/content";

/**
 * Verified certifications, taken from the Oct 2026 resume.
 * Add only items you can verify; add `url` if you have a credential link.
 */
export const achievements: Achievement[] = [
  {
    id: "google-introduction-to-ai",
    title: "Introduction to AI",
    category: "certification",
    issuer: "Google",
    date: "2026-05",
  },
  {
    id: "aws-academy-cloud-foundations",
    title: "AWS Academy Graduate: AWS Academy Cloud Foundations",
    category: "certification",
    issuer: "AWS Academy",
    date: "2024-08",
  },
  {
    id: "ibm-getting-started-with-ai",
    title: "Getting Started with Artificial Intelligence",
    category: "certification",
    issuer: "IBM",
    date: "2024-09",
  },
  {
    id: "coursera-programming-for-everybody",
    title: "Programming for Everybody (Getting Started with Python)",
    category: "certification",
    issuer: "Coursera",
    date: "2024-01",
  },
];
