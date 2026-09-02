import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AiAssistantComponent } from './components/chat/ai-assistant.component';

export interface WindowState {
  id: string;
  titleEn: string;
  titleEs: string;
  isOpen: boolean;
  isMaximized: boolean;
  isMinimized: boolean;
  zIndex: number;
  width?: number;
  height?: number;
  x?: number;
  y?: number;
}

interface EndpointSimulation {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  path: string;
  auth: string;
  status: number;
  latency: number;
  response: any;
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, AiAssistantComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  currentLang: 'en' | 'es' = 'en';
  private maxZIndex = 100;

  // AI Assistant Console State
  isAiAssistantOpen = signal(false);

  // Character Solo Leveling HUD State
  isCharacterHovered = false;
  activeStatCategory: 'skills' | 'passives' | 'quest' = 'skills';

  hunterStats = [
    { name: 'Python 3 / PyTorch / MONAI', level: 95, exp: '95/100', category: 'AI & Deep Learning', desc: 'Hospital La Fe clinical scan segmentation (Dice >0.942)' },
    { name: 'PHP 8.2 / Symfony 7 REST', level: 92, exp: '92/100', category: 'Backend Architecture', desc: '33 Endpoints, JWT Rotation, Custom Security Voters' },
    { name: 'Agentic MCP & Vector RAG', level: 94, exp: '94/100', category: 'AI Systems', desc: 'Model Context Protocol, Qdrant 1536-dim, ReAct loops' },
    { name: 'Geospatial & Multithreading', level: 90, exp: '90/100', category: 'High Throughput', desc: '20 Worker Threads, Pandas, Spanish Cadastre WFS' },
    { name: 'Cloud AWS & Docker Compose', level: 88, exp: '88/100', category: 'Cloud Infrastructure', desc: 'AWS Certified Cloud Practitioner, Multi-stage containers' },
    { name: 'TypeScript & Angular 19', level: 86, exp: '86/100', category: 'Full-Stack UI', desc: 'Standalone Components, Reactive Signals, Tailwind CSS' }
  ];

  passiveSkills = [
    { name: 'Low-Latency Optimizer', effect: 'Reduces geospatial WFS batch extraction latency by >90%.' },
    { name: 'Clinical Precision', effect: 'Segments ultrasound slices in 16ms with Dice coefficient >0.942.' },
    { name: 'Dublin Relocation 2026', effect: 'Immediate On-Site availability in Dublin starting Sept 30, 2026.' }
  ];


  // 1. Fertoolity Medical AI Simulator State (Hospital La Fe)
  isSegmenting = false;
  segmentationProgress = 0;
  diceScore = 0.00;
  inferenceLatency = 0;
  activeSlice = 14;
  segmentationPoints = '';

  // 2. FitForge Interactive API Console State
  activeEndpointIndex = 0;
  fitForgeEndpoints: EndpointSimulation[] = [
    {
      method: 'GET',
      path: '/api/v1/workouts/recommendations?difficulty=advanced',
      auth: 'Bearer JWT (RBAC: ROLE_USER)',
      status: 200,
      latency: 24,
      response: {
        success: true,
        data: {
          routineId: 'wf-4601',
          split: 'Push-Pull-Legs Hypertrophy',
          targetVolumeSets: 18,
          progressiveOverloadCoefficient: 1.05,
          voterAccessGranted: true
        }
      }
    },
    {
      method: 'POST',
      path: '/api/v1/auth/jwt/refresh',
      auth: 'Refresh Token Rotation',
      status: 201,
      latency: 18,
      response: {
        token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.santiago.fitforge.2026',
        expiresIn: 3600,
        tokenType: 'Bearer'
      }
    },
    {
      method: 'GET',
      path: '/api/v1/nutrition/macros/balance',
      auth: 'Bearer JWT (RBAC: ROLE_PREMIUM)',
      status: 200,
      latency: 32,
      response: {
        totalCalories: 2850,
        proteinGrams: 195,
        carbsGrams: 340,
        fatGrams: 75,
        distribution: { proteinPct: 27, carbsPct: 48, fatPct: 25 }
      }
    }
  ];

  // 3. Legacy Land Mapper Multithreading Simulator
  workerThreadsCount = 20;
  cadastreParcelsExtracted = 1420;
  cadastreLatency = 142; // ms
  isExtractingParcels = false;

  // 4. MCP Agent Simulator State
  selectedMcpTool = 'query_vector_db';
  isExecutingMcp = false;
  mcpOutputTrace: {
    protocol: string;
    tool: string;
    embeddingDimensions: number;
    vectorStore: string;
    topKMatches: Array<{ id: string; score: number; metadata: Record<string, any> }>;
  } = {
    protocol: 'JSON-RPC 2.0',
    tool: 'query_vector_db',
    embeddingDimensions: 1536,
    vectorStore: 'Qdrant (Cosine Similarity)',
    topKMatches: [
      { id: 'chunk-dublin-2026', score: 0.942, metadata: { topic: 'Relocation Dublin', date: '30 Sep 2026' } },
      { id: 'chunk-hospital-lafe', score: 0.915, metadata: { topic: 'MONAI PyTorch Segmentation', dice: 0.942 } }
    ]
  };

  // Interactive Modal Windows (Deep-Dives)
  windows = signal<WindowState[]>([
    { id: 'lafe', titleEn: 'Fertoolity Medical AI Lab', titleEs: 'Lab Fertoolity IA Médica', isOpen: false, isMaximized: false, isMinimized: false, zIndex: 100, width: 720, height: 520 },
    { id: 'fitforge', titleEn: 'FitForge Full-Stack SPA', titleEs: 'FitForge Full-Stack SPA', isOpen: false, isMaximized: false, isMinimized: false, zIndex: 100, width: 720, height: 520 },
    { id: 'mapper', titleEn: 'Legacy Land Mapper', titleEs: 'Legacy Land Mapper (WFS)', isOpen: false, isMaximized: false, isMinimized: false, zIndex: 100, width: 680, height: 480 },
    { id: 'mcp-agents', titleEn: 'MCP & Agent Systems Architecture', titleEs: 'Arquitectura de Agentes & MCP', isOpen: false, isMaximized: false, isMinimized: false, zIndex: 100, width: 680, height: 500 },
    { id: 'whyhireme', titleEn: 'Why Hire Santiago? // Dublin 2026', titleEs: '¿Por qué contratar a Santiago? // Dublín 2026', isOpen: false, isMaximized: false, isMinimized: false, zIndex: 100, width: 680, height: 540 }
  ]);

  activeWindow: WindowState | null = null;
  dragAction: 'drag' | 'resize-r' | 'resize-b' | 'resize-br' | null = null;
  private startMouseX = 0;
  private startMouseY = 0;
  private startWidth = 0;
  private startHeight = 0;
  private startX = 0;
  private startY = 0;

  translations = {
    en: {
      heroSubLeft: 'BACKEND & AI SYSTEMS ENGINEER',
      heroSubRight: 'DUBLIN 2026 • VALENCIA',
      dublinBadge: 'Available for Dublin On-Site from Sept 30, 2026 & International Remote',
      pitchText: 'I am a Backend & AI Systems Integration Engineer who bridges the gap between deep learning neural models and robust, clean backend microservices. With clinical production experience at Hospital La Fe implementing ultrasound scan segmentation and extensive mastery in Python, PHP 8 (Symfony 7), Docker, and Agentic MCP workflows, I build secure, high-throughput systems designed for production scale.',
      dublinTarget: 'Seeking Junior/Mid Backend & AI Systems Integration roles in Dublin, Ireland or International Remote.',
      competency1: 'Production-grade deep learning model deployment with PyTorch, MONAI, OpenCV and FastAPI.',
      competency2: 'High-throughput REST API architectures in Symfony 7 (PHP 8.2) & Python, with complex SQL relational schemas.',
      competency3: 'Agentic workflows and tool orchestration using Model Context Protocol (MCP), Vector DBs (Qdrant), and LLM function calling.',
      competency4: 'Cloud-native infrastructure with AWS (EC2, S3, RDS, Lambda, Bedrock), Docker Compose, and CI/CD pipelines.',
      educationTitle: 'BSc (Hons) Top-Up in Computer Science',
      educationInst: 'Canterbury Christ Church University (UK) • Madrid Campus at MSMK',
      dawTitle: 'CFGS Web Application Development (DAW)',
      dawInst: 'Official Vocational Degree (Grade: 7.00)',
      langEs: 'Spanish (Native)',
      langCa: 'Valencian / Catalan (Native / Bilingual)',
      langEn: 'English (B2 Certified, C1 Target Q4 2026)'
    },
    es: {
      heroSubLeft: 'INGENIERO BACKEND & SISTEMAS IA',
      heroSubRight: 'DUBLÍN 2026 • VALENCIA',
      dublinBadge: 'Disponible On-Site en Dublín desde el 30 de Sep 2026 y Remoto Internacional',
      pitchText: 'Soy un Ingeniero de Backend e Integración de Sistemas de IA que conecta modelos neuronales de Deep Learning con microservicios backend robustos y limpios. Con experiencia en producción clínica en el Hospital La Fe implementando segmentación de ecografías y dominio en Python, PHP 8 (Symfony 7), Docker y flujos agénticos MCP, construyo software seguro y de alta fidelidad para entornos de producción.',
      dublinTarget: 'Búsqueda activa de posiciones Junior/Mid Backend & AI Systems en Dublín, Irlanda o Remoto Internacional.',
      competency1: 'Despliegue y optimización de modelos de Deep Learning con PyTorch, MONAI, OpenCV y FastAPI.',
      competency2: 'Arquitecturas de API REST de alto rendimiento en Symfony 7 (PHP 8.2) y Python con complejas bases de datos relacionales SQL.',
      competency3: 'Flujos de trabajo agénticos y orquestación de herramientas con Model Context Protocol (MCP), Vector DBs (Qdrant) y Function Calling.',
      competency4: 'Infraestructura cloud con AWS (EC2, S3, RDS, Lambda, Bedrock), Docker Compose y pipelines CI/CD.',
      educationTitle: 'Grado en Ingeniería Informática (BSc Hons Top-Up)',
      educationInst: 'Canterbury Christ Church University (Reino Unido) • Sede Madrid en MSMK',
      dawTitle: 'CFGS Desarrollo de Aplicaciones Web (DAW)',
      dawInst: 'Titulación Oficial (Nota Media: 7.00)',
      langEs: 'Español (Nativo)',
      langCa: 'Valenciano / Catalán (Nativo / Bilingüe)',
      langEn: 'Inglés (B2 Oficial, Objetivo C1 Q4 2026)'
    }
  };

  ngOnInit() {
    const saved = localStorage.getItem('lang') as 'en' | 'es';
    if (saved) this.currentLang = saved;
  }

  toggleLang() {
    this.currentLang = this.currentLang === 'en' ? 'es' : 'en';
    localStorage.setItem('lang', this.currentLang);
  }

  // AI Assistant Console Actions
  openAiAssistant() {
    this.isAiAssistantOpen.set(true);
  }

  closeAiAssistant() {
    this.isAiAssistantOpen.set(false);
  }

  toggleAiAssistant() {
    this.isAiAssistantOpen.update(v => !v);
  }

  // FitForge API Console
  setFitForgeEndpoint(index: number) {
    this.activeEndpointIndex = index;
  }

  // MCP Agent Simulator
  selectMcpTool(toolName: string) {
    this.selectedMcpTool = toolName;
    this.isExecutingMcp = true;

    setTimeout(() => {
      this.isExecutingMcp = false;
      if (toolName === 'query_vector_db') {
        this.mcpOutputTrace = {
          protocol: 'JSON-RPC 2.0',
          tool: 'query_vector_db',
          embeddingDimensions: 1536,
          vectorStore: 'Qdrant (Cosine Similarity)',
          topKMatches: [
            { id: 'chunk-dublin-2026', score: 0.942, metadata: { topic: 'Relocation Dublin', date: '30 Sep 2026' } },
            { id: 'chunk-hospital-lafe', score: 0.915, metadata: { topic: 'MONAI PyTorch Segmentation', dice: 0.942 } }
          ]
        };
      } else if (toolName === 'fetch_cadastre_wfs') {
        this.mcpOutputTrace = {
          protocol: 'JSON-RPC 2.0',
          tool: 'fetch_cadastre_wfs',
          embeddingDimensions: 0,
          vectorStore: 'Spanish Cadastre WFS REST Endpoint',
          topKMatches: [
            { id: 'parcel-4601-wfs', score: 1.000, metadata: { coordinates: [39.4699, -0.3763], format: 'GeoJSON Polygon' } }
          ]
        };
      } else if (toolName === 'run_monai_segmenter') {
        this.mcpOutputTrace = {
          protocol: 'JSON-RPC 2.0',
          tool: 'run_monai_segmenter',
          embeddingDimensions: 0,
          vectorStore: 'PyTorch CUDA Inference Engine',
          topKMatches: [
            { id: 'scan-slice-14', score: 0.948, metadata: { diceScore: 0.942, gpuLatencyMs: 16, status: 'Inference Complete' } }
          ]
        };
      }
    }, 450);
  }

  // Hospital La Fe Medical Simulator
  runMedicalInference() {
    if (this.isSegmenting) return;

    this.isSegmenting = true;
    this.segmentationProgress = 0;
    this.diceScore = 0.00;
    this.inferenceLatency = 0;
    this.segmentationPoints = '';

    const duration = 1400;
    const start = performance.now();

    const step = (now: number) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);

      this.segmentationProgress = Math.round(progress * 100);

      if (progress > 0.2) {
        const points: string[] = [];
        const numPoints = 14;
        const centerX = 150;
        const centerY = 100;
        const baseRadius = 46;

        for (let i = 0; i < numPoints; i++) {
          const angle = (i / numPoints) * Math.PI * 2;
          const noise = Math.sin(angle * 3 + progress * 10) * 8 * progress;
          const r = baseRadius + noise;
          const x = centerX + Math.cos(angle) * r;
          const y = centerY + Math.sin(angle) * r;
          points.push(`${x.toFixed(1)},${y.toFixed(1)}`);
        }
        this.segmentationPoints = points.join(' ');
      }

      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        this.isSegmenting = false;
        this.diceScore = parseFloat((0.938 + Math.random() * 0.03).toFixed(3));
        this.inferenceLatency = Math.round(14 + Math.random() * 4);
      }
    };

    requestAnimationFrame(step);
  }

  changeSlice(direction: 'next' | 'prev') {
    if (direction === 'next' && this.activeSlice < 48) this.activeSlice++;
    if (direction === 'prev' && this.activeSlice > 1) this.activeSlice--;
    this.segmentationPoints = '';
    this.diceScore = 0;
  }

  // Land Mapper Concurrency Benchmark
  runLandMapperBatch() {
    this.isExtractingParcels = true;
    setTimeout(() => {
      this.isExtractingParcels = false;
      this.cadastreLatency = Math.round(3200 / this.workerThreadsCount + Math.random() * 15);
      this.cadastreParcelsExtracted += Math.round(this.workerThreadsCount * 12);
    }, 600);
  }

  // Windows Management
  openWindow(id: string) {
    this.maxZIndex++;
    this.windows.update(items =>
      items.map(w => w.id === id ? {
        ...w,
        isOpen: true,
        isMinimized: false,
        zIndex: this.maxZIndex,
        width: w.width || 680,
        height: w.height || 500,
        x: w.x || Math.max(20, (window.innerWidth - (w.width || 680)) / 2),
        y: w.y || Math.max(30, (window.innerHeight - (w.height || 500)) / 2)
      } : w)
    );
  }

  closeWindow(id: string, event?: Event) {
    if (event) event.stopPropagation();
    this.windows.update(items =>
      items.map(w => w.id === id ? { ...w, isOpen: false } : w)
    );
  }

  minimizeWindow(id: string, event?: Event) {
    if (event) event.stopPropagation();
    this.windows.update(items =>
      items.map(w => w.id === id ? { ...w, isMinimized: true } : w)
    );
  }

  toggleMaximize(id: string, event?: Event) {
    if (event) event.stopPropagation();
    this.windows.update(items =>
      items.map(w => w.id === id ? { ...w, isMaximized: !w.isMaximized } : w)
    );
  }

  focusWindow(id: string) {
    this.maxZIndex++;
    this.windows.update(items =>
      items.map(w => w.id === id ? { ...w, zIndex: this.maxZIndex } : w)
    );
  }

  startDrag(event: MouseEvent, win: WindowState, action: 'drag' | 'resize-r' | 'resize-b' | 'resize-br') {
    if (win.isMaximized) return;
    this.focusWindow(win.id);
    this.activeWindow = win;
    this.dragAction = action;

    this.startMouseX = event.clientX;
    this.startMouseY = event.clientY;
    this.startWidth = win.width || 680;
    this.startHeight = win.height || 500;
    this.startX = win.x || (window.innerWidth - this.startWidth) / 2;
    this.startY = win.y || (window.innerHeight - this.startHeight) / 2;

    document.addEventListener('mousemove', this.onMouseMove);
    document.addEventListener('mouseup', this.onMouseUp);
    event.preventDefault();
  }

  private onMouseMove = (event: MouseEvent) => {
    if (!this.activeWindow || !this.dragAction) return;

    const deltaX = event.clientX - this.startMouseX;
    const deltaY = event.clientY - this.startMouseY;

    this.windows.update(items =>
      items.map(w => {
        if (w.id === this.activeWindow?.id) {
          const updated = { ...w };
          if (this.dragAction === 'drag') {
            updated.x = this.startX + deltaX;
            updated.y = this.startY + deltaY;
          }
          return updated;
        }
        return w;
      })
    );
  };

  private onMouseUp = () => {
    this.activeWindow = null;
    this.dragAction = null;
    document.removeEventListener('mousemove', this.onMouseMove);
    document.removeEventListener('mouseup', this.onMouseUp);
  };
}
