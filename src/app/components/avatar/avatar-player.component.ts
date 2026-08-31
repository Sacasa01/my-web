import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild,
  signal
} from '@angular/core';
import { CommonModule } from '@angular/common';

export type AvatarState = 'TYPING' | 'GREETING' | 'CHAT_IDLE' | 'TALKING' | 'RETURNING';

interface VideoConfig {
  srcWebm: string;
  srcMp4: string;
  loop: boolean;
  nextStateOnEnd?: AvatarState;
}

@Component({
  selector: 'app-avatar-player',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div
      class="relative w-full max-w-[640px] mx-auto flex flex-col items-center justify-center select-none"
      (mouseenter)="isHovered.set(true)"
      (mouseleave)="isHovered.set(false)">

      <!-- Interactive Contextual Badge / Tooltip -->
      <div
        class="absolute -top-8 z-30 transition-all duration-300 transform pointer-events-none"
        [class.opacity-100]="isHovered() || currentState() !== 'TYPING'"
        [class.translate-y-0]="isHovered() || currentState() !== 'TYPING'"
        [class.opacity-0]="!isHovered() && currentState() === 'TYPING'"
        [class.translate-y-2]="!isHovered() && currentState() === 'TYPING'">
        <div class="px-4 py-1.5 rounded-full bg-[#1e293b]/95 backdrop-blur-md border border-white/20 shadow-lg flex items-center gap-2">
          <span class="w-2 h-2 rounded-full"
                [ngClass]="{
                  'bg-emerald-400 animate-pulse': currentState() === 'TYPING',
                  'bg-amber-400 animate-bounce': currentState() === 'GREETING',
                  'bg-sky-400 animate-pulse': currentState() === 'CHAT_IDLE',
                  'bg-rose-400 animate-pulse': currentState() === 'TALKING',
                  'bg-indigo-400': currentState() === 'RETURNING'
                }"></span>
          <span class="font-space text-xs font-bold text-white tracking-wide whitespace-nowrap">
            {{ getStatusText() }}
          </span>
        </div>
        <div class="w-2.5 h-2.5 bg-[#1e293b] border-r border-b border-white/20 transform rotate-45 mx-auto -mt-1"></div>
      </div>

      <!-- Overlapping Seamless Dual-Video Player with CSS Cross-fade -->
      <div
        (click)="onAvatarClicked()"
        class="relative w-full aspect-[16/10] sm:aspect-[16/9.5] max-h-[380px] sm:max-h-[420px] rounded-2xl overflow-hidden cursor-pointer group flex items-center justify-center transition-transform duration-300 hover:scale-[1.015]">

        <!-- Video Player 1 -->
        <video
          #playerA
          playsinline
          muted
          preload="auto"
          class="absolute inset-0 w-full h-full object-contain pointer-events-none transition-opacity duration-300 ease-in-out"
          [style.opacity]="activePlayer() === 'A' ? 1 : 0"
          (ended)="onPlayerEnded('A')">
        </video>

        <!-- Video Player 2 -->
        <video
          #playerB
          playsinline
          muted
          preload="auto"
          class="absolute inset-0 w-full h-full object-contain pointer-events-none transition-opacity duration-300 ease-in-out"
          [style.opacity]="activePlayer() === 'B' ? 1 : 0"
          (ended)="onPlayerEnded('B')">
        </video>

        <!-- Studio Light Gradient Overlay for Zero-Border Blending -->
        <div class="absolute inset-0 pointer-events-none bg-gradient-to-t from-[#d6d6d6]/40 via-transparent to-[#d6d6d6]/20"></div>
      </div>

      <!-- Manual State Debug / Action Strip -->
      <div class="mt-2.5 flex items-center gap-2 flex-wrap justify-center z-20">
        <button
          (click)="setState('TYPING')"
          [ngClass]="currentState() === 'TYPING' ? 'bg-[#1e293b] text-white shadow-md' : 'bg-black/5 text-[#1e293b] hover:bg-black/10'"
          class="px-3 py-1 rounded-full border border-black/10 text-[10px] sm:text-[11px] font-mono font-bold uppercase tracking-wider transition-all cursor-pointer active:scale-95">
          💻 TYPING
        </button>

        <button
          (click)="onAvatarClicked()"
          [ngClass]="currentState() === 'GREETING' ? 'bg-[#1e293b] text-white shadow-md' : 'bg-black/5 text-[#1e293b] hover:bg-black/10'"
          class="px-3 py-1 rounded-full border border-black/10 text-[10px] sm:text-[11px] font-mono font-bold uppercase tracking-wider transition-all cursor-pointer active:scale-95">
          👋 GREETING
        </button>

        <button
          (click)="setState('CHAT_IDLE')"
          [ngClass]="currentState() === 'CHAT_IDLE' ? 'bg-[#1e293b] text-white shadow-md' : 'bg-black/5 text-[#1e293b] hover:bg-black/10'"
          class="px-3 py-1 rounded-full border border-black/10 text-[10px] sm:text-[11px] font-mono font-bold uppercase tracking-wider transition-all cursor-pointer active:scale-95">
          🎧 CHAT_IDLE
        </button>

        <button
          (click)="setState('TALKING')"
          [ngClass]="currentState() === 'TALKING' ? 'bg-[#1e293b] text-white shadow-md' : 'bg-black/5 text-[#1e293b] hover:bg-black/10'"
          class="px-3 py-1 rounded-full border border-black/10 text-[10px] sm:text-[11px] font-mono font-bold uppercase tracking-wider transition-all cursor-pointer active:scale-95">
          💬 TALKING
        </button>

        <button
          (click)="setState('RETURNING')"
          [ngClass]="currentState() === 'RETURNING' ? 'bg-[#1e293b] text-white shadow-md' : 'bg-black/5 text-[#1e293b] hover:bg-black/10'"
          class="px-3 py-1 rounded-full border border-black/10 text-[10px] sm:text-[11px] font-mono font-bold uppercase tracking-wider transition-all cursor-pointer active:scale-95">
          ↩ RETURNING
        </button>
      </div>

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
export class AvatarPlayerComponent implements OnInit, OnChanges, OnDestroy {
  @ViewChild('playerA') playerA!: ElementRef<HTMLVideoElement>;
  @ViewChild('playerB') playerB!: ElementRef<HTMLVideoElement>;

  @Input() state: AvatarState = 'TYPING';
  @Input() lang: 'en' | 'es' = 'en';

  @Output() avatarClick = new EventEmitter<void>();
  @Output() stateChange = new EventEmitter<AvatarState>();

  currentState = signal<AvatarState>('TYPING');
  activePlayer = signal<'A' | 'B'>('A');
  isHovered = signal(false);

  private readonly videoMap: Record<AvatarState, VideoConfig> = {
    TYPING: {
      srcWebm: '/videos/avatar-typing-loop.webm',
      srcMp4: '/videos/avatar-typing-loop.mp4',
      loop: true
    },
    GREETING: {
      srcWebm: '/videos/avatar-greeting.webm',
      srcMp4: '/videos/avatar-greeting.mp4',
      loop: false,
      nextStateOnEnd: 'CHAT_IDLE'
    },
    CHAT_IDLE: {
      srcWebm: '/videos/avatar-chat-idle.webm',
      srcMp4: '/videos/avatar-chat-idle.mp4',
      loop: true
    },
    TALKING: {
      srcWebm: '/videos/avatar-talking.webm',
      srcMp4: '/videos/avatar-talking.mp4',
      loop: true
    },
    RETURNING: {
      srcWebm: '/videos/avatar-return.webm',
      srcMp4: '/videos/avatar-return.mp4',
      loop: false,
      nextStateOnEnd: 'TYPING'
    }
  };

  ngOnInit() {
    this.currentState.set(this.state);
  }

  ngAfterViewInit() {
    this.playVideoState(this.currentState(), false);
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['state'] && !changes['state'].firstChange) {
      this.setState(this.state);
    }
  }

  ngOnDestroy() {
    if (this.playerA?.nativeElement) this.playerA.nativeElement.pause();
    if (this.playerB?.nativeElement) this.playerB.nativeElement.pause();
  }

  setState(newState: AvatarState) {
    if (this.currentState() === newState && this.isPlaying()) return;
    this.currentState.set(newState);
    this.stateChange.emit(newState);
    this.playVideoState(newState, true);
  }

  private isPlaying(): boolean {
    const el = this.activePlayer() === 'A' ? this.playerA?.nativeElement : this.playerB?.nativeElement;
    return el ? !el.paused : false;
  }

  private playVideoState(state: AvatarState, crossfade: boolean) {
    const config = this.videoMap[state];
    const currentPlayer = this.activePlayer();
    const nextPlayer = currentPlayer === 'A' ? 'B' : 'A';

    const currentEl = currentPlayer === 'A' ? this.playerA?.nativeElement : this.playerB?.nativeElement;
    const nextEl = nextPlayer === 'A' ? this.playerA?.nativeElement : this.playerB?.nativeElement;

    if (!nextEl) return;

    // Use .mp4 / .webm source
    nextEl.src = config.srcMp4;
    nextEl.loop = config.loop;
    nextEl.currentTime = 0;

    nextEl.play().then(() => {
      this.activePlayer.set(nextPlayer);
      if (currentEl && crossfade) {
        setTimeout(() => {
          currentEl.pause();
        }, 300);
      }
    }).catch(err => {
      console.warn('Autoplay prevented by browser:', err);
    });
  }

  onPlayerEnded(player: 'A' | 'B') {
    if (this.activePlayer() !== player) return;

    const config = this.videoMap[this.currentState()];
    if (config.nextStateOnEnd) {
      this.setState(config.nextStateOnEnd);
    }
  }

  onAvatarClicked() {
    if (this.currentState() === 'TYPING') {
      this.setState('GREETING');
    }
    this.avatarClick.emit();
  }

  getStatusText(): string {
    const s = this.currentState();
    if (this.lang === 'en') {
      switch (s) {
        case 'TYPING': return '💻 Santiago is coding (Click to interact)';
        case 'GREETING': return '👋 "Hello! Welcome to my portfolio"';
        case 'CHAT_IDLE': return '🎧 Receptive & listening to your questions';
        case 'TALKING': return '💬 Explaining architecture & systems...';
        case 'RETURNING': return '↩ Returning to work...';
      }
    } else {
      switch (s) {
        case 'TYPING': return '💻 Santiago está programando (Haz clic para hablar)';
        case 'GREETING': return '👋 "¡Hola! Bienvenido a mi portfolio"';
        case 'CHAT_IDLE': return '🎧 Receptivo y escuchando tus preguntas';
        case 'TALKING': return '💬 Explicando arquitectura y sistemas...';
        case 'RETURNING': return '↩ Retomando el teclado...';
      }
    }
  }
}
