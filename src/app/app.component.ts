import { Component, OnInit, Renderer2, inject } from '@angular/core';
import { BoundFloatingDirective } from './shared/directives/bound-floating.directive';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [BoundFloatingDirective],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  private renderer = inject(Renderer2);
  
  // Estado del Tema
  isDarkMode = false;
  
  // Estado de Idioma (Inglés por defecto)
  currentLang: 'en' | 'es' = 'en';

  // Diccionario de Traducciones para el Tablero
  translations = {
    en: {
      subtitle: 'Full-Stack Engineer & AI Developer',
      q1: '01 // WORK EXPERIENCE',
      q2: '02 // PROJECTS',
      q3: '03 // ME & HOBBIES',
      q4: '04 // EDUCATION AND CERTIFICATES'
    },
    es: {
      subtitle: 'Ingeniero Full-Stack & Desarrollador de IA',
      q1: '01 // EXPERIENCIA LABORAL',
      q2: '02 // PROYECTOS',
      q3: '03 // SOBRE MÍ Y HOBBIES',
      q4: '04 // EDUCACIÓN Y CERTIFICACIONES'
    }
  };

  ngOnInit() {
    // Inicializar Tema
    const preferredTheme = localStorage.getItem('theme');
    if (preferredTheme === 'dark' || (!preferredTheme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      this.enableDarkMode();
    }

    // Inicializar Idioma
    const preferredLang = localStorage.getItem('lang') as 'en' | 'es';
    if (preferredLang) {
      this.currentLang = preferredLang;
    }
  }

  // Alternar entre Inglés y Español
  toggleLanguage() {
    this.currentLang = this.currentLang === 'en' ? 'es' : 'en';
    localStorage.setItem('lang', this.currentLang);
  }

  // Alternar Modo de Luz / Oscuro
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
}
