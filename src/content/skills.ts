import type { SkillGroup } from "@/types/content";

/**
 * Skills are grouped by area and listed by name only. Do not add proficiency
 * percentages. Groups with no items are hidden.
 *
 * Source: Raj's skills notes and resume. The "exploring" group is kept apart
 * on purpose: those tools are being learned for GeoVision AI and are not
 * presented as confident skills.
 */
export const skillGroups: SkillGroup[] = [
  {
    id: "programming",
    label: "Programming",
    items: ["Python", "C", "C++", "JavaScript", "TypeScript"],
  },
  {
    id: "ai-ml",
    label: "AI / ML",
    items: ["Scikit-learn", "XGBoost", "NLP", "Text preprocessing"],
  },
  {
    id: "computer-vision",
    label: "Computer Vision",
    items: ["OCR", "OpenCV", "Pillow"],
  },
  {
    id: "data",
    label: "Data Analysis",
    items: ["Pandas", "Matplotlib", "Data cleaning", "Data visualization"],
  },
  {
    id: "frontend",
    label: "Frontend",
    items: ["React.js", "Next.js", "Tailwind CSS", "HTML5", "CSS3"],
  },
  {
    id: "backend",
    label: "Backend",
    items: ["FastAPI", "Flask", "Node.js", "Express.js", "REST APIs"],
  },
  {
    id: "databases",
    label: "Databases",
    items: ["MongoDB", "PostgreSQL", "Supabase"],
  },
  {
    id: "cloud",
    label: "Cloud and DevOps",
    items: ["AWS", "Docker", "Git", "GitHub"],
  },
  {
    id: "exploring",
    label: "Exploring",
    note: "Being learned and integrated for GeoVision AI. Not listed as confident skills yet.",
    items: ["YOLO", "Segment Anything Model (SAM)", "Qwen-VL"],
  },
];
