import { Directive, ElementRef, NgZone, OnInit, OnDestroy, HostListener, inject } from '@angular/core';

@Directive({
  selector: '[appBoundFloating]',
  standalone: true
})
export class BoundFloatingDirective implements OnInit, OnDestroy {
  private el = inject(ElementRef);
  private ngZone = inject(NgZone);
  private animationFrameId?: number;

  // Movimiento sutil y lento
  private x = 0;
  private y = 0;
  private amplitudeX = Math.random() * 6 + 6;     // Oscilación máxima de 6px a 12px
  private amplitudeY = Math.random() * 6 + 6;
  private speedX = Math.random() * 0.0008 + 0.0004; // Muy lento
  private speedY = Math.random() * 0.0008 + 0.0004;
  private phaseX = Math.random() * Math.PI * 2;
  private phaseY = Math.random() * Math.PI * 2;
  
  private targetScale = 1;
  private currentScale = 1;

  ngOnInit() {
    this.ngZone.runOutsideAngular(() => {
      const animate = (time: number) => {
        this.currentScale += (this.targetScale - this.currentScale) * 0.08;

        this.x = Math.sin(time * this.speedX + this.phaseX) * this.amplitudeX * this.currentScale;
        this.y = Math.cos(time * this.speedY + this.phaseY) * this.amplitudeY * this.currentScale;

        const nativeEl = this.el.nativeElement as HTMLElement;
        nativeEl.style.transform = `translate3d(${this.x.toFixed(3)}px, ${this.y.toFixed(3)}px, 0)`;

        this.animationFrameId = requestAnimationFrame(animate);
      };
      this.animationFrameId = requestAnimationFrame(animate);
    });
  }

  ngOnDestroy() {
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
    }
  }

  @HostListener('mouseenter')
  onMouseEnter() {
    this.targetScale = 0.1; // Se detiene casi al completo para poder interactuar
    const nativeEl = this.el.nativeElement as HTMLElement;
    nativeEl.style.transform = 'scale(1.05)';
    nativeEl.style.transition = 'transform 0.3s cubic-bezier(0.16, 1, 0.3, 1)';
  }

  @HostListener('mouseleave')
  onMouseLeave() {
    this.targetScale = 1;
    const nativeEl = this.el.nativeElement as HTMLElement;
    nativeEl.style.transition = 'none';
  }
}
