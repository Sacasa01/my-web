import { Component, signal, computed, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';

export type Lang = 'en' | 'es';
export type Theme = 'light' | 'dark';

export interface ProjectItem {
  id: string;
  title: string;
  subtitle: string;
  badge: string;
  metricBadge: string;
  period: string;
  image: string;
  accentColor: string;
  glowColor: string;
  summary: string;
  fullDescription: string;
  details: string[];
  techStack: string[];
  link: string;
  linkText: string;
}

export interface SkillItem {
  id: string;
  name: string;
  category: 'core' | 'frameworks' | 'cloud' | 'ai' | 'languages';
  categoryLabel: string;
  subtitle: string;
  badge: string;
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  // Global reactive state
  lang = signal<Lang>('en');
  theme = signal<Theme>('light');
  copiedEmail = signal<boolean>(false);
  selectedProject = signal<ProjectItem | null>(null);
  avatarState = signal<'TYPING' | 'IDLE'>('TYPING');

  get currentLang(): Lang {
    return this.lang();
  }

  // Dynamic theme colors matching Sinopia (#D7340B), Vanilla (#E0DDAE), and Caribbean (#336467)
  bgColor = computed(() => this.theme() === 'light' ? '#F5F3E7' : '#0D1718');
  cardBg = computed(() => this.theme() === 'light' ? '#FFFFFF' : '#152426');
  cardBorder = computed(() => this.theme() === 'light' ? 'rgba(51, 100, 103, 0.15)' : 'rgba(224, 221, 174, 0.14)');
  textColor = computed(() => this.theme() === 'light' ? '#1A3537' : '#E0DDAE');
  mutedColor = computed(() => this.theme() === 'light' ? '#5C7476' : '#8AA2A4');
  tagBg = computed(() => this.theme() === 'light' ? 'rgba(51, 100, 103, 0.07)' : 'rgba(224, 221, 174, 0.07)');
  accentSinopia = computed(() => this.theme() === 'light' ? '#D7340B' : '#E64319');
  accentCaribbean = computed(() => this.theme() === 'light' ? '#336467' : '#4E898D');
  navBg = computed(() => this.theme() === 'light' ? 'rgba(245, 243, 231, 0.88)' : 'rgba(13, 23, 24, 0.88)');

  // Bilingual content structured in exact requested order
  content = {
    en: {
      nav: {
        experience: 'Experience',
        projects: 'Projects',
        skills: 'Skills',
        education: 'Education',
        certifications: 'Certifications',
        contact: 'Contact'
      },
      hero: {
        greeting: "Hi, I'm",
        name: 'Santiago',
        surname: 'Castro Salt',
        title: 'Backend & AI Systems Integration Engineer',
        location: 'Dublin, Ireland',
        summary: 'Specialized in building high-performance backend systems (Python, PHP/Symfony 7, TypeScript, Docker) and integrating autonomous AI architectures, MCP agents, and Human-in-the-Loop inference pipelines.',
        status: 'Available for On-Site in Dublin or International Remote'
      },
      experience: {
        sectionTitle: 'Work Experience',
        sectionSubtitle: 'Production & Clinical Engineering',
        items: [
          {
            role: 'AI & Software Integration Developer',
            company: 'Fertoolity — Hospital Universitari i Politècnic La Fe',
            type: 'Clinical Internship (FCT)',
            period: 'Mar 2026 – Jun 2026',
            location: 'Hospital La Fe, Valencia',
            description: 'Participated in a high-reliability clinical AI engineering workflow focused on assisted medical imaging and diagnostic pipelines.',
            highlights: [
              'Implemented Human-in-the-Loop supervised AI pipelines for medical image segmentation, normalisation, and dataset annotation for model fine-tuning.',
              'Engineered auxiliary preprocessing microservices and FastAPI REST endpoints using Python, OpenCV, PyTorch, and MONAI to deliver real-time model inference.',
              'Collaborated closely with clinical specialists at Hospital La Fe to translate complex diagnostic imaging requirements into production-ready software components.'
            ],
            techStack: ['Python 3', 'FastAPI', 'PyTorch', 'MONAI', 'OpenCV', 'Docker', 'RESTful APIs', 'Medical Imaging']
          }
        ]
      },
      projects: {
        sectionTitle: 'Featured Projects',
        sectionSubtitle: 'System Architecture & Technical Execution',
        sectionDescription: 'Selected flagship systems spanning full-stack architectures, clinical AI diagnostic pipelines, cadastre engines, and enterprise infrastructure. Hover cards to elevate, and click to inspect complete specifications.',
        inspectPrompt: 'Inspect Specs',
        highlightsTitle: 'Key Technical Achievements',
        techStackTitle: 'Technologies & Architecture',
        modalClose: 'Close Details',
        items: [
          {
            id: 'agentic-mcp',
            title: 'Agentic MCP Ecosystem',
            subtitle: 'Model Context Protocol & Autonomous Tool Calling',
            badge: 'Agentic AI · MCP Architecture',
            metricBadge: '★ 5.0 · MCP',
            period: '2026',
            image: '/assets/projects/agentic-mcp.jpg',
            accentColor: '#7C3AED',
            glowColor: 'rgba(124, 58, 237, 0.55)',
            summary: 'Custom Model Context Protocol servers connecting Large Language Models to local tools, vector stores, and APIs with Human-in-the-Loop guardrails.',
            fullDescription: 'Engineered autonomous agent architectures and tool execution servers implementing Anthropic Model Context Protocol (MCP). Enables Large Language Models to securely interact with the local filesystem, vector databases (Qdrant, pgvector), and external services through strict schema validation and deterministic function calling. Implemented robust Human-in-the-Loop approval barriers to prevent destructive actions and ensure enterprise-grade safety in production environments.',
            details: [
              'Built custom Model Context Protocol (MCP) servers enabling LLMs to securely execute deterministic database operations and code validation.',
              'Implemented Human-in-the-Loop approval barriers to prevent unauthorized destructive commands in production agents.',
              'Integrated vector database retrieval (Qdrant / pgvector) for contextual memory augmentation and semantic search.',
              'Designed multi-agent execution graphs using ReAct patterns for self-correcting autonomous pipelines.'
            ],
            techStack: ['Model Context Protocol (MCP)', 'Python', 'FastAPI', 'Function Calling', 'Vector DBs', 'System Integration'],
            link: 'https://github.com/Sacasa01',
            linkText: 'Explore GitHub Profile ↗'
          },
          {
            id: 'fertoolity',
            title: 'Fertoolity',
            subtitle: 'Clinical AI & Medical Imaging Diagnostics',
            badge: 'Hospital La Fe · Clinical FCT',
            metricBadge: '★ 4.9 · MONAI',
            period: 'Mar 2026 – Jun 2026',
            image: '/assets/projects/fertoolity.jpg',
            accentColor: '#0D9488',
            glowColor: 'rgba(13, 148, 136, 0.55)',
            summary: 'Human-in-the-Loop supervised AI workflow for clinical medical image segmentation and real-time inference microservices.',
            fullDescription: 'Engineered at Hospital Universitari i Politècnic La Fe (Valencia) within a clinical medical AI environment. Built supervised Human-in-the-Loop deep learning pipelines for medical imaging segmentation, normalization, and specialist dataset annotation for model fine-tuning. Developed asynchronous FastAPI microservices delivering low-latency real-time inference powered by PyTorch and MONAI biomedical models, translating complex clinical imaging protocols into reliable production software.',
            details: [
              'Implemented Human-in-the-Loop supervised AI pipelines for medical image segmentation, normalisation, and dataset annotation for model fine-tuning.',
              'Engineered auxiliary preprocessing microservices and FastAPI REST endpoints using Python, OpenCV, PyTorch, and MONAI to deliver real-time model inference.',
              'Delivered low-latency real-time inference workflows for clinical imaging scans with strict reliability metrics.',
              'Collaborated closely with clinical specialists at Hospital La Fe to translate complex diagnostic imaging requirements into production-ready software components.'
            ],
            techStack: ['Python 3', 'FastAPI', 'PyTorch', 'MONAI', 'OpenCV', 'Docker', 'RESTful APIs', 'Medical Imaging'],
            link: 'https://github.com/Sacasa01/Fertoolity',
            linkText: 'View Clinical Project ↗'
          },
          {
            id: 'fitforge',
            title: 'FitForge',
            subtitle: 'Full-Stack Fitness & Recommendation Platform',
            badge: 'TFG Flagship · Sole Architect',
            metricBadge: '★ 5.0 · 33 APIs',
            period: '2025 – 2026',
            image: '/assets/projects/fitforge.jpg',
            accentColor: '#D7340B',
            glowColor: 'rgba(215, 52, 11, 0.60)',
            summary: 'A decoupled fitness SPA powered by a custom workout and nutrition recommendation algorithm.',
            fullDescription: 'Developed as a final degree project (TFG) with top honors. Engineered a completely decoupled architecture featuring a Symfony 7 REST API with 33 secured endpoints, stateless JWT authentication, and role-based access control (RBAC). A normalized 14-table MySQL relational database powers algorithmic training and diet recommendations. The frontend is built with Angular 19 standalone components and reactive signals for instantaneous state propagation, fully containerized with Docker Compose.',
            details: [
              'Architected a 14-table normalized MySQL schema and a Symfony 7 REST API featuring 33 secured endpoints, JWT authentication, and fine-grained RBAC.',
              'Developed dynamic recommendation algorithms tailoring workout routines and macronutrient targets to user progression.',
              'Designed a clean, standalone Angular 19 frontend with reactive signals and modular clean architecture.',
              'Containerized the complete deployment with Docker Compose (PHP-FPM, Nginx, MySQL) maintaining a feature-branch Git workflow.'
            ],
            techStack: ['PHP 8.2', 'Symfony 7', 'Angular 19', 'MySQL', 'Docker Compose', 'JWT Auth', 'RBAC', 'REST API'],
            link: 'https://github.com/Sacasa01/FitForge',
            linkText: 'View Repository ↗'
          },
          {
            id: 'land-mapper',
            title: 'Legacy Land Mapper',
            subtitle: 'High-Throughput Geospatial Cadastre Engine',
            badge: 'Geospatial GIS · 20 Workers',
            metricBadge: '★ 4.8 · >90% Opt',
            period: '2025',
            image: '/assets/projects/land-mapper.jpg',
            accentColor: '#16A34A',
            glowColor: 'rgba(22, 163, 74, 0.55)',
            summary: 'Multithreaded geospatial data pipeline cutting cadastral parcel batch queries by over 90% with dynamic interactive map rendering.',
            fullDescription: 'Created to solve real-world agricultural land management and cadastral validation challenges in Galicia. Transforms raw tabular cadastral records (Excel/CSV) into interactive, multi-layered geospatial HTML maps. Designed a high-throughput Python backend utilizing a 20-worker thread pool that queries the Spanish Directorate General of Cadastre WFS API concurrently, cutting batch query execution time by over 90%. Outputs enriched GeoJSON spatial polygons with real-time layer toggles and area calculations.',
            details: [
              'Engineered a multi-threaded Python backend with 20 concurrent workers querying the Spanish Cadastre WFS API, cutting bulk query times by over 90%.',
              'Processed raw tabular cadastral records with Pandas into enriched GeoJSON spatial polygons with customizable layer toggles and real-time filtering.',
              'Rendered responsive, interactive web map interfaces using Leaflet.js with dynamic filtering and surface area calculators.',
              'Integrated OGC compliant WFS standards for automated spatial boundaries and administrative parcel attributes.'
            ],
            techStack: ['Python 3', 'Pandas', 'Leaflet.js', 'GeoJSON', 'Cadastre WFS API', 'Multi-Threading', 'GIS'],
            link: 'https://github.com/Sacasa01/legacy-land-mapper',
            linkText: 'View Repository ↗'
          },
          {
            id: 'homelab',
            title: 'HomeLab & Cloud Ecosystem',
            subtitle: 'Enterprise Self-Hosted Infrastructure & GitOps',
            badge: 'DevOps & Cloud · Zero-Trust',
            metricBadge: '★ 4.9 · 99.9% Up',
            period: '2025 – 2026',
            image: '/assets/projects/homelab.jpg',
            accentColor: '#0284C7',
            glowColor: 'rgba(2, 132, 199, 0.55)',
            summary: 'Production-grade local cloud infrastructure featuring GitOps CI/CD automation, Tailscale Zero-Trust mesh network, and GPU-accelerated local AI models.',
            fullDescription: 'Transformed dedicated bare-metal hardware into an enterprise-grade self-hosted cloud server following modern DevOps engineering practices. Features declarative multi-container service orchestration with Docker Compose v2, continuous GitOps deployment via GitHub Actions, and an encrypted peer-to-peer Zero-Trust mesh network powered by Tailscale (eliminating router port forwarding). Hosts local AI inference pipelines (Ollama, Whisper) accelerated by dedicated NVIDIA GPU for private LLM workflows.',
            details: [
              'Implemented automated GitOps workflows with GitHub Actions: repository commits automatically trigger deployment and health checks.',
              'Configured encrypted Zero-Trust peer-to-peer mesh network with Tailscale for secure worldwide remote access without exposed ports.',
              'Deployed GPU-accelerated private AI services (Ollama, Whisper) for zero-latency local speech-to-text and LLM inference.',
              'Structured modular Docker Compose architecture with automated volume backups, reverse proxying, and health monitoring.'
            ],
            techStack: ['Docker Compose v2', 'Linux / Proxmox', 'Tailscale Zero-Trust', 'Ollama / GPU AI', 'CI/CD GitOps', 'Nginx'],
            link: 'https://github.com/Sacasa01/homelab-ecosystem',
            linkText: 'View Infrastructure ↗'
          }
        ]
      },
      skills: {
        sectionTitle: 'Skills Architecture',
        sectionSubtitle: 'Full-Stack & AI Systems Breakdown',
        sectionDescription: 'Hierarchical node diagram connecting core Full-Stack engineering to production AI systems, relational databases, and cloud infrastructure with proficiency levels.',
        rootRole: 'FULL STACK & AI DEVELOPER',
        rootSubtitle: 'Santiago Castro Salt · Technical Backbone',
        branches: [
          {
            id: 'frontend',
            name: 'FRONT END',
            color: '#0284C7',
            glowColor: 'rgba(2, 132, 199, 0.45)',
            lightBg: 'rgba(2, 132, 199, 0.08)',
            icon: 'frontend',
            skills: [
              { id: 'typescript', name: 'TypeScript', level: 95, detail: 'Angular 19 · Strict Typings · Node.js', badge: '95%' },
              { id: 'angular', name: 'Angular 19', level: 92, detail: 'Standalone Components · Signals · RxJS', badge: '92%' },
              { id: 'html-css', name: 'HTML5 & CSS3', level: 90, detail: 'Semantic Standards · Tailwind CSS', badge: '90%' }
            ]
          },
          {
            id: 'backend',
            name: 'BACK END',
            color: '#D7340B',
            glowColor: 'rgba(215, 52, 11, 0.45)',
            lightBg: 'rgba(215, 52, 11, 0.08)',
            icon: 'backend',
            skills: [
              { id: 'php', name: 'PHP 8 / Symfony 7', level: 90, detail: 'Clean Architecture · RBAC · JWT', badge: '90%' },
              { id: 'python', name: 'Python 3 / FastAPI', level: 88, detail: 'Async APIs · Microservices · Pandas', badge: '88%' },
              { id: 'symfony-fastapi', name: 'RESTful Architecture', level: 90, detail: 'High-Throughput API Design · Auth', badge: '90%' }
            ]
          },
          {
            id: 'database',
            name: 'DATABASE',
            color: '#0D9488',
            glowColor: 'rgba(13, 148, 136, 0.45)',
            lightBg: 'rgba(13, 148, 136, 0.08)',
            icon: 'database',
            skills: [
              { id: 'sql', name: 'MySQL 8 Relational', level: 88, detail: '14-Table Normalized Schemas · Indexing', badge: '88%' },
              { id: 'sql-pg', name: 'PostgreSQL & pgvector', level: 85, detail: 'Vector Search · Spatial Geometries', badge: '85%' },
              { id: 'sql-norm', name: 'Data Modeling & 3NF', level: 90, detail: 'Entity Relationship · Query Optimization', badge: '90%' }
            ]
          },
          {
            id: 'devops',
            name: 'DEV OPS & CLOUD',
            color: '#D97706',
            glowColor: 'rgba(217, 119, 6, 0.45)',
            lightBg: 'rgba(217, 119, 6, 0.08)',
            icon: 'devops',
            skills: [
              { id: 'docker', name: 'Docker & Compose v2', level: 88, detail: 'Multi-stage Builds · Orchestration · CI', badge: '88%' },
              { id: 'aws', name: 'AWS Cloud Services', level: 80, detail: 'EC2 · S3 · RDS · Lambda · Practitioner', badge: '80%' },
              { id: 'git-cicd', name: 'GitOps & GitHub Actions', level: 85, detail: 'Automated CI/CD · Quality Gates', badge: '85%' }
            ]
          },
          {
            id: 'ai-agents',
            name: 'AI & AGENTS',
            color: '#9333EA',
            glowColor: 'rgba(147, 51, 234, 0.45)',
            lightBg: 'rgba(147, 51, 234, 0.08)',
            icon: 'ai',
            skills: [
              { id: 'mcp-ai', name: 'Model Context Protocol (MCP)', level: 88, detail: 'Custom Tools · Server Protocol · Agents', badge: '88%' },
              { id: 'pytorch-monai', name: 'PyTorch & MONAI', level: 85, detail: 'Medical Imaging · Neural Segmentation', badge: '85%' },
              { id: 'agentic-ai', name: 'Agentic Workflows & ReAct', level: 85, detail: 'Function Calling · Human-in-the-Loop', badge: '85%' }
            ]
          }
        ],
        languages: [
          { id: 'lang-en', name: 'English', level: 92, detail: 'C1 Certified · IELTS 8.0 · Full Professional Working Proficiency', badge: 'C1 Certified' },
          { id: 'lang-es', name: 'Spanish', level: 100, detail: 'Native Speaker · Bilingual Academic & Technical Fluency', badge: 'Native (C2)' },
          { id: 'lang-va', name: 'Valencian / Catalan', level: 100, detail: 'Native Regional Bilingual Proficiency', badge: 'Native' }
        ],
        items: [
          {
            id: 'python',
            name: 'Python 3',
            category: 'core',
            categoryLabel: 'Core Backend & AI',
            subtitle: 'FastAPI · PyTorch · Pandas · MONAI',
            badge: 'Advanced'
          },
          {
            id: 'php',
            name: 'PHP 8',
            category: 'core',
            categoryLabel: 'Core Backend',
            subtitle: 'Symfony 7 · Clean Architecture · RBAC',
            badge: 'Advanced'
          },
          {
            id: 'typescript',
            name: 'TypeScript',
            category: 'core',
            categoryLabel: 'Frontend & Node',
            subtitle: 'Angular 19 · Strict Typings · Node.js',
            badge: 'Advanced'
          },
          {
            id: 'html-css',
            name: 'HTML5 & CSS3',
            category: 'core',
            categoryLabel: 'Web Standards',
            subtitle: 'Semantic HTML · Tailwind CSS · Responsive',
            badge: 'Expert'
          },
          {
            id: 'angular',
            name: 'Angular 19',
            category: 'frameworks',
            categoryLabel: 'Frontend Architecture',
            subtitle: 'Standalone Components · Signals · RxJS',
            badge: 'v19 Standalone'
          },
          {
            id: 'symfony-fastapi',
            name: 'Symfony & FastAPI',
            category: 'frameworks',
            categoryLabel: 'API Microservices',
            subtitle: 'RESTful Endpoints · Async High-Speed APIs',
            badge: 'Production'
          },
          {
            id: 'docker',
            name: 'Docker & Compose',
            category: 'cloud',
            categoryLabel: 'DevOps & Containers',
            subtitle: 'Multi-stage builds · Orchestration · CI/CD',
            badge: 'Production'
          },
          {
            id: 'aws',
            name: 'AWS Cloud',
            category: 'cloud',
            categoryLabel: 'Cloud Platform',
            subtitle: 'EC2 · S3 · RDS · Lambda · Bedrock',
            badge: 'Practitioner'
          },
          {
            id: 'sql',
            name: 'MySQL & PostgreSQL',
            category: 'frameworks',
            categoryLabel: 'Relational & Vector DBs',
            subtitle: '14-Table Normalized Schemas · pgvector',
            badge: 'Database'
          },
          {
            id: 'mcp-ai',
            name: 'MCP & AI Agents',
            category: 'ai',
            categoryLabel: 'Autonomous Systems',
            subtitle: 'Model Context Protocol · Function Calling',
            badge: 'Agentic AI'
          },
          {
            id: 'git-cicd',
            name: 'Git & GitHub Actions',
            category: 'cloud',
            categoryLabel: 'Version Control & CI/CD',
            subtitle: 'GitOps · Automated Pipelines · Testing',
            badge: 'GitOps'
          },
          {
            id: 'lang-en',
            name: 'English',
            category: 'languages',
            categoryLabel: 'Spoken Language',
            subtitle: 'C1 Certified · IELTS 8.0 · Full Professional',
            badge: 'C1 Proficiency'
          },
          {
            id: 'lang-es',
            name: 'Spanish',
            category: 'languages',
            categoryLabel: 'Spoken Language',
            subtitle: 'Native Speaker · Bilingual Fluency',
            badge: 'Native'
          },
          {
            id: 'lang-va',
            name: 'Valencian / Catalan',
            category: 'languages',
            categoryLabel: 'Spoken Language',
            subtitle: 'Native / Bilingual Competence',
            badge: 'Native'
          }
        ]
      },
      education: {
        sectionTitle: 'Education',
        sectionSubtitle: 'Academic Progression · Bottom-to-Top Timeline',
        timelineBadge: 'Ascending Chronology (Bottom = Oldest → Top = Newest)',
        items: [
          {
            degree: 'BSc (Hons) in Computer Science (Top-Up)',
            institution: 'Canterbury Christ Church University (via MSMK University, Madrid)',
            period: 'Sep 2026 – Jun 2027',
            badge: 'Taught 100% in English · Current',
            status: 'Current Degree',
            step: '02',
            position: 'top',
            highlights: [
              'Specializations: Advanced Software Engineering, Cloud Systems Architecture, Cybersecurity Protocols, and AI System Integration.',
              'Dual British/Spanish university collaboration preparing for high-impact software engineering roles.'
            ]
          },
          {
            degree: 'Higher National Diploma (CFGS DAW) – Web Application Development',
            institution: 'La Florida Universitària, Valencia',
            period: '2024 – 2026',
            badge: 'Grade: 7.00 / 10 · Completed',
            status: 'Foundation Degree',
            step: '01',
            position: 'bottom',
            highlights: [
              'Rigorous focus on enterprise backend architectures (PHP 8/Symfony 7, MySQL relational schemas).',
              'Modern frontend engineering with TypeScript/Angular, clean architecture principles, and containerized Docker environments.'
            ]
          }
        ]
      },
      certifications: {
        sectionTitle: 'Certifications & Credentials',
        sectionSubtitle: 'Validated Competencies & Continuous Learning',
        items: [
          {
            title: 'English: C1 Certified (IELTS 8.0)',
            issuer: 'Official IELTS Examination',
            year: '2026',
            badge: 'C1 Fluent · CEFR',
            description: 'Advanced academic and professional English fluency for international communication, technical interviews, and engineering leadership.'
          },
          {
            title: 'Google: Artificial Intelligence & Productivity',
            issuer: 'Santander Open Academy & Google',
            year: 'Jan 2025',
            badge: 'Google AI · Certified',
            description: 'Modern generative AI integration, prompt design architectures, and automated developer productivity workflows.'
          },
          {
            title: 'AWS: Cloud Workshop & Practitioner Fundamentals',
            issuer: 'Amazon Web Services (AWS)',
            year: '2025',
            badge: 'AWS Cloud · Workshop',
            description: 'Hands-on cloud architecture workshop covering AWS core services (EC2, S3, RDS, Lambda), security compliance, and deployment strategies.'
          }
        ]
      },
      contact: {
        sectionTitle: 'Contact',
        sectionSubtitle: 'Direct Channel & Opportunities',
        heading: "Let's Build Something Impactful",
        subheading: 'Open for Software Engineering and AI Systems Integration roles in Dublin, Ireland or International Remote.',
        text: 'Whether you have an engineering opening, a clinical AI pipeline challenge, or want to discuss technical architecture, my inbox is always open. Feel free to connect directly through any channel below.',
        email: 'santiagocsdev@gmail.com',
        phone: '+34 654 763 788',
        location: 'Dublin, Ireland',
        locationBadge: 'Available On-Site (Sep 2026) / International Remote',
        emailLabel: 'Direct Email',
        phoneLabel: 'Direct Phone / WhatsApp',
        locationLabel: 'Target Location',
        copyEmail: 'Copy Email',
        emailCopied: 'Copied to Clipboard!',
        sendEmail: 'Send Direct Email',
        callWhatsapp: 'Call / WhatsApp',
        socialsTitle: 'Professional Profiles',
        downloadCv: 'Curriculum Vitae (PDF)'
      },
      footer: {
        rights: 'All rights reserved.',
        builtWith: 'Engineered with Angular 19, Tailwind CSS & Clean Architecture.'
      }
    },
    es: {
      nav: {
        experience: 'Experiencia',
        projects: 'Proyectos',
        skills: 'Habilidades',
        education: 'Educación',
        certifications: 'Certificaciones',
        contact: 'Contacto'
      },
      hero: {
        greeting: 'Hola, soy',
        name: 'Santiago',
        surname: 'Castro Salt',
        title: 'Backend & AI Systems Integration Engineer',
        location: 'Dublín, Irlanda',
        summary: 'Especializado en ingeniería de sistemas backend de alto rendimiento (Python, PHP/Symfony 7, TypeScript, Docker) e integración de arquitecturas de IA autónomas, agentes MCP y pipelines de inferencia con Human-in-the-Loop.',
        status: 'Disponible para On-Site en Dublín o Remoto Internacional'
      },
      experience: {
        sectionTitle: 'Experiencia Laboral',
        sectionSubtitle: 'Ingeniería en Producción y Entornos Clínicos',
        items: [
          {
            role: 'Desarrollador de Integración de Software e IA',
            company: 'Fertoolity — Hospital Universitari i Politècnic La Fe',
            type: 'Prácticas Curriculares (FCT)',
            period: 'Mar 2026 – Jun 2026',
            location: 'Hospital La Fe, Valencia',
            description: 'Participación en el flujo de ingeniería de IA clínica asistida para segmentación y diagnóstico por imagen médica.',
            highlights: [
              'Implementación de flujos de trabajo supervisados Human-in-the-Loop para segmentación de imagen médica, normalización y anotación de datasets para fine-tuning de modelos.',
              'Desarrollo de microservicios de preprocesamiento y endpoints REST con FastAPI utilizando Python, OpenCV, PyTorch y MONAI para inferencia en tiempo real.',
              'Colaboración directa con especialistas clínicos del Hospital La Fe para traducir requerimientos de datos diagnósticos en componentes de software robustos.'
            ],
            techStack: ['Python 3', 'FastAPI', 'PyTorch', 'MONAI', 'OpenCV', 'Docker', 'APIs REST', 'Imagen Médica']
          }
        ]
      },
      projects: {
        sectionTitle: 'Proyectos Destacados',
        sectionSubtitle: 'Arquitectura de Sistemas y Ejecución Técnica',
        sectionDescription: 'Explora mis 5 proyectos insignia en producción, IA clínica, procesamiento geoespacial e infraestructura. Pasa el cursor para elevar las cartas y pulsa para abrir la ficha técnica completa.',
        inspectPrompt: 'Ver Ficha',
        highlightsTitle: 'Hitos de Ingeniería y Arquitectura',
        techStackTitle: 'Tecnologías y Arquitectura',
        modalClose: 'Cerrar Ficha',
        items: [
          {
            id: 'agentic-mcp',
            title: 'Herramientas Agénticas MCP',
            subtitle: 'Model Context Protocol y Ejecución de Herramientas IA',
            badge: 'Sistemas Agénticos · Arquitectura',
            metricBadge: '★ 5.0 · MCP',
            period: '2026',
            image: '/assets/projects/agentic-mcp.jpg',
            accentColor: '#7C3AED',
            glowColor: 'rgba(124, 58, 237, 0.55)',
            summary: 'Sistemas agénticos que conectan Modelos de Lenguaje (LLMs) con herramientas locales, bases de datos vectoriales y APIs mediante MCP.',
            fullDescription: 'Diseño e implementación de una red de servidores agénticos conformes al estándar abierto Model Context Protocol (MCP). Permite a modelos de lenguaje (LLMs) interactuar de manera segura y determinista con el sistema operativo, bases de datos vectoriales (Qdrant, pgvector) y servicios corporativos. Incorpora barreras de validación Human-in-the-Loop para evitar comandos destructivos no supervisados, con soporte para streaming y orquestación ReAct.',
            details: [
              'Creación de servidores MCP personalizados que permiten a los LLMs ejecutar de forma segura operaciones deterministas en bases de datos y validación de código.',
              'Configuración de barreras de aprobación Human-in-the-Loop para evitar comandos destructivos no supervisados en entornos de producción.',
              'Integración con bases de datos vectoriales (Qdrant / pgvector) para memoria a largo plazo y recuperación semántica de contexto.',
              'Diseño de grafos de ejecución multi-agente con patrones ReAct para flujos autónomos de ingeniería de software.'
            ],
            techStack: ['Model Context Protocol (MCP)', 'Python', 'FastAPI', 'Function Calling', 'Vector DBs', 'Integración de Sistemas'],
            link: 'https://github.com/Sacasa01',
            linkText: 'Ver Perfil de GitHub ↗'
          },
          {
            id: 'fertoolity',
            title: 'Fertoolity',
            subtitle: 'IA Clínica y Diagnóstico por Imagen Médica',
            badge: 'Hospital La Fe · Prácticas FCT',
            metricBadge: '★ 4.9 · MONAI',
            period: 'Mar 2026 – Jun 2026',
            image: '/assets/projects/fertoolity.jpg',
            accentColor: '#0D9488',
            glowColor: 'rgba(13, 148, 136, 0.55)',
            summary: 'Pipeline de visión por computador e inferencia de IA en tiempo real para segmentación diagnóstica en entornos clínicos de alta exigencia.',
            fullDescription: 'Desarrollado durante las prácticas curriculares en el Hospital Universitari i Politècnic La Fe de Valencia. El sistema implementa un flujo asistido por IA supervisado (Human-in-the-Loop) para el procesamiento, normalización y segmentación de imágenes médicas. Integra microservicios de inferencia asíncronos de baja latencia con FastAPI respaldados por PyTorch y la librería biomédica MONAI, permitiendo a especialistas clínicos validar anotaciones y acelerar diagnósticos con fiabilidad.',
            details: [
              'Implementación de flujos de trabajo supervisados Human-in-the-Loop para segmentación de imagen médica, normalización y anotación de datasets para fine-tuning de modelos.',
              'Desarrollo de microservicios de preprocesamiento y endpoints REST con FastAPI utilizando Python, OpenCV, PyTorch y MONAI para inferencia en tiempo real.',
              'Inferencia en tiempo real de baja latencia optimizada para cortes tomográficos y de ultrasonido de alta resolución.',
              'Colaboración directa con especialistas clínicos del Hospital La Fe para traducir requerimientos de datos diagnósticos en componentes de software robustos.'
            ],
            techStack: ['Python 3', 'FastAPI', 'PyTorch', 'MONAI', 'OpenCV', 'Docker', 'APIs REST', 'Imagen Médica'],
            link: 'https://github.com/Sacasa01/Fertoolity',
            linkText: 'Ver Proyecto Clínico ↗'
          },
          {
            id: 'fitforge',
            title: 'FitForge',
            subtitle: 'Plataforma Full-Stack de Fitness y Motor de Recomendación',
            badge: 'Proyecto TFG · Único Arquitecto',
            metricBadge: '★ 5.0 · 33 APIs',
            period: '2025 – 2026',
            image: '/assets/projects/fitforge.jpg',
            accentColor: '#D7340B',
            glowColor: 'rgba(215, 52, 11, 0.60)',
            summary: 'SPA completa impulsada por un algoritmo propio de recomendación de entrenamientos y planes nutricionales.',
            fullDescription: 'Desarrollado como Proyecto de Fin de Grado (TFG) con máxima calificación. Cuenta con una arquitectura desacoplada que integra una API REST en Symfony 7 con 33 endpoints securizados, autenticación JWT stateless y control de acceso basado en roles (RBAC). Una base de datos relacional MySQL normalizada de 14 tablas respalda algoritmos propios de recomendación física y nutricional. El frontend reactivo en Angular 19 standalone aprovecha Signals para una experiencia ultrarrápida, orquestado íntegramente mediante Docker Compose.',
            details: [
              'Arquitectura de base de datos MySQL normalizada de 14 tablas y API REST con Symfony 7 (33 endpoints, autenticación JWT y control de acceso RBAC).',
              'Desarrollo de motor de recomendación algorítmico adaptativo para rutinas de entrenamiento y cálculo de macronutrientes.',
              'Frontend desacoplado en Angular 19 standalone con Signals reactivos y componentes modulares bajo arquitectura limpia.',
              'Entorno completo contenerizado con Docker Compose (PHP-FPM, Nginx, MySQL) siguiendo un flujo estricto de ramas Git.'
            ],
            techStack: ['PHP 8.2', 'Symfony 7', 'Angular 19', 'MySQL', 'Docker Compose', 'JWT Auth', 'RBAC', 'API REST'],
            link: 'https://github.com/Sacasa01/FitForge',
            linkText: 'Ver Repositorio ↗'
          },
          {
            id: 'land-mapper',
            title: 'Legacy Land Mapper',
            subtitle: 'Motor de Automatización Geoespacial Catastral',
            badge: 'GIS Geoespacial · 20 Workers',
            metricBadge: '★ 4.8 · >90% Opt',
            period: '2025',
            image: '/assets/projects/land-mapper.jpg',
            accentColor: '#16A34A',
            glowColor: 'rgba(22, 163, 74, 0.55)',
            summary: 'Pipeline de automatización geoespacial que convierte registros catastrales de Excel/CSV en mapas HTML interactivos y responsivos.',
            fullDescription: 'Herramienta de automatización territorial nacida para resolver la gestión de parcelas y fincas rústicas en Galicia. Transforma registros tabulares complejos en mapas interactivos con polígonos catastrales vectoriales. Diseñado con un worker pool multihilo en Python (20 hilos concurrentes) que consulta la API WFS oficial del Catastro de España, reduciendo el tiempo de procesamiento masivo en más del 90% y produciendo GeoJSON interactivo sobre Leaflet.js con cálculo dinámico de áreas y filtros.',
            details: [
              'Backend multihilo en Python con 20 workers concurrentes consultando la API WFS del Catastro, reduciendo tiempos de consulta en más del 90%.',
              'Procesamiento de datos espaciales crudos con Pandas hacia geometrías GeoJSON enriquecidas con filtrado y capas en tiempo real.',
              'Visualizador web interactivo con Leaflet.js con capas activas, filtros dinámicos y cálculo métrico de superficies.',
              'Integración directa con especificaciones WFS/OGC de la Dirección General del Catastro del Ministerio de Hacienda.'
            ],
            techStack: ['Python 3', 'Pandas', 'Leaflet.js', 'GeoJSON', 'API WFS Catastro', 'Multithreading', 'GIS'],
            link: 'https://github.com/Sacasa01/legacy-land-mapper',
            linkText: 'Ver Repositorio ↗'
          },
          {
            id: 'homelab',
            title: 'Ecosistema HomeLab y Cloud',
            subtitle: 'Infraestructura Empresarial Self-Hosted y GitOps',
            badge: 'DevOps y Cloud · Zero-Trust',
            metricBadge: '★ 4.9 · 99.9% Up',
            period: '2025 – 2026',
            image: '/assets/projects/homelab.jpg',
            accentColor: '#0284C7',
            glowColor: 'rgba(2, 132, 199, 0.55)',
            summary: 'Infraestructura de servidor local de nivel empresarial con arquitectura GitOps, red mesh segura Zero-Trust, Docker modular e IA local acelerada por GPU.',
            fullDescription: 'Transformación de hardware dedicado en un servidor doméstico de categoría empresarial aplicando metodologías DevOps profesionales. Cuenta con orquestación declarativa de microservicios con Docker Compose v2, despliegues continuos automatizados con GitHub Actions (GitOps) y red mesh privada cifrada Zero-Trust con Tailscale (sin apertura de puertos en el router). Aloja servicios de inferencia de IA local (Ollama, Whisper) acelerados por GPU NVIDIA para computación privada sin consumo de APIs de pago.',
            details: [
              'Flujo de trabajo GitOps con GitHub Actions: validación automática y despliegue continuo de contenedores ante cada commit.',
              'Red mallada privada cifrada punto a punto con Tailscale para acceso global seguro sin comprometer la seguridad perimetral.',
              'Inferencia de IA local privada (Ollama, Whisper) acelerada por GPU NVIDIA para transcripción de audio y modelos de lenguaje.',
              'Arquitectura modular con Docker Compose, proxy inverso securizado, monitorización en tiempo real y copias de seguridad automatizadas.'
            ],
            techStack: ['Docker Compose v2', 'Linux / Proxmox', 'Tailscale Zero-Trust', 'Ollama / GPU AI', 'CI/CD GitOps', 'Nginx'],
            link: 'https://github.com/Sacasa01/homelab-ecosystem',
            linkText: 'Ver Infraestructura ↗'
          }
        ]
      },
      skills: {
        sectionTitle: 'Arquitectura de Habilidades',
        sectionSubtitle: 'Desglose Full-Stack & Sistemas de IA',
        sectionDescription: 'Diagrama de nodos jerárquico que conecta el núcleo Full-Stack con sistemas de IA en producción, bases de datos relacionales e infraestructura cloud con niveles de progreso.',
        rootRole: 'DESARROLLADOR FULL STACK & IA',
        rootSubtitle: 'Santiago Castro Salt · Núcleo de Ingeniería',
        branches: [
          {
            id: 'frontend',
            name: 'FRONT END',
            color: '#0284C7',
            glowColor: 'rgba(2, 132, 199, 0.45)',
            lightBg: 'rgba(2, 132, 199, 0.08)',
            icon: 'frontend',
            skills: [
              { id: 'typescript', name: 'TypeScript', level: 95, detail: 'Angular 19 · Tipado Estricto · Node.js', badge: '95%' },
              { id: 'angular', name: 'Angular 19', level: 92, detail: 'Componentes Standalone · Signals · RxJS', badge: '92%' },
              { id: 'html-css', name: 'HTML5 y CSS3', level: 90, detail: 'Estándares Semánticos · Tailwind CSS', badge: '90%' }
            ]
          },
          {
            id: 'backend',
            name: 'BACK END',
            color: '#D7340B',
            glowColor: 'rgba(215, 52, 11, 0.45)',
            lightBg: 'rgba(215, 52, 11, 0.08)',
            icon: 'backend',
            skills: [
              { id: 'php', name: 'PHP 8 / Symfony 7', level: 90, detail: 'Arquitectura Limpia · RBAC · JWT', badge: '90%' },
              { id: 'python', name: 'Python 3 / FastAPI', level: 88, detail: 'APIs Asíncronas · Microservicios · Pandas', badge: '88%' },
              { id: 'symfony-fastapi', name: 'Arquitectura RESTful', level: 90, detail: 'Diseño de APIs de Alto Rendimiento', badge: '90%' }
            ]
          },
          {
            id: 'database',
            name: 'BASES DE DATOS',
            color: '#0D9488',
            glowColor: 'rgba(13, 148, 136, 0.45)',
            lightBg: 'rgba(13, 148, 136, 0.08)',
            icon: 'database',
            skills: [
              { id: 'sql', name: 'MySQL 8 Relacional', level: 88, detail: 'Esquemas Normalizados 14 Tablas · Índices', badge: '88%' },
              { id: 'sql-pg', name: 'PostgreSQL y pgvector', level: 85, detail: 'Búsqueda Vectorial · Geometrías GIS', badge: '85%' },
              { id: 'sql-norm', name: 'Modelado de Datos y 3FN', level: 90, detail: 'Entidad Relación · Optimización SQL', badge: '90%' }
            ]
          },
          {
            id: 'devops',
            name: 'DEV OPS & CLOUD',
            color: '#D97706',
            glowColor: 'rgba(217, 119, 6, 0.45)',
            lightBg: 'rgba(217, 119, 6, 0.08)',
            icon: 'devops',
            skills: [
              { id: 'docker', name: 'Docker y Compose v2', level: 88, detail: 'Builds Multi-etapa · Orquestación · CI', badge: '88%' },
              { id: 'aws', name: 'Servicios Cloud AWS', level: 80, detail: 'EC2 · S3 · RDS · Lambda · Practitioner', badge: '80%' },
              { id: 'git-cicd', name: 'GitOps y GitHub Actions', level: 85, detail: 'CI/CD Automatizado · Quality Gates', badge: '85%' }
            ]
          },
          {
            id: 'ai-agents',
            name: 'IA & AGENTES',
            color: '#9333EA',
            glowColor: 'rgba(147, 51, 234, 0.45)',
            lightBg: 'rgba(147, 51, 234, 0.08)',
            icon: 'ai',
            skills: [
              { id: 'mcp-ai', name: 'Model Context Protocol (MCP)', level: 88, detail: 'Herramientas Custom · Protocolo Servidor', badge: '88%' },
              { id: 'pytorch-monai', name: 'PyTorch y MONAI', level: 85, detail: 'Imagen Médica · Segmentación Neuronal', badge: '85%' },
              { id: 'agentic-ai', name: 'Flujos Agénticos y ReAct', level: 85, detail: 'Function Calling · Human-in-the-Loop', badge: '85%' }
            ]
          }
        ],
        languages: [
          { id: 'lang-en', name: 'Inglés', level: 92, detail: 'Certificado C1 · IELTS 8.0 · Fluidez Profesional Internacional', badge: 'Nivel C1' },
          { id: 'lang-es', name: 'Español / Castellano', level: 100, detail: 'Hablante Nativo · Fluidez Académica y Técnica Plena', badge: 'Nativo (C2)' },
          { id: 'lang-va', name: 'Valenciano / Catalán', level: 100, detail: 'Competencia Bilingüe Regional Nativa', badge: 'Nativo' }
        ],
        items: [
          {
            id: 'python',
            name: 'Python 3',
            category: 'core',
            categoryLabel: 'Backend Troncal e IA',
            subtitle: 'FastAPI · PyTorch · Pandas · MONAI',
            badge: 'Avanzado'
          },
          {
            id: 'php',
            name: 'PHP 8',
            category: 'core',
            categoryLabel: 'Backend Troncal',
            subtitle: 'Symfony 7 · Clean Architecture · RBAC',
            badge: 'Avanzado'
          },
          {
            id: 'typescript',
            name: 'TypeScript',
            category: 'core',
            categoryLabel: 'Frontend y Node',
            subtitle: 'Angular 19 · Tipado Estricto · Node.js',
            badge: 'Avanzado'
          },
          {
            id: 'html-css',
            name: 'HTML5 y CSS3',
            category: 'core',
            categoryLabel: 'Estándares Web',
            subtitle: 'HTML Semántico · Tailwind CSS · Responsive',
            badge: 'Experto'
          },
          {
            id: 'angular',
            name: 'Angular 19',
            category: 'frameworks',
            categoryLabel: 'Arquitectura Frontend',
            subtitle: 'Componentes Standalone · Signals · RxJS',
            badge: 'v19 Standalone'
          },
          {
            id: 'symfony-fastapi',
            name: 'Symfony y FastAPI',
            category: 'frameworks',
            categoryLabel: 'Microservicios y APIs',
            subtitle: 'Endpoints RESTful · Inferencia Asíncrona',
            badge: 'Producción'
          },
          {
            id: 'docker',
            name: 'Docker y Compose',
            category: 'cloud',
            categoryLabel: 'Contenedores y DevOps',
            subtitle: 'Builds Multi-etapa · Redes · CI/CD',
            badge: 'Producción'
          },
          {
            id: 'aws',
            name: 'AWS Cloud',
            category: 'cloud',
            categoryLabel: 'Plataforma Cloud',
            subtitle: 'EC2 · S3 · RDS · Lambda · Bedrock',
            badge: 'Practitioner'
          },
          {
            id: 'sql',
            name: 'MySQL y PostgreSQL',
            category: 'frameworks',
            categoryLabel: 'Bases de Datos Relacionales y Vectoriales',
            subtitle: 'Esquemas Normalizados (14 tablas) · pgvector',
            badge: 'Base de Datos'
          },
          {
            id: 'mcp-ai',
            name: 'MCP y Agentes de IA',
            category: 'ai',
            categoryLabel: 'Sistemas Autónomos',
            subtitle: 'Model Context Protocol · Ejecución de Herramientas',
            badge: 'IA Agéntica'
          },
          {
            id: 'git-cicd',
            name: 'Git y GitHub Actions',
            category: 'cloud',
            categoryLabel: 'Control de Versiones y CI/CD',
            subtitle: 'GitOps · Pipelines Automatizados · Testing',
            badge: 'GitOps'
          },
          {
            id: 'lang-en',
            name: 'Inglés',
            category: 'languages',
            categoryLabel: 'Idioma',
            subtitle: 'C1 Acreditado · IELTS 8.0 · Profesional Fluido',
            badge: 'C1 Avanzado'
          },
          {
            id: 'lang-es',
            name: 'Español',
            category: 'languages',
            categoryLabel: 'Idioma',
            subtitle: 'Hablante Nativo · Dominio Completo',
            badge: 'Nativo'
          },
          {
            id: 'lang-va',
            name: 'Valencian / Catalan',
            category: 'languages',
            categoryLabel: 'Idioma',
            subtitle: 'Competencia Nativa / Bilingüe',
            badge: 'Nativo'
          }
        ]
      },
      education: {
        sectionTitle: 'Formación Académica',
        sectionSubtitle: 'Progresión Académica · Línea de Tiempo de Abajo hacia Arriba',
        timelineBadge: 'Cronología Ascendente (Abajo = Más antigua → Arriba = Más nueva)',
        items: [
          {
            degree: 'BSc (Hons) in Computer Science (Top-Up)',
            institution: 'Canterbury Christ Church University (sede Madrid en MSMK University)',
            period: 'Sep 2026 – Jun 2027',
            badge: 'Impartido 100% en Inglés · En Curso',
            status: 'Titulación Universitaria',
            step: '02',
            position: 'top',
            highlights: [
              'Especializaciones: Advanced Software Engineering, Cloud Systems, Cybersecurity y AI System Integration.',
              'Formación universitaria británica y española orientada a roles de ingeniería de software de alto impacto.'
            ]
          },
          {
            degree: 'CFGS Desarrollo de Aplicaciones Web (DAW)',
            institution: 'La Florida Universitària, Valencia',
            period: '2024 – 2026',
            badge: 'Nota Media: 7.00 / 10 · Finalizado',
            status: 'Hito Fundacional',
            step: '01',
            position: 'bottom',
            highlights: [
              'Enfoque riguroso en arquitecturas empresariales de backend (PHP 8/Symfony 7, esquemas relacionales MySQL/PostgreSQL).',
              'Ingeniería frontend moderna con TypeScript/Angular, principios Clean Code y entornos contenerizados con Docker.'
            ]
          }
        ]
      },
      certifications: {
        sectionTitle: 'Certificaciones y Credenciales',
        sectionSubtitle: 'Competencias Validadas y Formación Continua',
        items: [
          {
            title: 'Inglés: Certificación C1 (IELTS 8.0)',
            issuer: 'Official IELTS Examination',
            year: '2026',
            badge: 'C1 Fluido · MCER',
            description: 'Fluidez académica y profesional avanzada en inglés técnico para liderazgo y comunicación en equipos internacionales.'
          },
          {
            title: 'Google: Inteligencia Artificial y Productividad',
            issuer: 'Santander Open Academy y Google',
            year: 'Ene 2025',
            badge: 'Google AI · Certificado',
            description: 'Integración de IA generativa, diseño de prompts y automatización de flujos de productividad de desarrollo.'
          },
          {
            title: 'AWS: Taller Cloud y Fundamentos Practitioner',
            issuer: 'Amazon Web Services (AWS)',
            year: '2025',
            badge: 'AWS Cloud · Taller',
            description: 'Taller práctico de arquitectura cloud en AWS (EC2, S3, RDS, Lambda), seguridad en la nube y estrategias de despliegue en producción.'
          }
        ]
      },
      contact: {
        sectionTitle: 'Contacto',
        sectionSubtitle: 'Canal Directo y Oportunidades',
        heading: 'Construyamos Algo de Impacto',
        subheading: 'Disponible para roles de ingeniería de software e integración de sistemas de IA en Dublín, Irlanda o remoto internacional.',
        text: 'Si buscas incorporar talento técnico en backend, construir pipelines de IA o conversar sobre arquitectura de sistemas, mis vías de contacto están abiertas. Escríbeme directamente.',
        email: 'santiagocsdev@gmail.com',
        phone: '+34 654 763 788',
        location: 'Dublín, Irlanda',
        locationBadge: 'Disponible On-Site (Sep 2026) / Remoto Internacional',
        emailLabel: 'Correo Electrónico',
        phoneLabel: 'Teléfono / WhatsApp',
        locationLabel: 'Ubicación Objetivo',
        copyEmail: 'Copiar Correo',
        emailCopied: '¡Copiado al portapapeles!',
        sendEmail: 'Enviar Mensaje Directo',
        callWhatsapp: 'Llamar o WhatsApp',
        socialsTitle: 'Perfiles y Código',
        downloadCv: 'Curriculum Vitae (PDF)'
      },
      footer: {
        rights: 'Todos los derechos reservados.',
        builtWith: 'Desarrollado con Angular 19, Tailwind CSS y principios Clean Architecture.'
      }
    }
  };

  // Helper computed to access current language dictionary
  t = computed(() => this.content[this.lang()]);

  // Actions
  toggleLang() {
    this.lang.update(current => current === 'en' ? 'es' : 'en');
  }

  toggleTheme() {
    this.theme.update(current => {
      const next = current === 'light' ? 'dark' : 'light';
      document.documentElement.classList.toggle('dark', next === 'dark');
      document.documentElement.classList.toggle('light', next === 'light');
      return next;
    });
  }

  copyEmailToClipboard() {
    navigator.clipboard.writeText('santiagocsdev@gmail.com');
    this.copiedEmail.set(true);
    setTimeout(() => {
      this.copiedEmail.set(false);
    }, 2500);
  }

  @HostListener('window:keydown.escape')
  handleEscape() {
    if (this.selectedProject()) {
      this.closeProjectModal();
    }
  }

  openProjectModal(project: ProjectItem) {
    this.selectedProject.set(project);
    if (typeof document !== 'undefined') {
      document.body.style.overflow = 'hidden';
    }
  }

  closeProjectModal() {
    this.selectedProject.set(null);
    if (typeof document !== 'undefined') {
      document.body.style.overflow = '';
    }
  }
}
