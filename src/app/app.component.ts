import { Component, signal, computed, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import gsap from 'gsap';

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
  techStack: { name: string; icon: string }[];
  link: string;
  linkText: string;
}

export interface SkillNode {
  id: string;
  name: string;
  shortName?: string;
  domain: 'frontend' | 'backend' | 'database' | 'devops' | 'ai';
  domainLabelEn: string;
  domainLabelEs: string;
  badge: string;
  color: string;
  icon: string;
  descEn: string;
  descEs: string;
  highlightsEn: string[];
  highlightsEs: string[];
}

export interface SkillCluster {
  id: string;
  domainNumber: string;
  nameEn: string;
  nameEs: string;
  accentColor: string;
  skills: SkillNode[];
}

export interface SpokenLanguage {
  id: string;
  nameEn: string;
  nameEs: string;
  levelBadge: string;
  statusBadgeEn: string;
  statusBadgeEs: string;
  descEn: string;
  descEs: string;
  cefr: string;
  flag: string;
  pdfUrl?: string;
  pdfLabelEn?: string;
  pdfLabelEs?: string;
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  lang = signal<Lang>('en');
  theme = signal<Theme>('light');
  copiedEmail = signal<boolean>(false);
  selectedProject = signal<ProjectItem | null>(null);
  displayedProject = signal<ProjectItem | null>(null);
  isClosingModal = signal<boolean>(false);
  selectedSkillNode = signal<SkillNode | null>(null);
  avatarState = signal<'TYPING' | 'IDLE'>('TYPING');
  isCordExpanded = signal<boolean>(true);

  toggleCord() {
    this.isCordExpanded.update(v => !v);
  }

  get currentLang(): Lang {
    return this.lang();
  }

  outerBg = computed(() => this.theme() === 'light' ? '#EAE6D6' : '#070E0F');
  bgColor = computed(() => this.theme() === 'light' ? '#F5F3E7' : '#0D1718');
  cardBg = computed(() => this.theme() === 'light' ? '#FFFFFF' : '#152426');
  cardBorder = computed(() => this.theme() === 'light' ? 'rgba(51, 100, 103, 0.16)' : 'rgba(224, 221, 174, 0.14)');
  textColor = computed(() => this.theme() === 'light' ? '#1A3537' : '#E0DDAE');
  mutedColor = computed(() => this.theme() === 'light' ? '#5C7476' : '#8AA2A4');
  tagBg = computed(() => this.theme() === 'light' ? 'rgba(51, 100, 103, 0.08)' : 'rgba(224, 221, 174, 0.08)');
  accentSinopia = computed(() => this.theme() === 'light' ? '#D7340B' : '#E64319');
  accentCaribbean = computed(() => this.theme() === 'light' ? '#336467' : '#4E898D');
  navBg = computed(() => this.theme() === 'light' ? 'rgba(245, 243, 231, 0.92)' : 'rgba(13, 23, 24, 0.92)');

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
        summary: 'Specialized in building robust backend architectures (Python, PHP/Symfony 7, TypeScript, Docker) and integrating autonomous AI architectures, MCP agents, and clinical Human-in-the-Loop pipelines.',
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
            techStack: [
              { name: 'Python', icon: 'python' },
              { name: 'FastAPI', icon: 'fastapi' },
              { name: 'PyTorch', icon: 'pytorch' },
              { name: 'MONAI', icon: 'monai' },
              { name: 'Docker', icon: 'docker' },
              { name: 'REST API', icon: 'fastapi' }
            ]
          }
        ]
      },
      projects: {
        sectionTitle: 'Featured Projects',
        sectionSubtitle: 'System Architecture & Technical Execution',
        sectionDescription: 'Flagship engineering implementations built with architectural rigor, modular decoupling, and verified benchmarks. Click any card to inspect full technical dossiers.',
        inspectPrompt: 'Inspect Dossier',
        highlightsTitle: 'Key Technical Achievements',
        techStackTitle: 'Technologies & Architecture',
        items: [
          {
            id: 'agentic-mcp',
            title: 'Agentic MCP Ecosystem',
            subtitle: 'Model Context Protocol & Autonomous Tool Calling',
            badge: 'Agentic AI · MCP Architecture',
            metricBadge: '★ 5.0 · MCP',
            period: '2026',
            image: '/assets/projects/agentic-mcp.jpg',
            accentColor: '#D7340B',
            glowColor: 'rgba(215, 52, 11, 0.40)',
            summary: 'Custom Model Context Protocol servers connecting Large Language Models to local tools, vector stores, and APIs with Human-in-the-Loop guardrails.',
            fullDescription: 'Engineered autonomous agent architectures and tool execution servers implementing the Anthropic Model Context Protocol (MCP). Enables Large Language Models to securely interact with the local filesystem, vector databases (Qdrant, pgvector), and external services through strict schema validation and deterministic function calling. Implemented robust Human-in-the-Loop approval barriers to prevent destructive actions and ensure enterprise-grade safety in production environments.',
            details: [
              'Built custom Model Context Protocol (MCP) servers enabling LLMs to securely execute deterministic database operations and code validation.',
              'Implemented Human-in-the-Loop approval barriers to prevent unauthorized destructive commands in production agents.',
              'Integrated vector database retrieval (Qdrant / pgvector) for contextual memory augmentation and semantic search.',
              'Designed multi-agent execution graphs using ReAct patterns for self-correcting autonomous pipelines.'
            ],
            techStack: [
              { name: 'MCP', icon: 'mcp' },
              { name: 'Python', icon: 'python' },
              { name: 'FastAPI', icon: 'fastapi' },
              { name: 'PostgreSQL', icon: 'postgresql' },
              { name: 'AI Agents', icon: 'agentic' }
            ],
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
            accentColor: '#336467',
            glowColor: 'rgba(51, 100, 103, 0.45)',
            summary: 'Human-in-the-Loop supervised AI workflow for clinical medical image segmentation and real-time inference microservices.',
            fullDescription: 'Engineered at Hospital Universitari i Politècnic La Fe (Valencia) within a clinical medical AI environment. Built supervised Human-in-the-Loop deep learning pipelines for medical imaging segmentation, normalization, and specialist dataset annotation for model fine-tuning. Developed asynchronous FastAPI microservices delivering low-latency real-time inference powered by PyTorch and MONAI biomedical models, translating complex clinical imaging protocols into reliable production software.',
            details: [
              'Implemented Human-in-the-Loop supervised AI pipelines for medical image segmentation, normalisation, and dataset annotation for model fine-tuning.',
              'Engineered auxiliary preprocessing microservices and FastAPI REST endpoints using Python, OpenCV, PyTorch, and MONAI to deliver real-time model inference.',
              'Delivered low-latency real-time inference workflows for clinical imaging scans with strict reliability metrics.',
              'Collaborated closely with clinical specialists at Hospital La Fe to translate complex diagnostic imaging requirements into production-ready software components.'
            ],
            techStack: [
              { name: 'Python', icon: 'python' },
              { name: 'FastAPI', icon: 'fastapi' },
              { name: 'PyTorch', icon: 'pytorch' },
              { name: 'MONAI', icon: 'monai' },
              { name: 'Docker', icon: 'docker' }
            ],
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
            glowColor: 'rgba(215, 52, 11, 0.40)',
            summary: 'A decoupled fitness SPA powered by a custom workout and nutrition recommendation algorithm.',
            fullDescription: 'Developed as a final degree project (TFG) with top honors. Engineered a completely decoupled architecture featuring a Symfony 7 REST API with 33 secured endpoints, stateless JWT authentication, and role-based access control (RBAC). A normalized 14-table MySQL relational database powers algorithmic training and diet recommendations. The frontend is built with Angular 19 standalone components and reactive signals for instantaneous state propagation, fully containerized with Docker Compose.',
            details: [
              'Architected a 14-table normalized MySQL schema and a Symfony 7 REST API featuring 33 secured endpoints, JWT authentication, and fine-grained RBAC.',
              'Developed dynamic recommendation algorithms tailoring workout routines and macronutrient targets to user progression.',
              'Designed a clean, standalone Angular 19 frontend with reactive signals and modular clean architecture.',
              'Containerized the complete deployment with Docker Compose (PHP-FPM, Nginx, MySQL) maintaining a feature-branch Git workflow.'
            ],
            techStack: [
              { name: 'PHP', icon: 'php' },
              { name: 'Symfony', icon: 'symfony' },
              { name: 'Angular', icon: 'angular' },
              { name: 'TypeScript', icon: 'typescript' },
              { name: 'MySQL', icon: 'mysql' },
              { name: 'Docker', icon: 'docker' }
            ],
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
            accentColor: '#2B585B',
            glowColor: 'rgba(43, 88, 91, 0.45)',
            summary: 'Multithreaded geospatial data pipeline cutting cadastral parcel batch queries by over 90% with dynamic interactive map rendering.',
            fullDescription: 'Created to solve real-world agricultural land management and cadastral validation challenges in Galicia. Transforms raw tabular cadastral records (Excel/CSV) into interactive, multi-layered geospatial HTML maps. Designed a high-throughput Python backend utilizing a 20-worker thread pool that queries the Spanish Directorate General of Cadastre WFS API concurrently, cutting batch query execution time by over 90%. Outputs enriched GeoJSON spatial polygons with real-time layer toggles and area calculations.',
            details: [
              'Engineered a multi-threaded Python backend with 20 concurrent workers querying the Spanish Cadastre WFS API, cutting bulk query times by over 90%.',
              'Processed raw tabular cadastral records with Pandas into enriched GeoJSON spatial polygons with customizable layer toggles and real-time filtering.',
              'Rendered responsive, interactive web map interfaces using Leaflet.js with dynamic filtering and surface area calculators.',
              'Integrated OGC compliant WFS standards for automated spatial boundaries and administrative parcel attributes.'
            ],
            techStack: [
              { name: 'Python', icon: 'python' },
              { name: 'Pandas', icon: 'pandas' },
              { name: 'Leaflet', icon: 'leaflet' },
              { name: 'GeoJSON', icon: 'geojson' }
            ],
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
            accentColor: '#336467',
            glowColor: 'rgba(51, 100, 103, 0.45)',
            summary: 'Production-grade local cloud infrastructure featuring GitOps CI/CD automation, Tailscale Zero-Trust mesh network, and GPU-accelerated local AI models.',
            fullDescription: 'Transformed dedicated bare-metal hardware into an enterprise-grade self-hosted cloud server following modern DevOps engineering practices. Features declarative multi-container service orchestration with Docker Compose v2, continuous GitOps deployment via GitHub Actions, and an encrypted peer-to-peer Zero-Trust mesh network powered by Tailscale (eliminating router port forwarding). Hosts local AI inference pipelines (Ollama, Whisper) accelerated by dedicated NVIDIA GPU for private LLM workflows.',
            details: [
              'Implemented automated GitOps workflows with GitHub Actions: repository commits automatically trigger deployment and health checks.',
              'Configured encrypted Zero-Trust peer-to-peer mesh network with Tailscale for secure worldwide remote access without exposed ports.',
              'Deployed GPU-accelerated private AI services (Ollama, Whisper) for zero-latency local speech-to-text and LLM inference.',
              'Structured modular Docker Compose architecture with automated volume backups, reverse proxying, and health monitoring.'
            ],
            techStack: [
              { name: 'Docker', icon: 'docker' },
              { name: 'Linux', icon: 'linux' },
              { name: 'Tailscale', icon: 'tailscale' },
              { name: 'GitOps', icon: 'git' }
            ],
            link: 'https://github.com/Sacasa01/homelab-ecosystem',
            linkText: 'View Infrastructure ↗'
          }
        ]
      },
      skills: {
        sectionTitle: 'Skills Architecture',
        sectionSubtitle: 'Vector System Graph & Tech Constellation',
        sectionDescription: 'Interactive interconnected network mapping core full-stack backbones to autonomous AI agents, databases, and containerized cloud pipelines. Hover or tap any node to inspect capabilities.',
        selectPrompt: 'Tap any technology node in the vector system to inspect technical specifications and practical experience.',
        domainsTitle: 'Architecture Clusters',
        spokenSectionTitle: 'Global Mobility & Spoken Communication',
        spokenSectionSubtitle: 'Language Proficiency for International Relocation & Leadership',
        spokenNotice: 'Ready for immediate On-Site integration in Dublin from September 30, 2026.',
        items: [
          { id: 'html-css', name: 'HTML5 & CSS3', category: 'core', categoryLabel: 'Web Standards', subtitle: 'Semantic HTML · Tailwind CSS · Responsive', badge: 'Expert' },
          { id: 'python', name: 'Python 3', category: 'core', categoryLabel: 'Core Backend & AI', subtitle: 'FastAPI · PyTorch · Pandas · MONAI', badge: 'Advanced' },
          { id: 'php', name: 'PHP 8', category: 'core', categoryLabel: 'Core Backend', subtitle: 'Symfony 7 · Clean Architecture · RBAC', badge: 'Advanced' },
          { id: 'typescript', name: 'TypeScript', category: 'core', categoryLabel: 'Frontend & Node', subtitle: 'Angular 19 · Strict Typings · Node.js', badge: 'Advanced' },
          { id: 'angular', name: 'Angular 19', category: 'frameworks', categoryLabel: 'Frontend Architecture', subtitle: 'Standalone Components · Signals · RxJS', badge: 'v19 Standalone' },
          { id: 'docker', name: 'Docker & Compose', category: 'devops', categoryLabel: 'Containerization', subtitle: 'Multi-stage Builds · Alpine · Networks', badge: 'DevOps' },
          { id: 'aws', name: 'AWS Cloud', category: 'devops', categoryLabel: 'Cloud Services', subtitle: 'EC2 · S3 · RDS · Lambda · IAM', badge: 'Practitioner' },
          { id: 'sql', name: 'MySQL & PostgreSQL', category: 'database', categoryLabel: 'Databases', subtitle: '3NF Normalization · Indexing · pgvector', badge: 'Database' },
          { id: 'git', name: 'Git & GitHub Actions', category: 'devops', categoryLabel: 'Automation', subtitle: 'GitOps · Conventional Commits · CI/CD', badge: 'CI/CD' },
          { id: 'mcp', name: 'Model Context Protocol', category: 'ai', categoryLabel: 'AI Systems', subtitle: 'MCP Servers · Tool Execution · LLM Guardrails', badge: 'Anthropic' },
          { id: 'pytorch', name: 'PyTorch & MONAI', category: 'ai', categoryLabel: 'Deep Learning', subtitle: 'Medical Imaging · Neural Segmentation · GPU', badge: 'Clinical AI' },
          { id: 'agentic', name: 'ReAct Agentic Workflows', category: 'ai', categoryLabel: 'Autonomous AI', subtitle: 'Multi-step Reasoning · Tool Selection · HITL', badge: 'Agents' },
          { id: 'lang-en', name: 'English (C1)', category: 'language', categoryLabel: 'Spoken Languages', subtitle: 'C1 Certified · Full Professional Working Proficiency', badge: 'C1 Fluent' },
          { id: 'lang-es', name: 'Spanish (C2)', category: 'language', categoryLabel: 'Spoken Languages', subtitle: 'Native Speaker · Full Bilingual Fluency', badge: 'Native' },
          { id: 'lang-va', name: 'Valencian (C2)', category: 'language', categoryLabel: 'Spoken Languages', subtitle: 'Co-official Regional Native Language', badge: 'Native' }
        ]
      },
      education: {
        sectionTitle: 'Academic Education',
        sectionSubtitle: 'Chronological Progression · Ascending Timeline (Bottom to Top)',
        timelineBadge: 'Ascending Trajectory (Bottom = Foundation → Top = Current)',
        journeyTitle: 'Real Engineering Journey (2024 – 2027)',
        journeySubtitle: 'Continuous Timeline: Academic Foundation → AWS/Google AI Certs → Clinical Practice → BSc Degree',
        journeyMilestones: [
          {
            year: '2024',
            title: 'CFGS DAW — Web Application Development',
            institution: 'La Florida Universitaria, Valencia',
            category: 'academic',
            badge: 'Foundation · Grade 7.0',
            description: 'Started enterprise software development degree: PHP 8/Symfony 7, MySQL relational schemas, and modern TypeScript.',
            icon: 'academic'
          },
          {
            year: '2025',
            title: 'AWS Cloud & Google AI Certifications',
            institution: 'Amazon Web Services & Santander / Google',
            category: 'certification',
            badge: 'AWS & Google AI Certs',
            description: 'Achieved AWS Cloud Practitioner fundamentals and Google Artificial Intelligence & Productivity certification.',
            icon: 'cert'
          },
          {
            year: '2026',
            title: 'Clinical AI Practice & English C1 (IELTS 8.0)',
            institution: 'Hospital La Fe / Fertoolity & Official IELTS',
            category: 'practice',
            badge: 'Clinical FCT & C1 IELTS',
            description: 'Completed hospital clinical AI medical imaging internship (PyTorch/MONAI) and official English C1 accreditation.',
            icon: 'clinical'
          },
          {
            year: '2026 – 2027',
            title: 'BSc (Hons) in Computer Science (Top-Up)',
            institution: 'Canterbury Christ Church University / MSMK',
            category: 'degree',
            badge: 'Current University Degree',
            description: 'Pursuing British Honours degree taught 100% in English: Advanced Software Engineering and AI Systems Integration.',
            icon: 'university'
          }
        ],
        items: [
          {
            degree: 'BSc (Hons) in Computer Science (Top-Up)',
            institution: 'Canterbury Christ Church University (Madrid Campus at MSMK University)',
            period: 'Sep 2026 – Jun 2027',
            badge: 'Taught 100% in English · Enrolled',
            status: 'University Degree',
            step: '02',
            position: 'top',
            highlights: [
              'Specializations: Advanced Software Engineering, Cloud Systems, Cybersecurity and AI Systems Integration.',
              'Dual British and Spanish university training focused on high-impact software engineering roles.'
            ]
          },
          {
            degree: 'CFGS DAW – Web Application Development',
            institution: 'La Florida Universitaria, Valencia',
            period: '2024 – 2026',
            badge: 'Grade Average: 7.00 / 10 · Completed',
            status: 'Foundational Milestone',
            step: '01',
            position: 'bottom',
            highlights: [
              'Rigorous enterprise backend architecture (PHP 8/Symfony 7, MySQL/PostgreSQL relational schema modeling).',
              'Modern frontend engineering with TypeScript/Angular, Clean Code practices, and containerized Docker environments.'
            ]
          }
        ]
      },
      certifications: {
        sectionTitle: 'Certifications & Credentials',
        sectionSubtitle: 'Validated Competencies & Continuous Learning',
        items: [
          {
            title: 'English: C1 Certified (IELTS 8.0 Equivalent)',
            issuer: 'Official IELTS Examination',
            year: '2026',
            badge: 'C1 Fluent · CEFR',
            description: 'Advanced academic and professional English fluency for international engineering collaboration, technical interviews, and systems architecture.'
          },
          {
            title: 'Google: Artificial Intelligence & Productivity',
            issuer: 'Santander Open Academy & Google',
            year: 'Jan 2025',
            badge: 'Google AI · Certified',
            description: 'Modern generative AI integration, prompt engineering architectures, and automated developer productivity pipelines.'
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
        sectionSubtitle: 'Direct Channel & Inquiries',
        heading: "Let's Build Something Exceptional",
        subheading: 'Open for Software Engineering and AI Systems Integration opportunities in Dublin, Ireland or International Remote.',
        text: 'Whether you are hiring for an engineering role, building an AI pipeline, or looking to discuss decoupled software architectures, feel free to reach out directly.',
        email: 'santiagocsdev@gmail.com',
        phone: '+34 654 763 788',
        location: 'Dublin, Ireland',
        locationBadge: 'Available On-Site (Sept 30, 2026) / International Remote',
        emailLabel: 'Direct Email',
        phoneLabel: 'Direct Phone / WhatsApp',
        locationLabel: 'Target Location',
        copyEmail: 'Copy Email',
        emailCopied: 'Copied to Clipboard!',
        sendEmail: 'Send Direct Email',
        callWhatsapp: 'Call / WhatsApp',
        socialsTitle: 'Engineering Profiles',
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
            techStack: [
              { name: 'Python', icon: 'python' },
              { name: 'FastAPI', icon: 'fastapi' },
              { name: 'PyTorch', icon: 'pytorch' },
              { name: 'MONAI', icon: 'monai' },
              { name: 'Docker', icon: 'docker' },
              { name: 'APIs REST', icon: 'fastapi' }
            ]
          }
        ]
      },
      projects: {
        sectionTitle: 'Proyectos Destacados',
        sectionSubtitle: 'Arquitectura de Sistemas y Ejecución Técnica',
        sectionDescription: 'Implementaciones de ingeniería desarrolladas con rigor arquitectónico, desacoplamiento modular y métricas verificadas. Pulsa en cualquier tarjeta para abrir la ficha técnica.',
        inspectPrompt: 'Ver Ficha',
        highlightsTitle: 'Hitos de Ingeniería y Arquitectura',
        techStackTitle: 'Tecnologías y Arquitectura',
        items: [
          {
            id: 'agentic-mcp',
            title: 'Herramientas Agénticas MCP',
            subtitle: 'Model Context Protocol y Ejecución de Herramientas IA',
            badge: 'Sistemas Agénticos · Arquitectura',
            metricBadge: '★ 5.0 · MCP',
            period: '2026',
            image: '/assets/projects/agentic-mcp.jpg',
            accentColor: '#D7340B',
            glowColor: 'rgba(215, 52, 11, 0.40)',
            summary: 'Sistemas agénticos que conectan Modelos de Lenguaje (LLMs) con herramientas locales, bases de datos vectoriales y APIs mediante MCP.',
            fullDescription: 'Diseño e implementación de una red de servidores agénticos conformes al estándar abierto Model Context Protocol (MCP). Permite a modelos de lenguaje (LLMs) interactuar de manera segura y determinista con el sistema operativo, bases de datos vectoriales (Qdrant, pgvector) y servicios corporativos. Incorpora barreras de validación Human-in-the-Loop para evitar comandos destructivos no supervisados, con soporte para streaming y orquestación ReAct.',
            details: [
              'Creación de servidores MCP personalizados que permiten a los LLMs ejecutar de forma segura operaciones deterministas en bases de datos y validación de código.',
              'Configuración de barreras de aprobación Human-in-the-Loop para evitar comandos destructivos no supervisados en entornos de producción.',
              'Integración con bases de datos vectoriales (Qdrant / pgvector) para memoria a largo plazo y recuperación semántica de contexto.',
              'Diseño de grafos de ejecución multi-agente con patrones ReAct para flujos autónomos de ingeniería de software.'
            ],
            techStack: [
              { name: 'MCP', icon: 'mcp' },
              { name: 'Python', icon: 'python' },
              { name: 'FastAPI', icon: 'fastapi' },
              { name: 'PostgreSQL', icon: 'postgresql' },
              { name: 'Agentes IA', icon: 'agentic' }
            ],
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
            accentColor: '#336467',
            glowColor: 'rgba(51, 100, 103, 0.45)',
            summary: 'Pipeline de visión por computador e inferencia de IA en tiempo real para segmentación diagnóstica en entornos clínicos de alta exigencia.',
            fullDescription: 'Desarrollado durante las prácticas curriculares en el Hospital Universitari i Politècnic La Fe de Valencia. El sistema implementa un flujo asistido por IA supervisado (Human-in-the-Loop) para el procesamiento, normalización y segmentación de imágenes médicas. Integra microservicios de inferencia asíncronos de baja latencia con FastAPI respaldados por PyTorch y la librería biomédica MONAI, permitiendo a especialistas clínicos validar anotaciones y acelerar diagnósticos con fiabilidad.',
            details: [
              'Implementación de flujos de trabajo supervisados Human-in-the-Loop para segmentación de imagen médica, normalización y anotación de datasets para fine-tuning de modelos.',
              'Desarrollo de microservicios de preprocesamiento y endpoints REST con FastAPI utilizando Python, OpenCV, PyTorch y MONAI para inferencia en tiempo real.',
              'Inferencia en tiempo real de baja latencia optimizada para cortes tomográficos y de ultrasonido de alta resolución.',
              'Colaboración directa con especialistas clínicos del Hospital La Fe para traducir requerimientos de datos diagnósticos en componentes de software robustos.'
            ],
            techStack: [
              { name: 'Python', icon: 'python' },
              { name: 'FastAPI', icon: 'fastapi' },
              { name: 'PyTorch', icon: 'pytorch' },
              { name: 'MONAI', icon: 'monai' },
              { name: 'Docker', icon: 'docker' }
            ],
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
            glowColor: 'rgba(215, 52, 11, 0.40)',
            summary: 'Una SPA desacoplada impulsada por algoritmos propios de recomendación de entrenamientos y nutrición.',
            fullDescription: 'Desarrollado como Trabajo de Fin de Grado (TFG) obteniendo Matrícula de Honor. Arquitectura totalmente desacoplada compuesta por una API REST construida en Symfony 7 con 33 endpoints asegurados mediante JWT y control de acceso basado en roles (RBAC). Una base de datos MySQL relacional normalizada de 14 tablas alimenta el motor de recomendaciones. Frontend moderno en Angular 19 con Signals reactivos y contenerización modular en Docker Compose.',
            details: [
              'Diseño y normalización de un esquema MySQL de 14 tablas y desarrollo de una API REST con Symfony 7 y 33 endpoints seguros con JWT.',
              'Algoritmo propio de recomendación dinámico que adapta rutinas de entrenamiento y objetivos calóricos según la evolución del usuario.',
              'Frontend desacoplado en Angular 19 con componentes Standalone y Signals para reactividad instantánea.',
              'Despliegue multi-contenedor con Docker Compose (PHP-FPM, Nginx, MySQL) manteniendo flujo Git con feature-branches.'
            ],
            techStack: [
              { name: 'PHP', icon: 'php' },
              { name: 'Symfony', icon: 'symfony' },
              { name: 'Angular', icon: 'angular' },
              { name: 'TypeScript', icon: 'typescript' },
              { name: 'MySQL', icon: 'mysql' },
              { name: 'Docker', icon: 'docker' }
            ],
            link: 'https://github.com/Sacasa01/FitForge',
            linkText: 'Ver Repositorio ↗'
          },
          {
            id: 'land-mapper',
            title: 'Legacy Land Mapper',
            subtitle: 'Motor Geoespacial Concurrente para el Catastro',
            badge: 'GIS Geoespacial · 20 Workers',
            metricBadge: '★ 4.8 · >90% Opt',
            period: '2025',
            image: '/assets/projects/land-mapper.jpg',
            accentColor: '#2B585B',
            glowColor: 'rgba(43, 88, 91, 0.45)',
            summary: 'Pipeline de datos geoespaciales multihilo que reduce el tiempo de consulta de parcelas catastrales en más de un 90%.',
            fullDescription: 'Creado para resolver problemas reales de validación catastral y concentración parcelaria en Galicia. Transforma registros catastrales tabulares en mapas HTML geoespaciales interactivos. El backend en Python implementa concurrencia mediante un pool de 20 workers para consultar la API WFS de la Dirección General del Catastro de España, reduciendo el tiempo de procesamiento masivo en más de un 90%. Genera capas GeoJSON interactivas con cálculo de superficies en tiempo real.',
            details: [
              'Backend multihilo en Python con 20 workers concurrentes que consultan la API WFS del Catastro, reduciendo el tiempo de consulta en más de un 90%.',
              'Tratamiento de datos tabulares mediante Pandas hacia polígonos espaciales GeoJSON enriquecidos con filtros dinámicos.',
              'Mapas interactivos responsivos desarrollados con Leaflet.js con cálculo en tiempo real de perímetros y áreas.',
              'Integración de especificaciones OGC WFS para delimitación parcelaria oficial.'
            ],
            techStack: [
              { name: 'Python', icon: 'python' },
              { name: 'Pandas', icon: 'pandas' },
              { name: 'Leaflet', icon: 'leaflet' },
              { name: 'GeoJSON', icon: 'geojson' }
            ],
            link: 'https://github.com/Sacasa01/legacy-land-mapper',
            linkText: 'Ver Repositorio ↗'
          },
          {
            id: 'homelab',
            title: 'HomeLab y Ecosistema Cloud',
            subtitle: 'Infraestructura Empresarial Autogestionada y GitOps',
            badge: 'DevOps y Cloud · Zero-Trust',
            metricBadge: '★ 4.9 · 99.9% Up',
            period: '2025 – 2026',
            image: '/assets/projects/homelab.jpg',
            accentColor: '#336467',
            glowColor: 'rgba(51, 100, 103, 0.45)',
            summary: 'Servidor local de producción con integración continua GitOps, red mallada Zero-Trust mediante Tailscale e inferencia de IA local por GPU.',
            fullDescription: 'Transformación de hardware dedicado en un servidor cloud autogestionado de nivel empresarial siguiendo prácticas modernas de DevOps. Orquestación multi-contenedor declarativa con Docker Compose v2, despliegue continuo GitOps con GitHub Actions y red privada segura punto a punto cifrada con Tailscale sin apertura de puertos en router. Aloja modelos de lenguaje locales (Ollama, Whisper) acelerados por GPU NVIDIA.',
            details: [
              'Flujos GitOps automatizados con GitHub Actions: cada commit despliega y comprueba la salud de los servicios.',
              'Red privada cifrada Zero-Trust con Tailscale para acceso remoto seguro a nivel mundial sin exponer puertos externos.',
              'Modelos de IA locales privados (Ollama, Whisper) acelerados por GPU NVIDIA dedicada para procesamiento sin latencia.',
              'Estructura modular en Docker Compose con backups automáticos, proxy inverso y monitorización de disponibilidad.'
            ],
            techStack: [
              { name: 'Docker', icon: 'docker' },
              { name: 'Linux', icon: 'linux' },
              { name: 'Tailscale', icon: 'tailscale' },
              { name: 'GitOps', icon: 'git' }
            ],
            link: 'https://github.com/Sacasa01/homelab-ecosystem',
            linkText: 'Ver Infraestructura ↗'
          }
        ]
      },
      skills: {
        sectionTitle: 'Arquitectura de Habilidades',
        sectionSubtitle: 'Grafo de Nodos Vectoriales y Ecosistema Tecnológico',
        sectionDescription: 'Red interactiva e interconectada que mapea desde el núcleo Full-Stack hasta sistemas de IA autónomos, bases de datos y DevOps contenerizado. Pasa el cursor o pulsa en cualquier nodo para ver detalles.',
        selectPrompt: 'Pulsa o pasa el cursor por los nodos vectoriales para inspeccionar especificaciones técnicas y experiencia práctica.',
        domainsTitle: 'Clusters de Arquitectura',
        spokenSectionTitle: 'Movilidad Internacional y Competencia Comunicativa',
        spokenSectionSubtitle: 'Fluidez y Capacidades Idiomáticas para Reubicación y Equipos Globales',
        spokenNotice: 'Totalmente preparado para incorporación presencial inmediata en Dublín desde el 30 de Septiembre de 2026.',
        items: [
          { id: 'html-css', name: 'HTML5 y CSS3', category: 'core', categoryLabel: 'Estándares Web', subtitle: 'HTML Semántico · Tailwind CSS · Responsive', badge: 'Experto' },
          { id: 'python', name: 'Python 3', category: 'core', categoryLabel: 'Backend Troncal e IA', subtitle: 'FastAPI · PyTorch · Pandas · MONAI', badge: 'Avanzado' },
          { id: 'php', name: 'PHP 8', category: 'core', categoryLabel: 'Backend Troncal', subtitle: 'Symfony 7 · Arquitectura Limpia · RBAC', badge: 'Avanzado' },
          { id: 'typescript', name: 'TypeScript', category: 'core', categoryLabel: 'Frontend y Node', subtitle: 'Angular 19 · Tipado Estricto · Node.js', badge: 'Avanzado' },
          { id: 'angular', name: 'Angular 19', category: 'frameworks', categoryLabel: 'Arquitectura Frontend', subtitle: 'Componentes Standalone · Signals · RxJS', badge: 'v19 Standalone' },
          { id: 'docker', name: 'Docker y Compose', category: 'devops', categoryLabel: 'Contenedores', subtitle: 'Builds Multi-etapa · Alpine · Redes', badge: 'DevOps' },
          { id: 'aws', name: 'Servicios Cloud AWS', category: 'devops', categoryLabel: 'Servicios Cloud', subtitle: 'EC2 · S3 · RDS · Lambda · IAM', badge: 'Practitioner' },
          { id: 'sql', name: 'MySQL y PostgreSQL', category: 'database', categoryLabel: 'Bases de Datos', subtitle: 'Normalización 3FN · Indexación · pgvector', badge: 'Bases de Datos' },
          { id: 'git', name: 'Git y GitHub Actions', category: 'devops', categoryLabel: 'Automatización', subtitle: 'GitOps · Conventional Commits · CI/CD', badge: 'CI/CD' },
          { id: 'mcp', name: 'Model Context Protocol', category: 'ai', categoryLabel: 'Sistemas de IA', subtitle: 'Servidores MCP · Ejecución de Herramientas · Seguridad LLM', badge: 'Anthropic' },
          { id: 'pytorch', name: 'PyTorch y MONAI', category: 'ai', categoryLabel: 'Deep Learning', subtitle: 'Imagen Médica · Segmentación Neuronal · GPU', badge: 'IA Clínica' },
          { id: 'agentic', name: 'Flujos Agénticos ReAct', category: 'ai', categoryLabel: 'IA Autónoma', subtitle: 'Razonamiento en Pasos · Selección de Herramientas · HITL', badge: 'Agentes' },
          { id: 'lang-en', name: 'Inglés (C1)', category: 'language', categoryLabel: 'Idiomas', subtitle: 'Certificado C1 · Fluidez Profesional Completa', badge: 'Nivel C1' },
          { id: 'lang-es', name: 'Español (C2)', category: 'language', categoryLabel: 'Idiomas', subtitle: 'Hablante Nativo · Fluidez Bilingüe Plena', badge: 'Nativo' },
          { id: 'lang-va', name: 'Valenciano (C2)', category: 'language', categoryLabel: 'Idiomas', subtitle: 'Lengua Cooficial Regional Nativa', badge: 'Nativo' }
        ]
      },
      education: {
        sectionTitle: 'Formación Académica',
        sectionSubtitle: 'Progresión Académica · Línea de Tiempo de Abajo hacia Arriba',
        timelineBadge: 'Cronología Ascendente (Abajo = Más antigua → Arriba = Más nueva)',
        journeyTitle: 'Trayectoria Real de Ingeniería y Formación',
        journeySubtitle: '2024 – 2027 · Cronología Continua de Progresión Técnica',
        journeyMilestones: [
          {
            year: '2024',
            title: 'CFGS DAW — Desarrollo de Aplicaciones Web',
            institution: 'La Florida Universitaria, Valencia',
            category: 'academic',
            badge: 'Base Troncal · Nota 7.0',
            description: 'Inicio de la ingeniería de software profesional: PHP 8/Symfony 7, esquemas relacionales MySQL y TypeScript moderno.',
            icon: 'academic'
          },
          {
            year: '2025',
            title: 'Certificaciones Cloud AWS y Google IA',
            institution: 'Amazon Web Services & Santander / Google',
            category: 'certification',
            badge: 'AWS & Google IA Certificados',
            description: 'Taller oficial AWS Cloud Practitioner y fundamentos, más certificación en Inteligencia Artificial y Productividad de Google.',
            icon: 'cert'
          },
          {
            year: '2026',
            title: 'Prácticas de IA Clínica e Inglés C1 (IELTS 8.0)',
            institution: 'Hospital La Fe / Fertoolity & Examen Oficial IELTS',
            category: 'practice',
            badge: 'FCT Hospitalaria & C1 IELTS',
            description: 'Prácticas hospitalarias con pipelines de visión e IA médica con PyTorch/MONAI, y obtención de la certificación C1 de inglés.',
            icon: 'clinical'
          },
          {
            year: '2026 – 2027',
            title: 'Grado BSc (Hons) in Computer Science (Top-Up)',
            institution: 'Canterbury Christ Church University / MSMK',
            category: 'degree',
            badge: 'Grado Universitario Actual',
            description: 'Grado británico impartido 100% en inglés: Ingeniería Avanzada de Software, Sistemas Distribuidos e Integración de IA.',
            icon: 'university'
          }
        ],
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
            degree: 'CFGS DAW – Desarrollo de Aplicaciones Web',
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
            title: 'Inglés: Certificación C1 (IELTS 8.0 Equivalente)',
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
        heading: 'Construyamos Algo Excepcional',
        subheading: 'Disponible para roles de ingeniería de software e integración de sistemas de IA en Dublín, Irlanda o remoto internacional.',
        text: 'Si buscas incorporar talento técnico en backend, construir pipelines de IA o conversar sobre arquitectura de sistemas desacoplados, mis vías de contacto están abiertas. Escríbeme directamente.',
        email: 'santiagocsdev@gmail.com',
        phone: '+34 654 763 788',
        location: 'Dublín, Irlanda',
        locationBadge: 'Disponible On-Site (30 Sep 2026) / Remoto Internacional',
        emailLabel: 'Correo Electrónico',
        phoneLabel: 'Teléfono / WhatsApp',
        locationLabel: 'Ubicación Objetivo',
        copyEmail: 'Copiar Correo',
        emailCopied: '¡Copiado al portapapeles!',
        sendEmail: 'Enviar Mensaje Directo',
        callWhatsapp: 'Llamar o WhatsApp',
        socialsTitle: 'Perfiles Profesionales',
        downloadCv: 'Curriculum Vitae (PDF)'
      },
      footer: {
        rights: 'Todos los derechos reservados.',
        builtWith: 'Desarrollado con Angular 19, Tailwind CSS y principios Clean Architecture.'
      }
    }
  };
  skillNodes: SkillNode[] = [
    // 01 FRONTEND
    {
      id: 'angular',
      name: 'Angular 19',
      shortName: 'Angular',
      domain: 'frontend',
      domainLabelEn: 'Frontend Architecture',
      domainLabelEs: 'Arquitectura Frontend',
      badge: 'v19 Standalone',
      color: '#DD0031',
      icon: 'angular',
      descEn: 'Component architecture with reactive Signals, control flow, Standalone APIs, and performance optimizations.',
      descEs: 'Arquitectura de componentes con Signals reactivos, nuevo flujo de control, APIs Standalone y optimización de rendimiento.',
      highlightsEn: ['FitForge SPA architecture', 'Reactive state with Signals', 'Strict TypeScript typings'],
      highlightsEs: ['Arquitectura SPA en FitForge', 'Estado reactivo con Signals', 'Tipado estricto con TypeScript']
    },
    {
      id: 'typescript',
      name: 'TypeScript',
      shortName: 'TypeScript',
      domain: 'frontend',
      domainLabelEn: 'Frontend Architecture',
      domainLabelEs: 'Arquitectura Frontend',
      badge: 'Strict Typings',
      color: '#3178C6',
      icon: 'typescript',
      descEn: 'Enterprise software development using advanced generics, interfaces, strict null checks, and modern ECMAScript standards.',
      descEs: 'Desarrollo corporativo con genéricos avanzados, interfaces, comprobación estricta de nulos y estándares ECMAScript modernos.',
      highlightsEn: ['Type-safe API integrations', 'Clean code & OOP patterns', 'Angular & Node.js codebases'],
      highlightsEs: ['Integraciones de API seguras', 'Patrones Clean Code y POO', 'Bases de código Angular y Node.js']
    },
    {
      id: 'tailwind',
      name: 'Tailwind CSS',
      shortName: 'Tailwind',
      domain: 'frontend',
      domainLabelEn: 'Frontend Architecture',
      domainLabelEs: 'Arquitectura Frontend',
      badge: 'Design Systems',
      color: '#06B6D4',
      icon: 'tailwind',
      descEn: 'Design token systems, responsive layouts, CSS grid, fluid typography, and dark/light theme switching.',
      descEs: 'Sistemas de design tokens, maquetación responsiva, CSS Grid, tipografía fluida y alternancia de temas claro/oscuro.',
      highlightsEn: ['Editorial boxed layouts', 'Micro-interactions & transitions', 'Accessible color contrast'],
      highlightsEs: ['Layouts boxed editoriales', 'Micro-interacciones y transiciones', 'Contraste accesible de color']
    },
    // 02 BACKEND
    {
      id: 'python',
      name: 'Python 3',
      shortName: 'Python',
      domain: 'backend',
      domainLabelEn: 'Backend Microservices',
      domainLabelEs: 'Microservicios Backend',
      badge: 'High-Throughput',
      color: '#3776AB',
      icon: 'python',
      descEn: 'AsyncIO programming, multithreading, concurrent task execution, data pipelines, and numerical algorithms.',
      descEs: 'Programación asíncrona AsyncIO, multihilo, ejecución de tareas concurrentes, pipelines de datos y algoritmos numéricos.',
      highlightsEn: ['20-worker Cadastre pipeline', 'Pandas spatial GeoJSON parsing', 'Clinical inference microservices'],
      highlightsEs: ['Pipeline catastral con 20 workers', 'Parseo GeoJSON espacial con Pandas', 'Microservicios de inferencia clínica']
    },
    {
      id: 'fastapi',
      name: 'FastAPI',
      shortName: 'FastAPI',
      domain: 'backend',
      domainLabelEn: 'Backend Microservices',
      domainLabelEs: 'Microservicios Backend',
      badge: 'Async REST APIs',
      color: '#009688',
      icon: 'fastapi',
      descEn: 'High-speed asynchronous RESTful APIs with Pydantic data validation, OpenAPI specs, and dependency injection.',
      descEs: 'APIs RESTful asíncronas de alta velocidad con validación de datos por Pydantic, OpenAPI e inyección de dependencias.',
      highlightsEn: ['Low-latency GPU endpoints', 'Automated Swagger documentation', 'Asynchronous streaming payloads'],
      highlightsEs: ['Endpoints GPU de baja latencia', 'Documentación Swagger automática', 'Streaming de datos asíncrono']
    },
    {
      id: 'php',
      name: 'PHP 8 / Symfony 7',
      shortName: 'Symfony / PHP',
      domain: 'backend',
      domainLabelEn: 'Backend Microservices',
      domainLabelEs: 'Microservicios Backend',
      badge: 'Enterprise APIs',
      color: '#777BB4',
      icon: 'symfony',
      descEn: 'Decoupled REST API engineering, Domain-Driven Design principles, JWT stateless authentication, and fine-grained RBAC.',
      descEs: 'Ingeniería de APIs REST desacopladas, principios DDD, autenticación sin estado con JWT y control de acceso RBAC granular.',
      highlightsEn: ['33 secured FitForge endpoints', 'Doctrine ORM & migrations', 'Clean Architecture separation'],
      highlightsEs: ['33 endpoints seguros en FitForge', 'Doctrine ORM y migraciones', 'Separación Clean Architecture']
    },
    // 03 DATABASE
    {
      id: 'mysql',
      name: 'MySQL 8',
      shortName: 'MySQL',
      domain: 'database',
      domainLabelEn: 'Data & Storage',
      domainLabelEs: 'Datos y Almacenamiento',
      badge: '3NF Normalized',
      color: '#00758F',
      icon: 'mysql',
      descEn: 'Relational data modeling, 3NF schema normalization, ACID transaction integrity, and index optimization.',
      descEs: 'Modelado de datos relacional, normalización en 3NF, integridad transaccional ACID y optimización de índices.',
      highlightsEn: ['14-table FitForge schema', 'Foreign key cascades & constraints', 'Query execution plan analysis'],
      highlightsEs: ['Esquema de 14 tablas en FitForge', 'Claves foráneas y restricciones', 'Análisis de planes de ejecución']
    },
    {
      id: 'postgresql',
      name: 'PostgreSQL & pgvector',
      shortName: 'PostgreSQL',
      domain: 'database',
      domainLabelEn: 'Data & Storage',
      domainLabelEs: 'Datos y Almacenamiento',
      badge: 'Vector Search',
      color: '#336791',
      icon: 'postgresql',
      descEn: 'Advanced relational modeling with vector search extensions for semantic document retrieval and embedding stores.',
      descEs: 'Modelado relacional avanzado con extensiones de búsqueda vectorial para recuperación semántica de documentos y embeddings.',
      highlightsEn: ['Cosine distance indexing', 'Vector embeddings integration', 'PostGIS spatial queries'],
      highlightsEs: ['Indexación por distancia coseno', 'Integración de embeddings vectoriales', 'Consultas espaciales PostGIS']
    },
    {
      id: 'pandas',
      name: 'Pandas & GeoJSON',
      shortName: 'Pandas',
      domain: 'database',
      domainLabelEn: 'Data & Storage',
      domainLabelEs: 'Datos y Almacenamiento',
      badge: 'Data Pipelines',
      color: '#150458',
      icon: 'pandas',
      descEn: 'Tabular ETL data wrangling, GeoJSON feature generation, and Cadastre WFS XML transformation.',
      descEs: 'Extracción, transformación y carga (ETL) de datos tabulares, generación de GeoJSON y transformación XML de catastro.',
      highlightsEn: ['Batch cadastral record parsing', 'Polygon surface area computation', 'High-speed CSV/Excel digestion'],
      highlightsEs: ['Parseo por lotes de parcelas', 'Cálculo de superficies de polígonos', 'Ingestión rápida de CSV/Excel']
    },
    // 04 DEVOPS & CLOUD
    {
      id: 'docker',
      name: 'Docker & Compose v2',
      shortName: 'Docker',
      domain: 'devops',
      domainLabelEn: 'DevOps & Infrastructure',
      domainLabelEs: 'DevOps e Infraestructura',
      badge: 'Multi-Stage',
      color: '#2496ED',
      icon: 'docker',
      descEn: 'Containerizing multi-service stacks (Nginx, PHP-FPM, MySQL, FastAPI), multi-stage builds, and volume persistence.',
      descEs: 'Contenerización de stacks multiservicio (Nginx, PHP-FPM, MySQL, FastAPI), builds multi-stage y persistencia de volúmenes.',
      highlightsEn: ['Reproducible local & prod environments', 'Minimal Alpine base images', 'Network isolation & security'],
      highlightsEs: ['Entornos reproducibles locales y prod', 'Imágenes base mínimas con Alpine', 'Aislamiento de redes y seguridad']
    },
    {
      id: 'aws',
      name: 'AWS Cloud',
      shortName: 'AWS Cloud',
      domain: 'devops',
      domainLabelEn: 'DevOps & Infrastructure',
      domainLabelEs: 'DevOps e Infraestructura',
      badge: 'Cloud Architecture',
      color: '#FF9900',
      icon: 'aws',
      descEn: 'Hands-on foundational architecture across EC2, S3 bucket storage, RDS managed databases, and serverless Lambda functions.',
      descEs: 'Arquitectura fundamental práctica en EC2, almacenamiento S3, bases de datos gestionadas en RDS y funciones Lambda.',
      highlightsEn: ['Certified AWS Cloud Workshop', 'IAM access policies & security', 'S3 asset distribution'],
      highlightsEs: ['Taller oficial certificado de AWS', 'Políticas IAM y seguridad', 'Distribución de assets en S3']
    },
    {
      id: 'git',
      name: 'GitOps & CI/CD',
      shortName: 'GitOps',
      domain: 'devops',
      domainLabelEn: 'DevOps & Infrastructure',
      domainLabelEs: 'DevOps e Infraestructura',
      badge: 'Automated Pipelines',
      color: '#F05032',
      icon: 'git',
      descEn: 'Feature-branch workflow, conventional commits, and automated continuous deployment with GitHub Actions.',
      descEs: 'Flujo de trabajo con ramas temáticas, conventional commits y despliegue continuo automatizado con GitHub Actions.',
      highlightsEn: ['GitOps pipeline on self-hosted server', 'Automated test suites on PR', 'Linting & bundle verification'],
      highlightsEs: ['Pipeline GitOps en servidor propio', 'Suites de tests automatizados en PR', 'Linters y comprobación de bundles']
    },
    // 05 AI SYSTEMS & AGENTS
    {
      id: 'mcp',
      name: 'Model Context Protocol (MCP)',
      shortName: 'MCP Ecosystem',
      domain: 'ai',
      domainLabelEn: 'AI Systems & Agents',
      domainLabelEs: 'Sistemas de IA y Agentes',
      badge: 'Anthropic Open Standard',
      color: '#D7340B',
      icon: 'mcp',
      descEn: 'Engineering custom MCP servers exposing tools, resources, and database queries to LLMs with strict safety boundaries.',
      descEs: 'Creación de servidores MCP personalizados que exponen herramientas, recursos y consultas a LLMs con validación estricta.',
      highlightsEn: ['Local & remote tool execution', 'Human-in-the-Loop guardrails', 'Deterministic JSON-RPC schema'],
      highlightsEs: ['Ejecución de herramientas local y remota', 'Barreras de seguridad Human-in-the-Loop', 'Esquema determinista JSON-RPC']
    },
    {
      id: 'pytorch',
      name: 'PyTorch & MONAI',
      shortName: 'PyTorch / MONAI',
      domain: 'ai',
      domainLabelEn: 'AI Systems & Agents',
      domainLabelEs: 'Sistemas de IA y Agentes',
      badge: 'Clinical Deep Learning',
      color: '#EE4C2C',
      icon: 'pytorch',
      descEn: 'Medical image preprocessing, organ segmentation pipelines, tensor transformations, and GPU-accelerated inference.',
      descEs: 'Preprocesamiento de imagen médica, pipelines de segmentación de órganos, transformaciones de tensores e inferencia por GPU.',
      highlightsEn: ['Hospital La Fe clinical pipeline', 'MONAI neural segmentation models', 'Real-time inference microservice'],
      highlightsEs: ['Pipeline clínico en el Hospital La Fe', 'Modelos neuronales MONAI de segmentación', 'Microservicio de inferencia en tiempo real']
    },
    {
      id: 'agentic',
      name: 'ReAct Agentic Workflows',
      shortName: 'AI Agents',
      domain: 'ai',
      domainLabelEn: 'AI Systems & Agents',
      domainLabelEs: 'Sistemas de IA y Agentes',
      badge: 'Autonomous Systems',
      color: '#336467',
      icon: 'agentic',
      descEn: 'Autonomous multi-step reasoning, dynamic tool selection, memory retention, and Human-in-the-Loop approval patterns.',
      descEs: 'Razonamiento autónomo en múltiples pasos, selección dinámica de herramientas, retención de memoria y patrones Human-in-the-Loop.',
      highlightsEn: ['Structured function calling', 'Self-correcting code execution', 'Enterprise approval gates'],
      highlightsEs: ['Llamada estructurada a funciones', 'Ejecución auto-correctiva de código', 'Compuertas de aprobación corporativas']
    }
  ];

  skillClusters = computed<SkillCluster[]>(() => [
    {
      id: 'backend',
      domainNumber: '01',
      nameEn: 'Backend Architecture',
      nameEs: 'Arquitectura Backend',
      accentColor: '#336467',
      skills: this.skillNodes.filter(s => s.domain === 'backend')
    },
    {
      id: 'ai',
      domainNumber: '02',
      nameEn: 'AI Systems & MCP Agents',
      nameEs: 'Sistemas de IA y MCP',
      accentColor: '#D7340B',
      skills: this.skillNodes.filter(s => s.domain === 'ai')
    },
    {
      id: 'frontend',
      domainNumber: '03',
      nameEn: 'Frontend Architecture',
      nameEs: 'Arquitectura Frontend',
      accentColor: '#3178C6',
      skills: this.skillNodes.filter(s => s.domain === 'frontend')
    },
    {
      id: 'devops',
      domainNumber: '04',
      nameEn: 'DevOps & Cloud Systems',
      nameEs: 'DevOps e Infraestructura',
      accentColor: '#2496ED',
      skills: this.skillNodes.filter(s => s.domain === 'devops')
    },
    {
      id: 'database',
      domainNumber: '05',
      nameEn: 'Data Modeling & GIS',
      nameEs: 'Modelado de Datos y GIS',
      accentColor: '#00758F',
      skills: this.skillNodes.filter(s => s.domain === 'database')
    }
  ]);

  spokenLanguages: SpokenLanguage[] = [
    {
      id: 'en',
      nameEn: 'English',
      nameEs: 'Inglés',
      cefr: 'C1 Advanced',
      levelBadge: 'Full Professional Proficiency (IELTS 8.0 Eq.)',
      statusBadgeEn: 'Target: Dublin On-Site (Sep 2026)',
      statusBadgeEs: 'Objetivo: Presencial en Dublín (Sep 2026)',
      descEn: 'Official IELTS 8.0 standard. Completely fluent in technical architecture debates, daily async communication, code reviews, and international team leadership.',
      descEs: 'Nivel equivalente a IELTS 8.0 / C1 Oficial. Totalmente fluido en debates de arquitectura técnica, revisiones de código, reuniones diarias y liderazgo técnico internacional.',
      flag: '🇬🇧',
      pdfUrl: '/assets/santiago-castro-cate-c1.pdf',
      pdfLabelEn: 'View Official CATE C1 Statement (PDF) ↗',
      pdfLabelEs: 'Ver Certificado Oficial CATE C1 (PDF) ↗'
    },
    {
      id: 'es',
      nameEn: 'Spanish',
      nameEs: 'Español',
      cefr: 'C2 Native',
      levelBadge: 'Native Bilingual',
      statusBadgeEn: 'Mother Tongue',
      statusBadgeEs: 'Lengua Materna',
      descEn: 'Native speaker with full academic, literary, and technical proficiency.',
      descEs: 'Hablante nativo con dominio académico, técnico y profesional completo.',
      flag: '🇪🇸'
    },
    {
      id: 'va',
      nameEn: 'Valencian / Catalan',
      nameEs: 'Valenciano / Catalán',
      cefr: 'C2 Native',
      levelBadge: 'Co-official Native',
      statusBadgeEn: 'Regional Native',
      statusBadgeEs: 'Nativo Regional',
      descEn: 'Co-official regional mother tongue in the Valencian Community with full bilingual fluency.',
      descEs: 'Lengua cooficial en la Comunidad Valenciana con competencia bilingüe nativa completa.',
      flag: '🦇'
    }
  ];

  t = computed(() => this.content[this.lang()]);

  scrollToTop(event?: Event) {
    if (event) {
      event.preventDefault();
    }
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  toggleLang() {
    if (typeof document !== 'undefined') {
      const elements = document.querySelectorAll('.lang-fade');
      if (elements.length > 0) {
        gsap.to(elements, {
          opacity: 0,
          duration: 0.16,
          ease: 'power1.in',
          onComplete: () => {
            this.lang.update(current => current === 'en' ? 'es' : 'en');
            gsap.to(elements, {
              opacity: 1,
              duration: 0.26,
              ease: 'power1.out'
            });
          }
        });
        return;
      }
    }
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
    if (this.selectedSkillNode()) {
      this.selectedSkillNode.set(null);
    }
  }

  activeInquiryTopic = signal<'dublin-hiring' | 'clinical-ai' | 'backend-arch'>('dublin-hiring');

  get mailtoSubject(): string {
    const subjects = {
      en: {
        'dublin-hiring': 'Software Engineering Opportunity in Dublin — Santiago Castro Salt',
        'clinical-ai': 'Clinical AI & Medical Imaging Diagnostics Inquiry — Santiago Castro Salt',
        'backend-arch': 'Backend Microservices & MCP Integration — Santiago Castro Salt'
      },
      es: {
        'dublin-hiring': 'Oportunidad de Ingeniería de Software en Dublín — Santiago Castro Salt',
        'clinical-ai': 'Consulta de IA Clínica e Imagen Médica — Santiago Castro Salt',
        'backend-arch': 'Consulta de Arquitectura Backend y MCP — Santiago Castro Salt'
      }
    };
    return encodeURIComponent(subjects[this.lang()][this.activeInquiryTopic()]);
  }

  setInquiryTopic(topic: 'dublin-hiring' | 'clinical-ai' | 'backend-arch') {
    this.activeInquiryTopic.set(topic);
  }

  openProjectModal(project: ProjectItem) {
    this.isClosingModal.set(false);
    this.selectedProject.set(project);
    this.displayedProject.set(project);
    if (typeof document !== 'undefined') {
      document.body.style.overflow = 'hidden';
      requestAnimationFrame(() => {
        const backdrop = document.querySelector('.modal-backdrop-layer');
        const card = document.querySelector('.modal-card-layer');
        if (backdrop && card) {
          gsap.fromTo(backdrop, { opacity: 0 }, { opacity: 1, duration: 0.25, ease: 'power2.out' });
          gsap.fromTo(card, 
            { opacity: 0, scale: 0.94, y: 20 }, 
            { opacity: 1, scale: 1, y: 0, duration: 0.3, ease: 'power3.out' }
          );
        }
      });
    }
  }

  closeProjectModal() {
    if (this.isClosingModal()) return;
    this.selectedProject.set(null);
    this.isClosingModal.set(true);
    if (typeof document !== 'undefined') {
      document.body.style.overflow = '';
      const backdrop = document.querySelector('.modal-backdrop-layer');
      const card = document.querySelector('.modal-card-layer');
      if (backdrop && card) {
        gsap.to(backdrop, { opacity: 0, duration: 0.2, ease: 'power2.in' });
        gsap.to(card, {
          opacity: 0,
          scale: 0.95,
          y: 12,
          duration: 0.2,
          ease: 'power2.in',
          onComplete: () => {
            this.displayedProject.set(null);
            this.isClosingModal.set(false);
          }
        });
        return;
      }
    }
    this.displayedProject.set(null);
    this.isClosingModal.set(false);
  }

  selectSkillNode(node: SkillNode) {
    if (this.selectedSkillNode()?.id === node.id) {
      this.selectedSkillNode.set(null);
    } else {
      this.selectedSkillNode.set(node);
    }
  }
}
