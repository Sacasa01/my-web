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
  isDarkMode = false;

  ngOnInit() {
    // Detectar preferencia de sistema o guardada
    const preferredTheme = localStorage.getItem('theme');
    if (preferredTheme === 'dark' || (!preferredTheme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      this.enableDarkMode();
    }
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
}
