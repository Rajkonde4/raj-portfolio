import type { SkillGroup } from "@/types/content";

/**
 * Skills are grouped by area and listed by name only. Do not add proficiency
 * percentages. Tools still being explored for GeoVision AI remain separate.
 */
export const skillGroups: SkillGroup[] = [
  {
    id: "programming",
    label: "Programming",
    items: ["Python", "C", "C++", "JavaScript", "TypeScript"],
  },
  {
    id: "frontend",
    label: "Frontend Engineering",
    items: ["React.js", "Next.js", "Tailwind CSS", "HTML5", "CSS3"],
  },
  {
    id: "backend",
    label: "Backend Engineering",
    items: ["FastAPI", "Flask", "Node.js", "Express.js", "REST APIs"],
  },
  {
    id: "databases",
    label: "Databases",
    items: ["MongoDB", "PostgreSQL", "Supabase"],
  },
  {
    id: "ai-ml",
    label: "AI / Machine Learning",
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
    id: "cloud",
    label: "Cloud and DevOps",
    items: ["AWS", "Docker", "Git", "GitHub"],
  },
  {
    id: "exploring",
    label: "Exploring in AI Projects",
    note: "Currently being learned and integrated for GeoVision AI; not presented as established expertise.",
    items: ["YOLO", "Segment Anything Model (SAM)", "Qwen-VL"],
  },
];
