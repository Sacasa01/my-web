import { Component, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';

export type Lang = 'en' | 'es';
export type Theme = 'light' | 'dark';

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

  // Dynamic theme colors matching background and contrast
  bgColor = computed(() => this.theme() === 'light' ? '#ece8e8' : '#0f1117');
  cardBg = computed(() => this.theme() === 'light' ? '#ffffff' : '#171a23');
  cardBorder = computed(() => this.theme() === 'light' ? 'rgba(0, 0, 0, 0.08)' : 'rgba(255, 255, 255, 0.08)');
  textColor = computed(() => this.theme() === 'light' ? '#111216' : '#f8f8fb');
  mutedColor = computed(() => this.theme() === 'light' ? '#5a5858' : '#9ea2b0');
  tagBg = computed(() => this.theme() === 'light' ? 'rgba(0, 0, 0, 0.05)' : 'rgba(255, 255, 255, 0.06)');

  // Bilingual content structured in exact requested order
  content = {
    en: {
      nav: {
        experience: 'Experience',
        projects: 'Projects',
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
        items: [
          {
            title: 'FitForge',
            subtitle: 'Full-Stack Fitness Platform & Recommendation Engine',
            badge: 'TFG Project · Sole Developer',
            period: '2025 – 2026',
            summary: 'A full-stack fitness SPA powered by a custom workout and nutrition recommendation algorithm.',
            details: [
              'Architected a 14-table normalized MySQL schema and a Symfony 7 REST API featuring 33 secured endpoints, JWT authentication, and fine-grained RBAC.',
              'Designed a clean, standalone Angular 19 frontend with reactive signals and modular components.',
              'Containerized the complete deployment with Docker Compose (PHP-FPM, Nginx, MySQL) maintaining a feature-branch Git workflow.'
            ],
            techStack: ['PHP 8.2', 'Symfony 7', 'Angular 19', 'MySQL', 'Docker Compose', 'JWT Auth', 'RBAC', 'REST API'],
            link: 'https://github.com/Sacasa01/FitForge',
            linkText: 'View Repository ↗'
          },
          {
            title: 'Legacy Land Mapper',
            subtitle: 'Geospatial Cadastral Automation Tool',
            badge: 'Personal Project · Sole Developer',
            period: '2025',
            summary: 'Automated geospatial data pipeline converting Spanish cadastral records into responsive interactive HTML maps.',
            details: [
              'Engineered a multi-threaded Python backend with 20 concurrent workers querying the Spanish Cadastre WFS API, cutting bulk query times by over 90%.',
              'Processed raw tabular cadastral records with Pandas into enriched GeoJSON spatial polygons with customizable layer toggles and real-time filtering.'
            ],
            techStack: ['Python 3', 'Pandas', 'Leaflet.js', 'GeoJSON', 'Cadastre WFS API', 'Multi-Threading'],
            link: 'https://github.com/Sacasa01/legacy-land-mapper',
            linkText: 'View Repository ↗'
          },
          {
            title: 'MCP Agentic Tools & AI Integrations',
            subtitle: 'Model Context Protocol & Autonomous Tool Calling',
            badge: 'Architecture & System Integration',
            period: '2026',
            summary: 'Engineered agentic systems connecting Large Language Models to local tools, vector databases, and databases via MCP protocols.',
            details: [
              'Built custom Model Context Protocol (MCP) servers enabling LLMs to securely execute deterministic database operations and code validation.',
              'Configured Human-in-the-Loop approval barriers to prevent unauthorized destructive commands in production agents.'
            ],
            techStack: ['Model Context Protocol (MCP)', 'Python', 'Function Calling', 'Vector DBs', 'System Integration'],
            link: 'https://github.com/Sacasa01',
            linkText: 'Explore GitHub Profile ↗'
          }
        ]
      },
      education: {
        sectionTitle: 'Education',
        sectionSubtitle: 'Academic Credentials & Formal Qualifications',
        items: [
          {
            degree: 'BSc (Hons) in Computer Science (Top-Up)',
            institution: 'Canterbury Christ Church University (via MSMK University, Madrid)',
            period: 'Sep 2026 – Jun 2027',
            badge: 'Taught 100% in English',
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
            description: 'Advanced academic and professional English fluency for international communication and engineering leadership.'
          },
          {
            title: 'AWS Certified Cloud Practitioner',
            issuer: 'Amazon Web Services (AWS)',
            year: '2025',
            description: 'Cloud architecture fundamentals, security compliance, serverless primitives, and deployment strategies.'
          },
          {
            title: 'Google: Artificial Intelligence & Productivity',
            issuer: 'Santander Open Academy',
            year: 'Jan 2025',
            description: 'Modern generative AI integration, prompt design, and automated developer productivity workflows.'
          },
          {
            title: 'Cloud Computing: Applied Infrastructure & Deployment',
            issuer: 'Florida Universitària',
            year: 'May 2026',
            description: 'Practical Linux server administration, container networking, and continuous deployment workflows.'
          },
          {
            title: 'Target Credential: AWS Certified AI Practitioner (AIF-C01)',
            issuer: 'AWS Cloud & Bedrock Track',
            year: 'In Progress (2026)',
            description: 'Deepening production enterprise machine learning and foundation model deployments with Amazon Bedrock.'
          }
        ]
      },
      contact: {
        sectionTitle: 'Contact',
        sectionSubtitle: "Let's Build Something Impactful",
        heading: 'Ready to connect?',
        text: 'I am actively seeking software engineering and AI systems integration opportunities in Dublin, Ireland or international remote. Whether you have a challenging backend role, an AI pipeline project, or simply want to chat technology, my inbox is open.',
        emailLabel: 'Direct Email',
        phoneLabel: 'Direct Phone',
        locationLabel: 'Base Location',
        copyEmail: 'Copy Email',
        emailCopied: 'Copied to clipboard!',
        sendEmail: 'Send Email Message',
        downloadCv: 'Download Curriculum Vitae (PDF)'
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
        items: [
          {
            title: 'FitForge',
            subtitle: 'Plataforma Full-Stack de Fitness y Motor de Recomendación',
            badge: 'Proyecto Final de Grado (TFG) · Único Desarrollador',
            period: '2025 – 2026',
            summary: 'SPA completa impulsada por un algoritmo propio de recomendación de entrenamientos y planes nutricionales.',
            details: [
              'Arquitectura de base de datos MySQL normalizada de 14 tablas y API REST con Symfony 7 (33 endpoints, autenticación JWT y control de acceso RBAC).',
              'Frontend desacoplado en Angular 19 standalone con Signals reactivos y componentes modulares.',
              'Entorno completo contenerizado con Docker Compose (PHP-FPM, Nginx, MySQL) siguiendo un flujo estricto de ramas Git.'
            ],
            techStack: ['PHP 8.2', 'Symfony 7', 'Angular 19', 'MySQL', 'Docker Compose', 'JWT Auth', 'RBAC', 'API REST'],
            link: 'https://github.com/Sacasa01/FitForge',
            linkText: 'Ver Repositorio ↗'
          },
          {
            title: 'Legacy Land Mapper',
            subtitle: 'Herramienta de Automatización Geoespacial Catastral',
            badge: 'Proyecto Personal · Único Desarrollador',
            period: '2025',
            summary: 'Pipeline de automatización geoespacial que convierte registros catastrales de Excel/CSV en mapas HTML interactivos y responsivos.',
            details: [
              'Backend multihilo en Python con 20 workers concurrentes consultando la API WFS del Catastro, reduciendo tiempos de consulta en más del 90%.',
              'Procesamiento de datos espaciales crudos con Pandas hacia geometrías GeoJSON enriquecidas con filtrado y capas en tiempo real.'
            ],
            techStack: ['Python 3', 'Pandas', 'Leaflet.js', 'GeoJSON', 'API WFS Catastro', 'Multithreading'],
            link: 'https://github.com/Sacasa01/legacy-land-mapper',
            linkText: 'Ver Repositorio ↗'
          },
          {
            title: 'Herramientas Agénticas MCP e Integración IA',
            subtitle: 'Model Context Protocol y Ejecución de Herramientas Autónomas',
            badge: 'Arquitectura e Integración de Sistemas',
            period: '2026',
            summary: 'Sistemas agénticos que conectan Modelos de Lenguaje (LLMs) con herramientas locales, bases de datos vectoriales y APIs mediante MCP.',
            details: [
              'Creación de servidores MCP personalizados que permiten a los LLMs ejecutar de forma segura operaciones deterministas en bases de datos y validación de código.',
              'Configuración de barreras de aprobación Human-in-the-Loop para evitar comandos destructivos no supervisados en entornos de producción.'
            ],
            techStack: ['Model Context Protocol (MCP)', 'Python', 'Function Calling', 'Vector DBs', 'Integración de Sistemas'],
            link: 'https://github.com/Sacasa01',
            linkText: 'Ver Perfil de GitHub ↗'
          }
        ]
      },
      education: {
        sectionTitle: 'Formación Académica',
        sectionSubtitle: 'Titulaciones Oficiales y Acreditaciones',
        items: [
          {
            degree: 'BSc (Hons) in Computer Science (Top-Up)',
            institution: 'Canterbury Christ Church University (sede Madrid en MSMK University)',
            period: 'Sep 2026 – Jun 2027',
            badge: 'Impartido 100% en Inglés',
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
            title: 'Inglés: C1 Certified (IELTS 8.0)',
            issuer: 'Official IELTS Examination',
            year: '2026',
            description: 'Fluidez académica y profesional avanzada en inglés técnico para liderazgo y comunicación en equipos internacionales.'
          },
          {
            title: 'AWS Certified Cloud Practitioner',
            issuer: 'Amazon Web Services (AWS)',
            year: '2025',
            description: 'Fundamentos de arquitectura en la nube, cumplimiento de seguridad, servicios serverless y despliegues.'
          },
          {
            title: 'Google: Inteligencia Artificial y Productividad',
            issuer: 'Santander Open Academy',
            year: 'Ene 2025',
            description: 'Integración de IA generativa, diseño de prompts y automatización de flujos de productividad de desarrollo.'
          },
          {
            title: 'Cloud Computing: Infraestructura y Despliegue Aplicado',
            issuer: 'Florida Universitària',
            year: 'May 2026',
            description: 'Administración práctica de servidores Linux, redes de contenedores y flujos de despliegue continuo.'
          },
          {
            title: 'Objetivo Activo: AWS Certified AI Practitioner (AIF-C01)',
            issuer: 'AWS Cloud & Bedrock Track',
            year: 'En Curso (2026)',
            description: 'Profundización en modelos fundacionales y machine learning empresarial en producción con Amazon Bedrock.'
          }
        ]
      },
      contact: {
        sectionTitle: 'Contacto',
        sectionSubtitle: 'Construyamos Algo de Impacto',
        heading: '¿Hablamos?',
        text: 'Estoy activamente buscando oportunidades como ingeniero de software e integrador de sistemas de IA en Dublín, Irlanda o en remoto internacional. Si tienes un reto técnico en backend, un pipeline de IA que construir o simplemente quieres conversar sobre ingeniería, contáctame.',
        emailLabel: 'Correo Electrónico',
        phoneLabel: 'Teléfono Directo',
        locationLabel: 'Ubicación',
        copyEmail: 'Copiar Correo',
        emailCopied: '¡Copiado al portapapeles!',
        sendEmail: 'Enviar Mensaje',
        downloadCv: 'Descargar Curriculum Vitae (PDF)'
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
}
