import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AvatarContainerComponent, AvatarState } from './components/avatar/avatar-container.component';
import { SpeechBubbleComponent } from './components/chat/speech-bubble.component';

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

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, AvatarContainerComponent, SpeechBubbleComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  currentLang: 'en' | 'es' = 'en';
  private maxZIndex = 100;

  // Avatar State Lifecycle: 'TYPING' | 'GREETING' | 'CHAT_IDLE' | 'TALKING' | 'RETURNING'
  avatarState = signal<AvatarState>('TYPING');
  isSpeechBubbleOpen = signal(false);

  // Medical AI Simulator State (Hospital La Fe)
  isSegmenting = false;
  segmentationProgress = 0;
  diceScore = 0.00;
  inferenceLatency = 0;
  activeSlice = 12;
  segmentationPoints = '';

  // FitForge Carousel State
  fitForgeIndex = 0;
  fitForgeSlides = [
    { titleEn: 'Decoupled Architecture', titleEs: 'Arquitectura Desacoplada', descEn: 'Symfony 7 REST API with 33 endpoints, JWT auth, and Angular standalone client.', descEs: 'API REST en Symfony 7 con 33 endpoints, JWT auth y cliente Angular standalone.' },
    { titleEn: 'Personalized Workout Engine', titleEs: 'Motor de Entrenamiento Personalizado', descEn: 'Dynamic exercise indexing, RBAC security voters, and user rating recommendations.', descEs: 'Indexación dinámica de ejercicios, security voters RBAC y recomendaciones por valoración.' },
    { titleEn: 'Diet & Nutrition Generator', titleEs: 'Generador de Dietas y Nutrición', descEn: 'Caloric balance computation with macro distribution parameters.', descEs: 'Cálculo de balance calórico con parámetros de distribución de macronutrientes.' },
    { titleEn: 'Analytics Dashboard', titleEs: 'Panel de Analíticas', descEn: 'Progress tracking, volume overload metrics, and body measurement telemetry.', descEs: 'Seguimiento de progreso, métricas de sobrecarga y telemetría corporal.' },
    { titleEn: 'Docker Containerization', titleEs: 'Contenedores Docker', descEn: 'Multi-container orchestration with Nginx, PHP-FPM, MySQL 8, and Node.', descEs: 'Orquestación multi-contenedor con Nginx, PHP-FPM, MySQL 8 y Node.' }
  ];

  // Land Mapper Simulation State
  activeMapWorkerCount = 20;
  queriedParcelsCount = 1420;
  cadastreLatency = 142; // ms

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

  // 100% Automated Avatar & Speech Bubble Event Lifecycle
  onAvatarClicked() {
    if (this.avatarState() === 'TYPING') {
      this.avatarState.set('GREETING');
    }
    this.isSpeechBubbleOpen.set(true);
  }

  toggleSpeechBubble() {
    if (this.isSpeechBubbleOpen()) {
      this.closeSpeechBubble();
    } else {
      this.onAvatarClicked();
    }
  }

  closeSpeechBubble() {
    this.isSpeechBubbleOpen.set(false);
    this.avatarState.set('RETURNING');
  }

  onAvatarStateChange(newState: AvatarState) {
    this.avatarState.set(newState);
  }

  onChatStreamStart() {
    this.avatarState.set('TALKING');
  }

  onChatStreamEnd() {
    this.avatarState.set('CHAT_IDLE');
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

  // Hospital La Fe Medical Simulator
  runMedicalInference() {
    if (this.isSegmenting) return;

    this.isSegmenting = true;
    this.segmentationProgress = 0;
    this.diceScore = 0.00;
    this.inferenceLatency = 0;
    this.segmentationPoints = '';

    const duration = 1600;
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
        this.inferenceLatency = Math.round(14 + Math.random() * 5);
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

  // FitForge Carousel
  prevFitForge() {
    this.fitForgeIndex = (this.fitForgeIndex === 0) ? this.fitForgeSlides.length - 1 : this.fitForgeIndex - 1;
  }

  nextFitForge() {
    this.fitForgeIndex = (this.fitForgeIndex === this.fitForgeSlides.length - 1) ? 0 : this.fitForgeIndex + 1;
  }

  setFitForgeSlide(index: number) {
    this.fitForgeIndex = index;
  }
}
