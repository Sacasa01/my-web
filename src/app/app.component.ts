import { Component, OnInit, Renderer2, inject, signal } from '@angular/core';
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
export class AppComponent implements OnInit {
  private renderer = inject(Renderer2);

  isDarkMode = false;
  currentLang: 'en' | 'es' = 'en';
  private maxZIndex = 100;

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
}
