export interface CandidateProfile {
  name: string;
  age: number;
  location: string;
  relocationTarget: {
    city: string;
    country: string;
    availableFrom: string;
    priority: string;
  };
  headline: string;
  targetRoles: string[];
  languages: { language: string; level: string }[];
  education: { degree: string; institution: string; period: string; details?: string }[];
  certifications: { name: string; status: string; year?: string }[];
  mainStack: {
    languages: string[];
    aiAndAgents: string[];
    cloudAndDevOps: string[];
    databases: string[];
  };
  flagshipProjects: {
    name: string;
    role: string;
    stack: string[];
    description: string;
    metrics: string[];
  }[];
  dailyRoutine: { category: string; description: string }[];
}

export const SANTIAGO_CV_CONTEXT: CandidateProfile = {
  name: "Santiago Castro Salt",
  age: 23,
  location: "Valencia, Spain",
  relocationTarget: {
    city: "Dublin",
    country: "Ireland",
    availableFrom: "September 30, 2026",
    priority: "Priority 1: Dublin On-site/Hybrid/Remote; Priority 2: 100% International Remote"
  },
  headline: "Backend & AI Systems Integration Engineer",
  targetRoles: [
    "AI Integration Engineer",
    "Backend Developer (Python / Go / PHP / TypeScript)",
    "Cloud & MLOps Engineer",
    "Automation & Data Pipeline Engineer"
  ],
  languages: [
    { language: "Spanish", level: "Native" },
    { language: "Valencian / Catalan", level: "Native / Bilingual" },
    { language: "English", level: "B2 Official (MSMK CATE), actively preparing for C1 (Target Q4 2026)" },
    { language: "Galician", level: "Communicative competence" }
  ],
  education: [
    {
      degree: "BSc (Hons) Top-Up in Computer Science",
      institution: "Canterbury Christ Church University (UK) • Madrid Campus at MSMK University",
      period: "September 2026 – June 2027 (Blended / Semipresencial)",
      details: "Top-Up degree focused on distributed systems, AI architectures and software engineering."
    },
    {
      degree: "CFGS Desarrollo de Aplicaciones Web (DAW)",
      institution: "Official Spanish Vocational Degree",
      period: "2024 – 2026",
      details: "Final GPA: 7.00. Specialization in Full-Stack web architecture, databases, and microservices."
    }
  ],
  certifications: [
    { name: "AWS Certified Cloud Practitioner", status: "Certified", year: "2025" },
    { name: "AWS Certified AI Practitioner (AIF-C01)", status: "In progress (Target Q3-Q4 2026)" },
    { name: "GitHub Certified Copilot (GH-600)", status: "In progress (Target Q4 2026 - Q1 2027)" }
  ],
  mainStack: {
    languages: ["Python 3 (FastAPI, PyTorch, Pandas, MONAI)", "Go", "PHP 8 (Symfony 7)", "TypeScript (Node.js, Angular)"],
    aiAndAgents: ["Model Context Protocol (MCP)", "ReAct Agent Loops", "Function Calling", "Embeddings", "Vector DBs (Qdrant, pgvector, Milvus)", "LLM Workflows"],
    cloudAndDevOps: ["AWS (EC2, S3, RDS, Lambda, Bedrock)", "Docker & Docker Compose", "CI/CD Pipelines", "Nginx"],
    databases: ["PostgreSQL", "MySQL 8 (normalized relational schemas)", "pgvector", "Qdrant", "Redis"]
  },
  flagshipProjects: [
    {
      name: "Fertoolity AI Lab (Hospital La Fe)",
      role: "Medical AI & Computer Vision Intern",
      stack: ["Python", "PyTorch", "MONAI", "OpenCV", "FastAPI", "Docker"],
      description: "Medical Deep Learning segmentation pipeline for gynaecological clinical scans deployed at Hospital Universitari i Politècnic La Fe.",
      metrics: [
        "Dice validation score > 0.942",
        "16 ms GPU inference latency per slice",
        "Automated DICOM preprocessing and anomaly mask extraction"
      ]
    },
    {
      name: "FitForge (Full-Stack Fitness SPA)",
      role: "Lead Full-Stack Architect (TFG)",
      stack: ["PHP 8.2 (Symfony 7)", "Angular Standalone", "MySQL 8 (14 tables)", "JWT Auth", "Docker"],
      description: "Decoupled fitness and nutrition platform with custom RBAC security voters, dynamic exercise recommendations, and macro generators.",
      metrics: [
        "33 secure REST API endpoints",
        "Normalized 14-table relational database schema",
        "Multi-container Docker Compose architecture"
      ]
    },
    {
      name: "Legacy Land Mapper",
      role: "Backend & Geospatial Engineer",
      stack: ["Python 3", "Pandas", "Leaflet.js", "GeoJSON", "Spanish Cadastre WFS API"],
      description: "Multithreaded cadastral extraction engine integrating official WFS endpoints with interactive geospatial map boundary visualization.",
      metrics: [
        "20 worker threads for concurrent parcel parsing",
        "> 90% latency reduction in batch queries",
        "Automated GeoJSON polygon rendering"
      ]
    },
    {
      name: "Agentic MCP Ecosystem",
      role: "AI Systems Integration Engineer",
      stack: ["Model Context Protocol (MCP)", "Python", "FastAPI", "Vector DBs", "Function Calling"],
      description: "Custom Model Context Protocol servers connecting Large Language Models to local tools and vector stores with Human-in-the-Loop guardrails.",
      metrics: [
        "Deterministic function calling with strict schema validation",
        "Human-in-the-Loop security gates for privileged commands",
        "Multi-agent autonomous tool execution graphs"
      ]
    },
    {
      name: "HomeLab & Cloud Ecosystem",
      role: "DevOps & Infrastructure Engineer",
      stack: ["Docker Compose v2", "Linux / Proxmox", "Tailscale Zero-Trust", "Ollama / Whisper", "CI/CD GitOps"],
      description: "Enterprise-grade self-hosted cloud server running GitOps CI/CD deployments, Tailscale Zero-Trust mesh network, and GPU-accelerated local AI.",
      metrics: [
        "99.9% uptime local cluster with automated health checks",
        "Zero-Trust encrypted mesh networking without exposed ports",
        "Private local GPU inference for Whisper and LLM workflows"
      ]
    }
  ],
  dailyRoutine: [
    { category: "Physical Discipline", description: "Gym & cardio (08:00-09:00), Boulder climbing (V4-V8), Tennis" },
    { category: "English C1 Mastery", description: "2h daily test prep, grammar and technical oral mock interviews" },
    { category: "Certifications & Architecture", description: "2h daily AWS AI Practitioner + Bedrock + MCP agent tool development" },
    { category: "Career & Tech Prospecting", description: "Targeting tech scale-ups and multinationals in Dublin & EU Remote" }
  ]
};

export const SANTIAGO_MARKDOWN_CV = `
# Santiago Castro Salt — Backend & AI Systems Integration Engineer
- **Location**: Valencia, Spain | **Dublin Availability**: On-site from Sept 30, 2026
- **Education**: BSc (Hons) Computer Science (Canterbury Christ Church University) & CFGS DAW
- **Core Stack**: Python (FastAPI, PyTorch, MONAI), PHP 8 (Symfony 7), Go, TypeScript, AWS, Docker, MCP, Qdrant
- **Languages**: English (B2 Official, C1 Target), Spanish (Native), Catalan/Valencian (Native)
- **Top Projects**:
  1. **Fertoolity (Hospital La Fe)**: Medical AI segmentation (Dice >0.94, 16ms latency)
  2. **FitForge**: Full-Stack SPA with Symfony 7 (33 REST endpoints, JWT) + Angular + Docker
  3. **Legacy Land Mapper**: Geospatial Cadastre WFS engine with 20 worker threads (>90% faster)
`;
