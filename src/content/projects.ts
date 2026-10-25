import type { Project } from "@/types/content";

/**
 * All portfolio projects. Add a project by appending an object here; the
 * home page list, the /projects/[slug] case-study page and the sitemap all
 * update automatically. See docs/CONTENT_GUIDE.md.
 *
 * Only facts you have confirmed belong here. Projects with
 * `visibility: "draft"` are hidden everywhere until you publish them.
 *
 * Source: Raj's project notes and resume (Aug and Oct 2026 versions).
 * `contribution` is intentionally left out wherever it has not been checked
 * against the repository.
 */
export const projects: Project[] = [
  {
    slug: "geovision-ai",
    title: "GeoVision AI",
    tagline:
      "An evidence-grounded multimodal AI system for intelligent satellite image analysis.",
    summary:
      "A web-based multimodal AI platform where users upload satellite images or pick a location on a map, ask questions in English, and receive answers supported by object detections and highlighted image regions. Final-year minor project.",
    category: "computer-vision",
    status: "in-progress",
    visibility: "published",
    featured: true,
    tags: [
      "Satellite imagery",
      "Computer Vision",
      "Vision-Language Models",
      "YOLO",
      "SAM",
      "Qwen-VL",
      "FastAPI",
      "Next.js",
    ],
    problem:
      "Satellite image analysis usually needs manual interpretation and specialized expertise. GeoVision AI aims to let non-experts analyze imagery, identify objects and ask questions in natural language, with answers tied to visible evidence.",
    architecture: [
      "Frontend: Next.js, React, TypeScript, Tailwind CSS",
      "Backend: FastAPI (Python)",
      "Data and services: PostgreSQL, Redis, Docker",
      "Object detection: YOLO (live inference in progress)",
      "Segmentation: Segment Anything Model, SAM (live inference in progress)",
      "Visual question answering: Qwen-VL family (live inference in progress)",
      "Image processing: OpenCV, Pillow",
      "Map interface: Leaflet with Esri World Imagery",
    ],
    // TODO(Raj): add `contribution` after checking the repository and
    // project records. It is left out until then on purpose.
    features: {
      implemented: [
        "Frontend interface and FastAPI backend",
        "Map interface and satellite image upload",
        "Analysis interface",
        "History and dashboard components",
      ],
      inProgress: [
        "Frontend and backend integration",
        "Live model inference (detection, segmentation, question answering)",
        "Replacing sample data still used by some interface components",
      ],
      planned: [
        "Satellite imagery comparison across different dates",
        "Temporal change detection",
        "Evidence storage for detections, segmentation masks and change regions",
        "Verification of AI-generated answers against visual evidence",
      ],
    },
    pipeline: [
      {
        id: "input",
        label: "Image and location input",
        technology: "Upload, Leaflet, Esri World Imagery",
        description:
          "Interface for uploading satellite imagery or choosing an area on the map.",
        status: "implemented",
      },
      {
        id: "detection",
        label: "Object detection",
        technology: "YOLO",
        description: "Find and label objects in the scene.",
        status: "in-progress",
      },
      {
        id: "segmentation",
        label: "Segmentation",
        technology: "Segment Anything Model",
        description: "Outline regions so an answer can point at them.",
        status: "in-progress",
      },
      {
        id: "question-answering",
        label: "Question answering",
        technology: "Qwen-VL",
        description: "Answer natural-language questions about the image.",
        status: "in-progress",
      },
      {
        id: "evidence-grounded-answer",
        label: "Evidence-grounded answer",
        description:
          "Show each answer together with the detections and highlighted regions that support it.",
        status: "in-progress",
      },
      {
        id: "verification",
        label: "Answer verification",
        description:
          "Check AI-generated answers against stored visual evidence.",
        status: "planned",
      },
    ],
    limitations: [
      "Some interface components still use sample data.",
      "Accuracy evaluation and complete end-to-end model validation have not been done yet.",
    ],
    // TODO(Raj): add `links.repository` (and `links.demo` if hosted).
    links: {},
  },
  {
    slug: "trustchain-ai",
    title: "TrustChain AI",
    tagline: "Intelligent document verification and fraud-risk assessment.",
    summary:
      "An AI-powered document verification platform that automates document analysis, OCR-based text extraction, fraud-risk assessment, QR-based verification and PDF report generation for documents such as PAN cards, Aadhaar cards, passports, invoices and resumes.",
    category: "full-stack",
    status: "in-progress",
    // Published from the resume description. Review and add `contribution`
    // after checking the repository.
    visibility: "published",
    featured: false,
    tags: ["FastAPI", "React.js", "MongoDB", "OCR", "JWT"],
    // TODO(Raj): add `contribution` after checking the repository.
    features: {
      implemented: [
        "OCR-based text extraction",
        "Intelligent document classification",
        "Fraud-risk scoring and explainable verification reports",
        "QR-based verification",
        "Dynamic PDF report generation",
        "JWT authentication and secure file uploads",
        "MongoDB integration and a modular backend",
      ],
      planned: [
        "Advanced fraud detection",
        "OCR quality analysis",
        "Anomaly detection",
        "AI reasoning capabilities",
      ],
    },
    links: {},
  },
  {
    slug: "aqua-mind",
    title: "AquaMind",
    tagline: "AI-based sustainable cooling system for data centers.",
    summary:
      "An AI-powered system that helps optimize energy and water consumption in data centers, with an interactive dashboard that analyzes cooling data and recommends alternatives to reduce freshwater use.",
    category: "ai-ml",
    status: "completed",
    visibility: "published",
    featured: false,
    tags: ["Artificial Intelligence", "Data Analytics", "Sustainability"],
    // The resume quotes estimated efficiency figures. They are left out until
    // you can explain how they were measured. TODO(Raj): add or confirm.
    // TODO(Raj): add `contribution` and `links.repository`.
    features: {
      implemented: [
        "Interactive dashboard for cooling data analysis",
        "Predictive analytics modules for cooling optimization",
        "Recommendations for lower freshwater usage",
      ],
      planned: [],
    },
    links: {},
  },
  {
    slug: "regional-slang-recognition",
    title: "Regional Slang Recognition and Spell Checker",
    tagline:
      "A Flask web app that detects regional slang and suggests corrections.",
    summary:
      "A full-stack web application built with Flask and Python that uses NLP libraries to detect, interpret and correct regional slang words, improving text standardization and clarity.",
    category: "nlp",
    status: "completed",
    visibility: "published",
    featured: false,
    tags: ["Python", "Flask", "NLP"],
    // TODO(Raj): confirm supported languages and any evaluation results
    // before adding claims about them. Add `contribution` and `links`.
    features: {
      implemented: [
        "Text preprocessing pipeline with tokenization, language modeling and pattern recognition",
        "Slang detection with spell-check suggestions",
        "Responsive web interface",
      ],
      planned: [],
    },
    links: {},
  },
];
