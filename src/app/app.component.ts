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

  // Referencias a los elementos del timeline en Q4
  @ViewChild('q4Container') q4Container!: ElementRef<HTMLElement>;
  @ViewChild('nodeBach') nodeBach!: ElementRef<HTMLElement>;
  @ViewChild('nodeDaw') nodeDaw!: ElementRef<HTMLElement>;
  @ViewChild('nodeAws') nodeAws!: ElementRef<HTMLElement>;
  @ViewChild('nodeCant') nodeCant!: ElementRef<HTMLElement>;
  @ViewChild('pathBachDaw') pathBachDaw!: ElementRef<SVGPathElement>;
  @ViewChild('pathDawCant') pathDawCant!: ElementRef<SVGPathElement>;
  @ViewChild('pathDawAws') pathDawAws!: ElementRef<SVGPathElement>;

  // Coeficientes físicos de oscilación para los nodos de Q4
  private q4Nodes: Record<string, { x: number; y: number; ampX: number; ampY: number; speedX: number; speedY: number; phaseX: number; phaseY: number; targetScale: number; currentScale: number; basePctX: number; basePctY: number }> = {
    bach: { x: 0, y: 0, ampX: 6, ampY: 6, speedX: 0.0010, speedY: 0.0012, phaseX: 1.2, phaseY: 3.4, targetScale: 1, currentScale: 1, basePctX: 0.86, basePctY: 0.60 },
    daw:  { x: 0, y: 0, ampX: 7, ampY: 7, speedX: 0.0008, speedY: 0.0009, phaseX: 2.5, phaseY: 0.8, targetScale: 1, currentScale: 1, basePctX: 0.57, basePctY: 0.58 },
    aws:  { x: 0, y: 0, ampX: 5, ampY: 5, speedX: 0.0014, speedY: 0.0011, phaseX: 0.3, phaseY: 4.1, targetScale: 1, currentScale: 1, basePctX: 0.435, basePctY: 0.30 },
    cant: { x: 0, y: 0, ampX: 8, ampY: 8, speedX: 0.0007, speedY: 0.0008, phaseX: 4.7, phaseY: 2.1, targetScale: 1, currentScale: 1, basePctX: 0.18, basePctY: 0.52 }
  };

  // Modales interactivos
  windows = signal<WindowState[]>([
    { id: 'lafe', isOpen: false, isMaximized: false, zIndex: 100 },
    { id: 'fitforge', isOpen: false, isMaximized: false, zIndex: 100 },
    { id: 'mapper', isOpen: false, isMaximized: false, zIndex: 100 },
    { id: 'climbing', isOpen: false, isMaximized: false, zIndex: 100 },
    { id: 'canterbury', isOpen: false, isMaximized: false, zIndex: 100 }
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
      sports_desc: 'Interactive track of boulder difficulty levels (V4 to V8). Tracks sessions, hold-types, and physical metrics over time.'
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
      sports_desc: 'Registro interactivo de ascensiones y grados de dificultad en bloque. Monitorización de tipos de presas y métricas de rendimiento.'
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
      aws:  this.nodeAws?.nativeElement,
      cant: this.nodeCant?.nativeElement
    };

    Object.keys(this.q4Nodes).forEach(key => {
      const node = this.q4Nodes[key];
      const el = refs[key];
      if (!el) return;

      node.currentScale += (node.targetScale - node.currentScale) * 0.1;

      node.x = Math.sin(time * node.speedX + node.phaseX) * node.ampX * node.currentScale;
      node.y = Math.cos(time * node.speedY + node.phaseY) * node.ampY * node.currentScale;

      el.style.left = `calc(${node.basePctX * 100}% - ${el.clientWidth / 2}px)`;
      el.style.top = `calc(${node.basePctY * 100}% - ${el.clientHeight / 2}px)`;
      el.style.transform = `translate3d(${node.x}px, ${node.y}px, 0)`;

      coords[key] = {
        x: w * node.basePctX + node.x,
        y: h * node.basePctY + node.y
      };
    });

    if (coords['bach'] && coords['daw'] && coords['aws'] && coords['cant']) {
      const pBach = coords['bach'];
      const pDaw = coords['daw'];
      const pAws = coords['aws'];
      const pCant = coords['cant'];

      const d1 = `M ${pBach.x} ${pBach.y} C ${pBach.x - w * 0.08} ${pBach.y}, ${pDaw.x + w * 0.08} ${pDaw.y}, ${pDaw.x} ${pDaw.y}`;
      this.pathBachDaw?.nativeElement?.setAttribute('d', d1);

      const d2 = `M ${pDaw.x} ${pDaw.y} C ${pDaw.x - w * 0.12} ${pDaw.y}, ${pCant.x + w * 0.12} ${pCant.y}, ${pCant.x} ${pCant.y}`;
      this.pathDawCant?.nativeElement?.setAttribute('d', d2);

      const d3 = `M ${pDaw.x} ${pDaw.y} C ${pDaw.x - w * 0.03} ${pDaw.y - h * 0.12}, ${pAws.x + w * 0.03} ${pAws.y + h * 0.12}, ${pAws.x} ${pAws.y}`;
      this.pathDawAws?.nativeElement?.setAttribute('d', d3);
    }
  }

  onNodeHover(key: string, isHovering: boolean) {
    if (this.q4Nodes[key]) {
      this.q4Nodes[key].targetScale = isHovering ? 0.05 : 1;
    }
  }
}
