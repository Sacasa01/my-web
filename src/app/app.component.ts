import { Component, OnInit, Renderer2, inject, signal } from '@angular/core';
import { BoundFloatingDirective } from './shared/directives/bound-floating.directive';
import { CommonModule } from '@angular/common';

interface WindowState {
  id: string;
  titleEn: string;
  titleEs: string;
  isOpen: boolean;
  isMaximized: boolean;
  zIndex: number;
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [BoundFloatingDirective, CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  private renderer = inject(Renderer2);

  // Estados Globales
  isDarkMode = false;
  currentLang: 'en' | 'es' = 'en';
  private maxZIndex = 100;

  // Signal para manejar las ventanas de forma ultra-reactiva
  windows = signal<WindowState[]>([
    { id: 'lafe', titleEn: 'Fertoolity AI Lab', titleEs: 'Lab Fertoolity IA', isOpen: false, isMaximized: false, zIndex: 100 },
    { id: 'fitforge', titleEn: 'Fit Forge SPA', titleEs: 'Fit Forge SPA', isOpen: false, isMaximized: false, zIndex: 100 },
    { id: 'mapper', titleEn: 'Legacy Land Mapper', titleEs: 'Mapeador de Parcelas', isOpen: false, isMaximized: false, zIndex: 100 },
    { id: 'climbing', titleEn: 'Climbing Wall Tracker', titleEs: 'Rutas de Escalada', isOpen: false, isMaximized: false, zIndex: 100 },
    { id: 'canterbury', titleEn: 'Canterbury Terminal', titleEs: 'Terminal Canterbury', isOpen: false, isMaximized: false, zIndex: 100 }
  ]);

  // Diccionario general de traducciones de cabecera
  translations = {
    en: {
      subtitle: 'Full-Stack Engineer & AI Developer',
      q1: '01 // WORK EXPERIENCE',
      q2: '02 // PROJECTS',
      q3: '03 // ME & HOBBIES',
      q4: '04 // EDUCATION AND CERTIFICATES',
      close: 'Close',
      maximize: 'Maximize',
      minimize: 'Minimize'
    },
    es: {
      subtitle: 'Ingeniero Full-Stack & Desarrollador de IA',
      q1: '01 // EXPERIENCIA LABORAL',
      q2: '02 // PROYECTOS',
      q3: '03 // SOBRE MÍ Y HOBBIES',
      q4: '04 // EDUCACIÓN Y CERTIFICACIONES',
      close: 'Cerrar',
      maximize: 'Maximizar',
      minimize: 'Minimizar'
    }
  };

  ngOnInit() {
    // Inicialización de Tema e Idioma
    const preferredTheme = localStorage.getItem('theme');
    if (preferredTheme === 'dark' || (!preferredTheme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      this.enableDarkMode();
    }
    const preferredLang = localStorage.getItem('lang') as 'en' | 'es';
    if (preferredLang) {
      this.currentLang = preferredLang;
    }
  }

  toggleLanguage() {
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

  // --- CONTROLADOR DE VENTANAS ---
  openWindow(id: string) {
    this.maxZIndex++;
    this.windows.update(items => 
      items.map(w => w.id === id ? { ...w, isOpen: true, zIndex: this.maxZIndex } : w)
    );
  }

  closeWindow(id: string, event?: Event) {
    if (event) event.stopPropagation();
    this.windows.update(items => 
      items.map(w => w.id === id ? { ...w, isOpen: false } : w)
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
}
