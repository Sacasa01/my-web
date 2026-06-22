import { Directive, ElementRef, NgZone, OnInit, OnDestroy, HostListener, inject } from '@angular/core';

@Directive({
  selector: '[appBoundFloating]',
  standalone: true
})
export class BoundFloatingDirective implements OnInit, OnDestroy {
  private el = inject(ElementRef);
  private ngZone = inject(NgZone);
  private animationFrameId?: number;

  private x = 0;
  private y = 0;
  private ampX = Math.random() * 4 + 4;         // Oscilación fina de 4px a 8px
  private ampY = Math.random() * 4 + 4;
  private speedX = Math.random() * 0.0012 + 0.0006;
  private speedY = Math.random() * 0.0012 + 0.0006;
  private phaseX = Math.random() * Math.PI * 2;
  private phaseY = Math.random() * Math.PI * 2;

  private targetScale = 1;
  private currentScale = 1;

  ngOnInit() {
    this.ngZone.runOutsideAngular(() => {
      const animate = (time: number) => {
        this.currentScale += (this.targetScale - this.currentScale) * 0.1;
        
        this.x = Math.sin(time * this.speedX + this.phaseX) * this.ampX * this.currentScale;
        this.y = Math.cos(time * this.speedY + this.phaseY) * this.ampY * this.currentScale;

        const nativeEl = this.el.nativeElement as HTMLElement;
        if (this.targetScale === 1) {
          nativeEl.style.transform = `translate3d(${this.x}px, ${this.y}px, 0)`;
        }
        
        this.animationFrameId = requestAnimationFrame(animate);
      };
      this.animationFrameId = requestAnimationFrame(animate);
    });
  }

  ngOnDestroy() {
    if (this.animationFrameId) cancelAnimationFrame(this.animationFrameId);
  }

  @HostListener('mouseenter')
  onMouseEnter() {
    this.targetScale = 0.1; // Frena al entrar para posibilitar clics
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
