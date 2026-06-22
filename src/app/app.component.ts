import { Component } from '@angular/core';
import { BoundFloatingDirective } from './shared/directives/bound-floating.directive';

@Component({
  selector: 'app-root',
  imports: [BoundFloatingDirective],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'portfolio';
}
