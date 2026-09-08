import { Component, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';

type Lang = 'en' | 'es';
type Theme = 'light' | 'dark';

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

  // Computed background colors that match the character image edges
  bgColor = computed(() => this.theme() === 'light' ? '#d5d3d3' : '#1a1a1c');
  textColor = computed(() => this.theme() === 'light' ? '#1a1a1c' : '#f0eded');
  mutedColor = computed(() => this.theme() === 'light' ? '#6b6868' : '#9a9797');

  translations = {
    en: {
      greeting: 'Hi, I\'m',
      name: 'Santiago',
      surname: 'Castro Salt',
      role: 'Full-Stack Developer & AI Systems Integrator',
      location: 'Valencia, Spain → Dublin, Ireland',
      cta: 'See my work'
    },
    es: {
      greeting: 'Hola, soy',
      name: 'Santiago',
      surname: 'Castro Salt',
      role: 'Desarrollador Full-Stack & Integrador de Sistemas IA',
      location: 'Valencia, España → Dublín, Irlanda',
      cta: 'Ver mi trabajo'
    }
  };

  t = computed(() => this.translations[this.lang()]);

  toggleLang() {
    this.lang.update(l => l === 'en' ? 'es' : 'en');
  }

  toggleTheme() {
    this.theme.update(t => {
      const next = t === 'light' ? 'dark' : 'light';
      document.documentElement.classList.toggle('dark', next === 'dark');
      document.documentElement.classList.toggle('light', next === 'light');
      return next;
    });
  }
}
