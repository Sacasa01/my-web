import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  QueryList,
  SimpleChanges,
  ViewChildren,
  signal
} from '@angular/core';
import { CommonModule } from '@angular/common';

export type AvatarState = 'TYPING' | 'GREETING' | 'CHAT_IDLE' | 'TALKING' | 'RETURNING';

interface VideoDefinition {
  state: AvatarState;
  srcMp4: string;
  srcWebm: string;
  loop: boolean;
}

@Component({
  selector: 'app-avatar-container',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="relative w-full max-w-[620px] mx-auto flex flex-col items-center justify-center select-none">

      <!-- Video Stage Container with Radial Edge Feathering Mask -->
      <div
        (click)="onAvatarClicked()"
        [style.maskImage]="'radial-gradient(circle at center, black 70%, transparent 100%)'"
        [style.WebkitMaskImage]="'radial-gradient(circle at center, black 70%, transparent 100%)'"
        class="relative w-full aspect-[16/10] sm:aspect-[16/9.5] max-h-[390px] sm:max-h-[420px] overflow-hidden cursor-pointer group flex items-center justify-center transition-transform duration-300 hover:scale-[1.01]">

        @for (item of videoList; track item.state) {
          <video
            #videoElement
            [attr.data-state]="item.state"
            [src]="item.srcMp4"
            [loop]="item.loop"
            muted
            playsinline
            preload="auto"
            (ended)="onVideoEnded(item.state)"
            class="absolute inset-0 w-full h-full object-contain pointer-events-none transition-opacity duration-500 ease-in-out"
            [class.opacity-100]="currentState() === item.state"
            [class.opacity-0]="currentState() !== item.state">
          </video>
        }

        <!-- Ambient Studio Blend Overlay -->
        <div class="absolute inset-0 pointer-events-none bg-gradient-to-t from-[#d6d6d6]/30 via-transparent to-[#d6d6d6]/10"></div>
      </div>

      <!-- Subtle Prompt Cue (Active only in initial idle) -->
      @if (currentState() === 'TYPING') {
        <p class="text-[10px] sm:text-[11px] font-mono font-medium text-[#475569] tracking-wider uppercase mt-1 animate-pulse">
          {{ lang === 'en' ? 'Click avatar to talk with Santiago AI Twin' : 'Haz clic en el avatar para hablar con su gemelo' }}
        </p>
      }

    </div>
  `,
  styles: [`
    :host {
      display: block;
      width: 100%;
      position: relative;
    }
  `]
})
export class AvatarContainerComponent implements OnInit, OnChanges, OnDestroy {
  @ViewChildren('videoElement') videoElements!: QueryList<ElementRef<HTMLVideoElement>>;

  @Input() state: AvatarState = 'TYPING';
  @Input() lang: 'en' | 'es' = 'en';

  @Output() avatarClick = new EventEmitter<void>();
  @Output() stateChange = new EventEmitter<AvatarState>();

  currentState = signal<AvatarState>('TYPING');
  private pauseTimeout: any = null;

  readonly videoList: VideoDefinition[] = [
    { state: 'TYPING', srcMp4: '/videos/avatar-typing-loop.mp4', srcWebm: '/videos/avatar-typing-loop.webm', loop: true },
    { state: 'GREETING', srcMp4: '/videos/avatar-greeting.mp4', srcWebm: '/videos/avatar-greeting.webm', loop: false },
    { state: 'CHAT_IDLE', srcMp4: '/videos/avatar-chat-idle.mp4', srcWebm: '/videos/avatar-chat-idle.webm', loop: true },
    { state: 'TALKING', srcMp4: '/videos/avatar-talking.mp4', srcWebm: '/videos/avatar-talking.webm', loop: true },
    { state: 'RETURNING', srcMp4: '/videos/avatar-return.mp4', srcWebm: '/videos/avatar-return.webm', loop: false }
  ];

  ngOnInit() {
    this.currentState.set(this.state);
  }

  ngAfterViewInit() {
    this.syncActiveVideo();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['state'] && !changes['state'].firstChange) {
      this.currentState.set(this.state);
      this.syncActiveVideo();
    }
  }

  ngOnDestroy() {
    if (this.pauseTimeout) clearTimeout(this.pauseTimeout);
  }

  private syncActiveVideo() {
    if (!this.videoElements) return;

    const targetState = this.currentState();

    this.videoElements.forEach(elRef => {
      const video = elRef.nativeElement;
      const stateAttr = video.getAttribute('data-state') as AvatarState;

      if (stateAttr === targetState) {
        video.currentTime = 0;
        video.play().catch(err => console.warn('Autoplay error:', err));
      }
    });

    if (this.pauseTimeout) clearTimeout(this.pauseTimeout);

    // Pause inactive videos after cross-fade duration (500ms)
    this.pauseTimeout = setTimeout(() => {
      if (!this.videoElements) return;
      this.videoElements.forEach(elRef => {
        const video = elRef.nativeElement;
        const stateAttr = video.getAttribute('data-state') as AvatarState;
        if (stateAttr !== targetState && !video.paused) {
          video.pause();
        }
      });
    }, 520);
  }

  onVideoEnded(endedState: AvatarState) {
    if (endedState === 'GREETING') {
      this.currentState.set('CHAT_IDLE');
      this.stateChange.emit('CHAT_IDLE');
      this.syncActiveVideo();
    } else if (endedState === 'RETURNING') {
      this.currentState.set('TYPING');
      this.stateChange.emit('TYPING');
      this.syncActiveVideo();
    }
  }

  onAvatarClicked() {
    if (this.currentState() === 'TYPING') {
      this.currentState.set('GREETING');
      this.stateChange.emit('GREETING');
      this.syncActiveVideo();
    }
    this.avatarClick.emit();
  }
}
