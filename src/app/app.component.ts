import { Component, OnInit, AfterViewInit, ElementRef, NgZone, Renderer2, ViewChild, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BoundFloatingDirective } from './shared/directives/bound-floating.directive';

interface WindowState {
  id: string;
  isOpen: boolean;
  isMaximized: boolean;
  zIndex: number;
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, BoundFloatingDirective],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, AfterViewInit {
  private renderer = inject(Renderer2);
  private ngZone = inject(NgZone);

  isDarkMode = false;
  currentLang: 'en' | 'es' = 'en';
  private maxZIndex = 100;

  // Estados del Simulador de Segmentación en Q1
  isSegmenting = false;
  segmentationProgress = 0;
  diceScore = 0.00;
  inferenceLatency = 0;
  activeSlice = 12;
  segmentationPoints = '';

  // --- CONFIGURACIÓN DE CARRUSELES ---
  // Índices activos para los carruseles de imágenes
  fitForgeIndex = 0;
  mapperIndex = 0;

  // Listado de capturas de Fit Forge
  fitForgeSlides = [
    { title: 'Cover Page', desc: 'Main interface of the Fitness SPA application.' },
    { title: 'Personalised Catalogue', desc: 'Interactive exercise & workout directory.' },
    { title: 'Diet Planner', desc: 'Custom nutrition parameters generator.' },
    { title: 'User Dashboard', desc: 'Progress tracking analytics.' },
    { title: 'Admin Panel', desc: 'Content curation and database management tools.' }
  ];

  // Listado de capturas de Legacy Land Mapper
  mapperSlides = [
    { title: 'Cover Page', desc: 'Input screen for bulk cadastral reference upload.' },
    { title: 'Interactive Map View', desc: 'Rendered parcels visualised with Leaflet.js.' },
    { title: 'Real-time Stats', desc: 'Area calculation and property metadata cards.' },
    { title: 'Search & Filtering', desc: 'Advanced search system with satellite toggles.' }
  ];

  // Referencias a los contenedores
  @ViewChild('q1Container') q1Container!: ElementRef<HTMLElement>;
  @ViewChild('q4Container') q4Container!: ElementRef<HTMLElement>;

  // Referencias a elementos del timeline en Q4 (Educación)
  @ViewChild('nodeBach') nodeBach!: ElementRef<HTMLElement>;
  @ViewChild('nodeDaw') nodeDaw!: ElementRef<HTMLElement>;
  @ViewChild('nodeCant') nodeCant!: ElementRef<HTMLElement>;
  @ViewChild('nodeAws') nodeAws!: ElementRef<HTMLElement>;

  @ViewChild('pathBachDaw') pathBachDaw!: ElementRef<SVGPathElement>;
  @ViewChild('pathDawCant') pathDawCant!: ElementRef<SVGPathElement>;
  @ViewChild('pathJunctionAws') pathJunctionAws!: ElementRef<SVGPathElement>;
  @ViewChild('junctionNodeCircle') junctionNodeCircle!: ElementRef<SVGCircleElement>;

  // Referencias a elementos de Q1 (Experiencia Laboral)
  @ViewChild('nodeLafe') nodeLafe!: ElementRef<HTMLElement>;
  @ViewChild('nodeHire') nodeHire!: ElementRef<HTMLElement>;
  @ViewChild('pathLafeHire') pathLafeHire!: ElementRef<SVGPathElement>;

  // Referencias a elementos de Q3 (Hobbies & Deportes - Pirámide)
  @ViewChild('q3Container') q3Container!: ElementRef<HTMLElement>;
  @ViewChild('nodeMe') nodeMe!: ElementRef<HTMLElement>;
  @ViewChild('nodeTennis') nodeTennis!: ElementRef<HTMLElement>;
  @ViewChild('nodeFutbol') nodeFutbol!: ElementRef<HTMLElement>;
  @ViewChild('nodeClimbing') nodeClimbing!: ElementRef<HTMLElement>;
  @ViewChild('nodeSub1') nodeSub1!: ElementRef<HTMLElement>;
  @ViewChild('nodeSub2') nodeSub2!: ElementRef<HTMLElement>;
  @ViewChild('nodeSub3') nodeSub3!: ElementRef<HTMLElement>;
  @ViewChild('nodeSub4') nodeSub4!: ElementRef<HTMLElement>;
  @ViewChild('nodeSub5') nodeSub5!: ElementRef<HTMLElement>;
  @ViewChild('nodeSub6') nodeSub6!: ElementRef<HTMLElement>;

  @ViewChild('pathMeTennis') pathMeTennis!: ElementRef<SVGPathElement>;
  @ViewChild('pathMeFutbol') pathMeFutbol!: ElementRef<SVGPathElement>;
  @ViewChild('pathMeClimbing') pathMeClimbing!: ElementRef<SVGPathElement>;
  @ViewChild('pathTennisSub1') pathTennisSub1!: ElementRef<SVGPathElement>;
  @ViewChild('pathTennisSub2') pathTennisSub2!: ElementRef<SVGPathElement>;
  @ViewChild('pathFutbolSub3') pathFutbolSub3!: ElementRef<SVGPathElement>;
  @ViewChild('pathFutbolSub4') pathFutbolSub4!: ElementRef<SVGPathElement>;
  @ViewChild('pathClimbingSub5') pathClimbingSub5!: ElementRef<SVGPathElement>;
  @ViewChild('pathClimbingSub6') pathClimbingSub6!: ElementRef<SVGPathElement>;

  // Coordenadas físicas en escalera diagonal de Q4
  private q4Nodes: Record<string, { x: number; y: number; ampX: number; ampY: number; speedX: number; speedY: number; phaseX: number; phaseY: number; targetScale: number; currentScale: number; basePctX: number; basePctY: number }> = {
    bach: { x: 0, y: 0, ampX: 6, ampY: 6, speedX: 0.0010, speedY: 0.0012, phaseX: 1.2, phaseY: 3.4, targetScale: 1, currentScale: 1, basePctX: 0.88, basePctY: 0.68 },
    daw:  { x: 0, y: 0, ampX: 7, ampY: 7, speedX: 0.0008, speedY: 0.0009, phaseX: 2.5, phaseY: 0.8, targetScale: 1, currentScale: 1, basePctX: 0.50, basePctY: 0.58 },
    cant: { x: 0, y: 0, ampX: 8, ampY: 8, speedX: 0.0007, speedY: 0.0008, phaseX: 4.7, phaseY: 2.1, targetScale: 1, currentScale: 1, basePctX: 0.12, basePctY: 0.28 },
    aws:  { x: 0, y: 0, ampX: 5, ampY: 5, speedX: 0.0014, speedY: 0.0011, phaseX: 0.3, phaseY: 4.1, targetScale: 1, currentScale: 1, basePctX: 0.45, basePctY: 0.22 }
  };

  // Coordenadas síncronas del cuadrante Q1 (Experiencia & Pitch)
  private q1Nodes: Record<string, { x: number; y: number; ampX: number; ampY: number; speedX: number; speedY: number; phaseX: number; phaseY: number; targetScale: number; currentScale: number; basePctX: number; basePctY: number }> = {
    lafe: { x: 0, y: 0, ampX: 7, ampY: 7, speedX: 0.0009, speedY: 0.0011, phaseX: 0.5, phaseY: 1.8, targetScale: 1, currentScale: 1, basePctX: 0.30, basePctY: 0.50 },
    hire: { x: 0, y: 0, ampX: 6, ampY: 6, speedX: 0.0011, speedY: 0.0008, phaseX: 2.2, phaseY: 0.3, targetScale: 1, currentScale: 1, basePctX: 0.70, basePctY: 0.50 }
  };

  // Coordenadas físicas de la Pirámide de Q3 (ME -> DEPORTES -> EXPANSIONES)
  private q3Nodes: Record<string, { x: number; y: number; ampX: number; ampY: number; speedX: number; speedY: number; phaseX: number; phaseY: number; targetScale: number; currentScale: number; basePctX: number; basePctY: number }> = {
    me:       { x: 0, y: 0, ampX: 7, ampY: 7, speedX: 0.0009, speedY: 0.0008, phaseX: 0.3, phaseY: 1.5, targetScale: 1, currentScale: 1, basePctX: 0.50, basePctY: 0.22 },
    tennis:   { x: 0, y: 0, ampX: 5, ampY: 5, speedX: 0.0012, speedY: 0.0010, phaseX: 1.1, phaseY: 3.4, targetScale: 1, currentScale: 1, basePctX: 0.22, basePctY: 0.50 },
    futbol:   { x: 0, y: 0, ampX: 6, ampY: 6, speedX: 0.0010, speedY: 0.0013, phaseX: 2.5, phaseY: 0.7, targetScale: 1, currentScale: 1, basePctX: 0.50, basePctY: 0.50 },
    climbing: { x: 0, y: 0, ampX: 5, ampY: 5, speedX: 0.0011, speedY: 0.0009, phaseX: 4.1, phaseY: 2.2, targetScale: 1, currentScale: 1, basePctX: 0.78, basePctY: 0.50 },
    sub1:     { x: 0, y: 0, ampX: 3, ampY: 3, speedX: 0.0015, speedY: 0.0016, phaseX: 0.1, phaseY: 4.2, targetScale: 1, currentScale: 1, basePctX: 0.12, basePctY: 0.78 },
    sub2:     { x: 0, y: 0, ampX: 3, ampY: 3, speedX: 0.0014, speedY: 0.0015, phaseX: 1.2, phaseY: 3.1, targetScale: 1, currentScale: 1, basePctX: 0.27, basePctY: 0.78 },
    sub3:     { x: 0, y: 0, ampX: 3, ampY: 3, speedX: 0.0016, speedY: 0.0014, phaseX: 2.3, phaseY: 1.8, targetScale: 1, currentScale: 1, basePctX: 0.42, basePctY: 0.78 },
    sub4:     { x: 0, y: 0, ampX: 3, ampY: 3, speedX: 0.0013, speedY: 0.0015, phaseX: 3.5, phaseY: 0.5, targetScale: 1, currentScale: 1, basePctX: 0.58, basePctY: 0.78 },
    sub5:     { x: 0, y: 0, ampX: 3, ampY: 3, speedX: 0.0015, speedY: 0.0013, phaseX: 4.8, phaseY: 2.9, targetScale: 1, currentScale: 1, basePctX: 0.73, basePctY: 0.78 },
    sub6:     { x: 0, y: 0, ampX: 3, ampY: 3, speedX: 0.0012, speedY: 0.0014, phaseX: 5.9, phaseY: 1.2, targetScale: 1, currentScale: 1, basePctX: 0.88, basePctY: 0.78 }
  };

  // Modales interactivos
  windows = signal<WindowState[]>([
    { id: 'lafe', isOpen: false, isMaximized: false, zIndex: 100 },
    { id: 'fitforge', isOpen: false, isMaximized: false, zIndex: 100 },
    { id: 'mapper', isOpen: false, isMaximized: false, zIndex: 100 },
    { id: 'climbing', isOpen: false, isMaximized: false, zIndex: 100 },
    { id: 'canterbury', isOpen: false, isMaximized: false, zIndex: 100 },
    { id: 'whyhireme', isOpen: false, isMaximized: false, zIndex: 100 },
    { id: 'me-bio', isOpen: false, isMaximized: false, zIndex: 100 },
    { id: 'tennis-log', isOpen: false, isMaximized: false, zIndex: 100 },
    { id: 'futbol-log', isOpen: false, isMaximized: false, zIndex: 100 },
    { id: 'climbing-log', isOpen: false, isMaximized: false, zIndex: 100 }
  ]);

  translations = {
    en: {
      subtitle: 'Full-Stack Engineer & AI Developer',
      q1: '01 // WORK EXPERIENCE',
      q2: '02 // PROJECTS',
      q3: '03 // ME & HOBBIES',
      q4: '04 // EDUCATION AND CERTIFICATES',
      edu_bach: 'Scientific Baccalaureate',
      edu_daw: 'Web App Developer',
      edu_aws: 'AWS Practitioner',
      edu_cs: 'Canterbury',
      lafe_title: 'Deep Learning for Gynaecological Imaging',
      lafe_desc: 'Developed custom neural networks for medical dataset segmentation using PyTorch and MONAI. Optimised workflows for clinicians to detect anomalies automatically with high diagnostic parameters.',
      fitforge_title: 'Fit Forge // Angular & Symfony 7',
      mapper_title: 'Legacy Land Mapper',
      mapper_desc: 'Multi-threaded tool fetching parcel geometry data directly from Spanish Cadastre WFS API. Formats data with Pandas into custom GeoJSON maps.',
      sports_title: 'Rock Climbing & Sports',
      sports_desc: 'Interactive track of boulder difficulty levels (V4 to V8). Tracks sessions, hold-types, and physical metrics over time.',
      collabTitle: 'Collaborators',
      soleAuthor: 'Sole Author / Academic Project',
      whyMade: 'Why it was created',
      techDepth: 'Technical Deep-Dive',
      txt_hire_node: 'WHY HIRE ME?',
      why_title: '01 // WHY HIRE SANTIAGO?',
      why_heading: 'Why should you hire me?',
      why_sub: 'Final-Year Computer Science Student & Full-Stack Architect',
      pitch_text: 'I am a Full-Stack Engineer and AI developer who bridges the gap between complex Deep Learning architectures and robust, clean backend systems. My experience at Hospital La Fe implementing medical image segmentations demonstrates my ability to deliver secure, production-grade solutions in highly demanding environments.',
      competency1: 'Production-grade deployment of deep learning models with PyTorch and MONAI (AWS integration, Docker containerisation).',
      competency2: 'Designed secure API architectures using Symfony 7 (PHP 8.2) and FastAPI (Python), utilizing complex SQL relational designs.',
      competency3: 'Building fluid SPA applications in Angular utilizing modern Reactive Forms, lazy-loaded routing, and optimized interceptors.',
      txt_download_cv: 'Download CV',
      tech_stack_label: 'Primary Technology Stack',
      hobbiesTitle: 'Personal Log // Hobbies & Sports',
      climbingTitle: 'Rock Climbing & Boulder',
      climbingSub: 'Difficulty Levels V4 to V8',
      favHolds: 'Favorite Hold Types',
      crimps: 'Crimps',
      slopers: 'Slopers',
      pockets: 'Pockets',
      climbingStats: 'Session Metrics',
      avgGrade: 'Avg. Project Grade',
      weeklySessions: 'Weekly Sessions',
      otherSportsTitle: 'Club Sports & Teamplay',
      tennisClub: 'Valencia Tennis Club',
      tennisDesc: 'Singles amateur ladder player. Focus on strategy, fast footwork, and precise baseline execution.',
      footballClub: 'Amateur Football League',
      footballDesc: 'Midfielder / Winger. Emphasising fast transitions, team coordination, and physical stamina.'
    },
    es: {
      subtitle: 'Ingeniero Full-Stack & Desarrollador de IA',
      q1: '01 // EXPERIENCIA LABORAL',
      q2: '02 // PROYECTOS',
      q3: '03 // SOBRE MÍ Y HOBBIES',
      q4: '04 // EDUCACIÓN Y CERTIFICACIONES',
      edu_bach: 'Bachillerato Científico',
      edu_daw: 'Desarrollador Web (DAW)',
      edu_aws: 'Certificación AWS',
      edu_cs: 'Canterbury',
      lafe_title: 'Deep Learning para Imágenes Ginecológicas',
      lafe_desc: 'Desarrollo de modelos neuronales de segmentación en datasets médicos utilizando PyTorch y MONAI. Optimización de workflows clínicos para la detección automatizada de anomalías anatómicas.',
      fitforge_title: 'Fit Forge // Angular y Symfony 7',
      mapper_title: 'Mapeador de Parcelas',
      mapper_desc: 'Herramienta multi-hilo para la extracción y renderizado de geometrías catastrales directamente desde las APIs oficiales del Catastro de España.',
      sports_title: 'Escalada en Roca y Deportes',
      sports_desc: 'Registro interactivo de ascensiones y grados de dificultad en bloque. Monitorización de tipos de presas y métricas de rendimiento.',
      collabTitle: 'Colaboradores',
      soleAuthor: 'Autor Único / Proyecto Académico',
      whyMade: 'Propósito del proyecto',
      techDepth: 'Detalle Técnico',
      txt_hire_node: '¿POR QUÉ YO?',
      why_title: '01 // ¿POR QUÉ CONTRATAR A SANTIAGO?',
      why_heading: '¿Por qué contratarme?',
      why_sub: 'Estudiante de Último Año de Ingeniería Informática & Arquitecto Full-Stack',
      pitch_text: 'Soy un ingeniero de software Full-Stack y desarrollador de IA capaz de conectar arquitecturas complejas de Deep Learning con sistemas backend robustos y limpios. Mi trayectoria en el Hospital La Fe implementando segmentaciones de imagen demuestra mi madurez para desplegar software seguro y de alta fidelidad en entornos demandantes.',
      competency1: 'Despliegue y optimización de modelos de Deep Learning con PyTorch y MONAI (integración en AWS, contenedores Docker).',
      competency2: 'Diseño de APIs seguras y escalables en Symfony 7 (PHP 8.2) y FastAPI (Python) con complejas bases de datos relacionales SQL.',
      competency3: 'Construcción de aplicaciones SPA fluidas en Angular haciendo uso de componentes standalone, interceptores y enrutamiento perezoso.',
      txt_download_cv: 'Descargar CV',
      tech_stack_label: 'Stack Tecnológico Principal',
      hobbiesTitle: 'Registro Personal // Hobbies y Deporte',
      climbingTitle: 'Escalada en Roca y Bloque',
      climbingSub: 'Niveles de dificultad V4 a V8',
      favHolds: 'Tipos de Presas Favoritas',
      crimps: 'Regletas',
      slopers: 'Romos',
      pockets: 'Bidedos/Monodedos',
      climbingStats: 'Métricas de Sesión',
      avgGrade: 'Grado Medio de Proyecto',
      weeklySessions: 'Sesiones Semanales',
      otherSportsTitle: 'Deportes de Club y Equipo',
      tennisClub: 'Club de Tenis Valencia',
      tennisDesc: 'Jugador de liga social individual. Enfoque en estrategia de fondo, juego de pies y precisión en golpes paralelos.',
      footballClub: 'Liga de Fútbol Amateur',
      footballDesc: 'Mediocampista / Extremo. Enfocado en transiciones rápidas, coordinación táctica y resistencia aeróbica.'
    }
  };

  ngOnInit() {
    const preferredTheme = localStorage.getItem('theme');
    if (preferredTheme === 'dark' || (!preferredTheme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      this.enableDarkMode();
    }
    const preferredLang = localStorage.getItem('lang') as 'en' | 'es';
    if (preferredLang) this.currentLang = preferredLang;
  }

  ngAfterViewInit() {
    this.ngZone.runOutsideAngular(() => {
      const updateLoop = (time: number) => {
        this.renderSynchronizedTimeline(time);
        this.renderWorkTrajectory(time);
        this.renderHobbiesPyramid(time);
        requestAnimationFrame(updateLoop);
      };
      requestAnimationFrame(updateLoop);
    });
  }

  toggleLang() {
    this.currentLang = this.currentLang === 'en' ? 'es' : 'en';
    localStorage.setItem('lang', this.currentLang);
  }

  toggleTheme() {
    if (this.isDarkMode) {
      this.disableDarkMode();
    } else {
      this.enableDarkMode();
    }
  }

  private enableDarkMode() {
    this.isDarkMode = true;
    this.renderer.addClass(document.documentElement, 'dark');
    localStorage.setItem('theme', 'dark');
  }

  private disableDarkMode() {
    this.isDarkMode = false;
    this.renderer.removeClass(document.documentElement, 'dark');
    localStorage.setItem('theme', 'light');
  }

  openModal(id: string) {
    this.maxZIndex++;
    this.windows.update(list => 
      list.map(w => w.id === id ? { ...w, isOpen: true, zIndex: this.maxZIndex } : w)
    );
  }

  closeModal(id: string) {
    this.windows.update(list => 
      list.map(w => w.id === id ? { ...w, isOpen: false } : w)
    );
  }

  toggleMaximize(id: string) {
    this.windows.update(list => 
      list.map(w => w.id === id ? { ...w, isMaximized: !w.isMaximized } : w)
    );
  }

  focusModal(id: string) {
    this.maxZIndex++;
    this.windows.update(list => 
      list.map(w => w.id === id ? { ...w, zIndex: this.maxZIndex } : w)
    );
  }

  private renderSynchronizedTimeline(time: number) {
    const container = this.q4Container?.nativeElement;
    if (!container) return;
    const w = container.clientWidth;
    const h = container.clientHeight;

    const coords: Record<string, { x: number; y: number }> = {};

    const refs: Record<string, HTMLElement | undefined> = {
      bach: this.nodeBach?.nativeElement,
      daw:  this.nodeDaw?.nativeElement,
      cant: this.nodeCant?.nativeElement,
      aws:  this.nodeAws?.nativeElement
    };

    if (!refs['bach'] || !refs['daw'] || !refs['cant'] || !refs['aws']) return;

    // 1. Calcular oscilaciones de cada nodo y aplicar traslación GPU
    Object.keys(this.q4Nodes).forEach(key => {
      const node = this.q4Nodes[key];
      const el = refs[key];
      if (!el) return;

      node.currentScale += (node.targetScale - node.currentScale) * 0.1;

      node.x = Math.sin(time * node.speedX + node.phaseX) * node.ampX * node.currentScale;
      node.y = Math.cos(time * node.speedY + node.phaseY) * node.ampY * node.currentScale;

      const basePxX = w * node.basePctX;
      const basePxY = h * node.basePctY;

      // Centrado absoluto fluido
      el.style.left = `calc(${node.basePctX * 100}% - ${el.clientWidth / 2}px)`;
      el.style.top = `calc(${node.basePctY * 100}% - ${el.clientHeight / 2}px)`;
      el.style.transform = `translate3d(${node.x}px, ${node.y}px, 0)`;

      coords[key] = {
        x: basePxX + node.x,
        y: basePxY + node.y
      };
    });

    // 2. Redibujar curvas de conexión y calcular nodo físico de bifurcación
    if (coords['bach'] && coords['daw'] && coords['cant'] && coords['aws']) {
      const pBach = coords['bach'];
      const pDaw = coords['daw'];
      const pCant = coords['cant'];
      const pAws = coords['aws'];

      // Curva 1: Bachillerato (abajo-derecha) -> Web App Developer (centro)
      const d1 = `M ${pBach.x} ${pBach.y} C ${pBach.x - w * 0.08} ${pBach.y}, ${pDaw.x + w * 0.08} ${pDaw.y}, ${pDaw.x} ${pDaw.y}`;
      this.pathBachDaw?.nativeElement?.setAttribute('d', d1);

      // Curva 2: Web App Developer (centro) -> Canterbury (arriba-izq)
      const d2 = `M ${pDaw.x} ${pDaw.y} C ${pDaw.x - w * 0.12} ${pDaw.y}, ${pCant.x + w * 0.12} ${pCant.y}, ${pCant.x} ${pCant.y}`;
      this.pathDawCant?.nativeElement?.setAttribute('d', d2);

      // 📐 CÁLCULO DEL NODO DE DERIVACIÓN DINÁMICO (At t = 0.45 en la Curva Bezier 2)
      const p0x = pDaw.x, p0y = pDaw.y;
      const p1x = pDaw.x - w * 0.12, p1y = pDaw.y;
      const p2x = pCant.x + w * 0.12, p2y = pCant.y;
      const p3x = pCant.x, p3y = pCant.y;

      const t = 0.45; // Posicionamiento equilibrado del nodo sobre el cable
      const mt = 1 - t;

      const jX = mt*mt*mt*p0x + 3*mt*mt*t*p1x + 3*mt*t*t*p2x + t*t*t*p3x;
      const jY = mt*mt*mt*p0y + 3*mt*mt*t*p1y + 3*mt*t*t*p2y + t*t*t*p3y;

      // Colocar círculo de unión física del cable
      this.junctionNodeCircle?.nativeElement?.setAttribute('cx', jX.toString());
      this.junctionNodeCircle?.nativeElement?.setAttribute('cy', jY.toString());

      // Curva 3: Derivación desde el nodo calculated (jX, jY) -> AWS Practitioner (pAws)
      const d3 = `M ${jX} ${jY} C ${jX + w * 0.02} ${jY - h * 0.08}, ${pAws.x - w * 0.04} ${pAws.y + h * 0.08}, ${pAws.x} ${pAws.y}`;
      this.pathJunctionAws?.nativeElement?.setAttribute('d', d3);
    }
  }

  // 📐 NUEVO RENDERIZADOR SÍNCRONO EN Q1 (Trayectoria Laboral + Pitch)
  private renderWorkTrajectory(time: number) {
    const container = this.q1Container?.nativeElement;
    if (!container) return;
    const w = container.clientWidth;
    const h = container.clientHeight;

    const coords: Record<string, { x: number; y: number }> = {};
    const refs: Record<string, HTMLElement | undefined> = {
      lafe: this.nodeLafe?.nativeElement,
      hire: this.nodeHire?.nativeElement
    };

    if (!refs['lafe'] || !refs['hire']) return;

    Object.keys(this.q1Nodes).forEach(key => {
      const node = this.q1Nodes[key];
      const el = refs[key];
      if (!el) return;

      node.currentScale += (node.targetScale - node.currentScale) * 0.1;
      node.x = Math.sin(time * node.speedX + node.phaseX) * node.ampX * node.currentScale;
      node.y = Math.cos(time * node.speedY + node.phaseY) * node.ampY * node.currentScale;

      const basePxX = w * node.basePctX;
      const basePxY = h * node.basePctY;

      el.style.left = `calc(${node.basePctX * 100}% - ${el.clientWidth / 2}px)`;
      el.style.top = `calc(${node.basePctY * 100}% - ${el.clientHeight / 2}px)`;
      el.style.transform = `translate3d(${node.x}px, ${node.y}px, 0)`;

      coords[key] = { x: basePxX + node.x, y: basePxY + node.y };
    });

    if (coords['lafe'] && coords['hire']) {
      const pLafe = coords['lafe'];
      const pHire = coords['hire'];

      // Dibujar la curva Bezier elástica uniendo Fertoolity con Why Hire Me
      const dQ1 = `M ${pLafe.x} ${pLafe.y} C ${pLafe.x + w * 0.10} ${pLafe.y}, ${pHire.x - w * 0.10} ${pHire.y}, ${pHire.x} ${pHire.y}`;
      this.pathLafeHire?.nativeElement?.setAttribute('d', dQ1);
    }
  }

  openWindow(id: string) {
    if (id === 'me-bio') {
      this.openModal('whyhireme');
    } else if (id === 'climbing-log' || id === 'tennis-log' || id === 'futbol-log') {
      this.openModal('climbing');
    } else {
      this.openModal(id);
    }
  }

  onNodeHover(key: string, isHovering: boolean, quadrant: 'q1' | 'q3' | 'q4' = 'q4') {
    const collection = quadrant === 'q1' ? this.q1Nodes : (quadrant === 'q3' ? this.q3Nodes : this.q4Nodes);
    if (collection[key]) {
      collection[key].targetScale = isHovering ? 0.05 : 1;
    }
  }

  runMedicalInference() {
    if (this.isSegmenting) return;
    
    this.isSegmenting = true;
    this.segmentationProgress = 0;
    this.diceScore = 0.00;
    this.inferenceLatency = 0;
    this.segmentationPoints = '';

    const duration = 2000; // 2 segundos de simulación de inferencia GPU
    const start = performance.now();

    const step = (now: number) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      
      this.segmentationProgress = Math.round(progress * 100);

      // Simular el trazado progresivo de la máscara de segmentación (SVG Polygon)
      if (progress > 0.2) {
        const points: string[] = [];
        const numPoints = 12;
        const centerX = 150;
        const centerY = 100;
        const baseRadius = 45;

        for (let i = 0; i < numPoints; i++) {
          const angle = (i / numPoints) * Math.PI * 2;
          // Generar ruido orgánico para simular formas anatómicas reales
          const noise = Math.sin(angle * 3 + progress * 10) * 8 * (progress);
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
        // Inferencia completada: fijar métricas realistas basadas en tu modelo
        this.isSegmenting = false;
        this.diceScore = parseFloat((0.89 + Math.random() * 0.06).toFixed(3)); // Dice score real (89% - 95%)
        this.inferenceLatency = Math.round(18 + Math.random() * 6); // ~20ms latency
      }
    };

    requestAnimationFrame(step);
  }

  changeSlice(direction: 'next' | 'prev') {
    if (direction === 'next' && this.activeSlice < 48) this.activeSlice++;
    if (direction === 'prev' && this.activeSlice > 1) this.activeSlice--;
    // Reiniciar segmentación al cambiar de slide para dar feedback interactivo
    this.segmentationPoints = '';
    this.diceScore = 0;
  }

  // Métodos del Carrusel de Fit Forge
  prevFitForge() {
    this.fitForgeIndex = (this.fitForgeIndex === 0) ? this.fitForgeSlides.length - 1 : this.fitForgeIndex - 1;
  }

  nextFitForge() {
    this.fitForgeIndex = (this.fitForgeIndex === this.fitForgeSlides.length - 1) ? 0 : this.fitForgeIndex + 1;
  }

  setFitForgeSlide(index: number) {
    this.fitForgeIndex = index;
  }

  // Métodos del Carrusel de Legacy Land Mapper
  prevMapper() {
    this.mapperIndex = (this.mapperIndex === 0) ? this.mapperSlides.length - 1 : this.mapperIndex - 1;
  }

  nextMapper() {
    this.mapperIndex = (this.mapperIndex === this.mapperSlides.length - 1) ? 0 : this.mapperIndex + 1;
  }

  setMapperSlide(index: number) {
    this.mapperIndex = index;
  }

  private renderHobbiesPyramid(time: number) {
    const container = this.q3Container?.nativeElement;
    if (!container) return;
    const w = container.clientWidth;
    const h = container.clientHeight;

    const coords: Record<string, { x: number; y: number }> = {};
    const refs: Record<string, HTMLElement | undefined> = {
      me: this.nodeMe?.nativeElement,
      tennis: this.nodeTennis?.nativeElement,
      futbol: this.nodeFutbol?.nativeElement,
      climbing: this.nodeClimbing?.nativeElement,
      sub1: this.nodeSub1?.nativeElement,
      sub2: this.nodeSub2?.nativeElement,
      sub3: this.nodeSub3?.nativeElement,
      sub4: this.nodeSub4?.nativeElement,
      sub5: this.nodeSub5?.nativeElement,
      sub6: this.nodeSub6?.nativeElement
    };

    if (!refs['me'] || !refs['tennis'] || !refs['futbol'] || !refs['climbing'] ||
        !refs['sub1'] || !refs['sub2'] || !refs['sub3'] || !refs['sub4'] || !refs['sub5'] || !refs['sub6']) return;

    // Calcular oscilación individual y desplazar por GPU
    Object.keys(this.q3Nodes).forEach(key => {
      const node = this.q3Nodes[key];
      const el = refs[key];
      if (!el) return;

      node.currentScale += (node.targetScale - node.currentScale) * 0.1;
      node.x = Math.sin(time * node.speedX + node.phaseX) * node.ampX * node.currentScale;
      node.y = Math.cos(time * node.speedY + node.phaseY) * node.ampY * node.currentScale;

      el.style.left = `calc(${node.basePctX * 100}% - ${el.clientWidth / 2}px)`;
      el.style.top = `calc(${node.basePctY * 100}% - ${el.clientHeight / 2}px)`;
      el.style.transform = `translate3d(${node.x}px, ${node.y}px, 0)`;

      coords[key] = { x: (w * node.basePctX) + node.x, y: (h * node.basePctY) + node.y };
    });

    // Redibujar las cuerdas elásticas de la pirámide
    if (coords['me'] && coords['tennis'] && coords['futbol'] && coords['climbing']) {
      const pMe = coords['me'], pTen = coords['tennis'], pFut = coords['futbol'], pCli = coords['climbing'];

      // Conexiones nivel 1 -> nivel 2
      this.pathMeTennis?.nativeElement?.setAttribute('d', `M ${pMe.x} ${pMe.y} C ${pMe.x - w*0.1} ${pMe.y}, ${pTen.x} ${pTen.y - h*0.05}, ${pTen.x} ${pTen.y}`);
      this.pathMeFutbol?.nativeElement?.setAttribute('d', `M ${pMe.x} ${pMe.y} L ${pFut.x} ${pFut.y}`);
      this.pathMeClimbing?.nativeElement?.setAttribute('d', `M ${pMe.x} ${pMe.y} C ${pMe.x + w*0.1} ${pMe.y}, ${pCli.x} ${pCli.y - h*0.05}, ${pCli.x} ${pCli.y}`);

      // Conexiones nivel 2 -> nivel 3 (Sub-nodos de expansión)
      this.pathTennisSub1?.nativeElement?.setAttribute('d', `M ${pTen.x} ${pTen.y} L ${coords['sub1'].x} ${coords['sub1'].y}`);
      this.pathTennisSub2?.nativeElement?.setAttribute('d', `M ${pTen.x} ${pTen.y} L ${coords['sub2'].x} ${coords['sub2'].y}`);
      this.pathFutbolSub3?.nativeElement?.setAttribute('d', `M ${pFut.x} ${pFut.y} L ${coords['sub3'].x} ${coords['sub3'].y}`);
      this.pathFutbolSub4?.nativeElement?.setAttribute('d', `M ${pFut.x} ${pFut.y} L ${coords['sub4'].x} ${coords['sub4'].y}`);
      this.pathClimbingSub5?.nativeElement?.setAttribute('d', `M ${pCli.x} ${pCli.y} L ${coords['sub5'].x} ${coords['sub5'].y}`);
      this.pathClimbingSub6?.nativeElement?.setAttribute('d', `M ${pCli.x} ${pCli.y} L ${coords['sub6'].x} ${coords['sub6'].y}`);
    }
  }
}
