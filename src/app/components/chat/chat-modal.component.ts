import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
  inject
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AiChatService, ChatMessage } from '../../services/ai-chat.service';

@Component({
  selector: 'app-chat-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    @if (isOpen) {
      <div
        class="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/40 backdrop-blur-xs transition-opacity duration-300">

        <!-- Glassmorphism Modal Window with Fade + Scale Animation -->
        <div
          class="relative w-full max-w-lg bg-white/95 backdrop-blur-xl border border-black/10 rounded-3xl shadow-[0_25px_60px_-15px_rgba(0,0,0,0.25)] flex flex-col overflow-hidden animate-modal-enter text-[#0f172a] max-h-[85vh] h-[560px]">

          <!-- Header Bar -->
          <div class="h-14 px-6 border-b border-black/10 flex items-center justify-between bg-white/80 select-none shrink-0">
            <div class="flex items-center gap-3">
              <div class="w-8 h-8 rounded-full bg-gradient-to-tr from-[#1e293b] to-[#475569] flex items-center justify-center text-white text-xs font-bold shadow-xs">
                🤖
              </div>
              <div class="leading-tight">
                <h3 class="font-syne font-bold text-sm text-[#0f172a]">
                  {{ lang === 'en' ? "Santiago's Digital Twin" : 'Gemelo Digital de Santiago' }}
                </h3>
                <div class="flex items-center gap-1.5">
                  <span class="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                  <span class="text-[10px] font-mono text-[#64748b] font-medium">
                    {{ isGenerating ? (lang === 'en' ? 'Streaming response...' : 'Generando respuesta...') : 'Online & Ready' }}
                  </span>
                </div>
              </div>
            </div>

            <!-- Close Button (✕) -> Triggers RETURNING state -->
            <button
              (click)="onClose()"
              class="w-8 h-8 rounded-full bg-black/5 hover:bg-black/10 active:scale-95 text-[#64748b] hover:text-[#0f172a] flex items-center justify-center transition-all cursor-pointer font-mono text-sm font-bold"
              title="Close chat (✕)">
              ✕
            </button>
          </div>

          <!-- Messages Stream Container with Auto-scroll -->
          <div
            #scrollContainer
            class="flex-1 overflow-y-auto p-5 space-y-4 pr-3">
            @for (msg of messages; track $index) {
              <div
                class="flex gap-3"
                [ngClass]="msg.sender === 'user' ? 'justify-end' : 'justify-start'">
                @if (msg.sender === 'ai') {
                  <div class="w-7 h-7 rounded-full bg-[#d97706]/15 border border-[#d97706]/30 flex items-center justify-center shrink-0 mt-0.5 text-xs text-[#d97706] font-bold">
                    🤖
                  </div>
                }
                <div
                  class="max-w-[82%] px-4 py-3 rounded-2xl text-xs sm:text-sm leading-relaxed"
                  [ngClass]="msg.sender === 'user'
                    ? 'bg-[#1e293b] text-white rounded-br-none shadow-sm font-medium'
                    : 'bg-[#f8fafc] border border-black/10 text-[#1e293b] rounded-bl-none shadow-xs font-normal'">
                  <div class="whitespace-pre-wrap">{{ msg.text }}</div>
                  @if (msg.isStreaming) {
                    <span class="inline-block w-1.5 h-3.5 bg-[#d97706] ml-1 animate-pulse align-middle"></span>
                  }
                </div>
              </div>
            }

            @if (isGenerating && !currentStreamingMessage) {
              <div class="flex gap-3 items-center">
                <div class="w-7 h-7 rounded-full bg-[#d97706]/15 border border-[#d97706]/30 flex items-center justify-center shrink-0 text-xs text-[#d97706]">
                  🤖
                </div>
                <div class="bg-[#f8fafc] border border-black/10 px-4 py-3 rounded-2xl rounded-bl-none flex items-center gap-1.5 shadow-xs">
                  <span class="w-1.5 h-1.5 rounded-full bg-[#d97706] animate-bounce" style="animation-delay: 0ms"></span>
                  <span class="w-1.5 h-1.5 rounded-full bg-[#d97706] animate-bounce" style="animation-delay: 150ms"></span>
                  <span class="w-1.5 h-1.5 rounded-full bg-[#d97706] animate-bounce" style="animation-delay: 300ms"></span>
                </div>
              </div>
            }
          </div>

          <!-- Quick Suggestion Chips -->
          <div class="px-5 py-2 border-t border-black/5 bg-[#f8fafc] flex gap-2 overflow-x-auto text-[11px] no-scrollbar">
            @for (prompt of quickPrompts; track prompt.labelEn) {
              <button
                (click)="sendQuickPrompt(prompt)"
                [disabled]="isGenerating"
                class="px-3 py-1.5 rounded-xl border border-black/10 bg-white hover:border-[#d97706] hover:text-[#d97706] text-[#475569] whitespace-nowrap transition-all shadow-2xs font-medium cursor-pointer disabled:opacity-50 active:scale-95">
                {{ lang === 'en' ? prompt.labelEn : prompt.labelEs }}
              </button>
            }
          </div>

          <!-- Input Bar -->
          <div class="p-4 border-t border-black/10 bg-white flex gap-2.5 items-center">
            <input
              #messageInput
              [(ngModel)]="userInput"
              [disabled]="isGenerating"
              (keydown.enter)="onEnterPressed($event)"
              [placeholder]="lang === 'en' ? 'Ask anything about my experience, stack or Dublin 2026...' : 'Pregúntame sobre mi experiencia, stack o metas en Dublín...'"
              class="flex-1 bg-[#f8fafc] border border-black/15 rounded-2xl px-4 py-2.5 text-xs sm:text-sm text-[#0f172a] focus:outline-none focus:border-[#d97706] transition-colors placeholder:text-[#94a3b8] shadow-inner disabled:opacity-60"
            />
            <button
              (click)="sendMessage()"
              [disabled]="!userInput.trim() || isGenerating"
              class="px-5 py-2.5 bg-[#1e293b] hover:bg-[#0f172a] active:scale-95 text-white rounded-2xl text-xs sm:text-sm font-bold uppercase tracking-wider disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer shadow-sm shrink-0">
              {{ lang === 'en' ? 'Send' : 'Enviar' }}
            </button>
          </div>

        </div>

      </div>
    }
  `,
  styles: [`
    @keyframes modalEnter {
      0% {
        opacity: 0;
        transform: scale(0.94) translateY(12px);
      }
      100% {
        opacity: 1;
        transform: scale(1) translateY(0);
      }
    }

    .animate-modal-enter {
      animation: modalEnter 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
    }
  `]
})
export class ChatModalComponent implements OnInit {
  @Input() isOpen = false;
  @Input() lang: 'en' | 'es' = 'en';

  @Output() close = new EventEmitter<void>();
  @Output() streamStart = new EventEmitter<void>();
  @Output() streamEnd = new EventEmitter<void>();

  @ViewChild('scrollContainer') private scrollContainer?: ElementRef<HTMLDivElement>;
  @ViewChild('messageInput') private messageInput?: ElementRef<HTMLInputElement>;

  private aiChatService = inject(AiChatService);

  userInput = '';
  isGenerating = false;
  currentStreamingMessage = false;

  messages: ChatMessage[] = [];

  quickPrompts = [
    {
      labelEn: '📍 Dublin 2026 Availability',
      labelEs: '📍 Disponibilidad en Dublín 2026',
      query: '¿Cuál es tu disponibilidad para incorporarte en Dublín y qué condiciones buscas?'
    },
    {
      labelEn: '🏥 Hospital La Fe Medical AI',
      labelEs: '🏥 IA Médica en Hospital La Fe',
      query: 'Cuéntame sobre tu experiencia desarrollando modelos de IA en el Hospital La Fe.'
    },
    {
      labelEn: '🏋️ FitForge Full-Stack Platform',
      labelEs: '🏋️ Plataforma FitForge Full-Stack',
      query: '¿Cómo diseñaste la arquitectura desacoplada de FitForge con Symfony 7 y Angular?'
    },
    {
      labelEn: '⚡ Main Tech Stack & Tools',
      labelEs: '⚡ Stack Tecnológico Principal',
      query: '¿Cuáles son tus tecnologías principales en Backend, IA y Cloud?'
    }
  ];

  ngOnInit() {
    this.messages.push({
      sender: 'ai',
      text: this.lang === 'en'
        ? "Hi! I am Santiago's AI Digital Twin. I can answer questions about my engineering background, flagship projects, and Dublin on-site availability in first person. How can I help you today?"
        : "¡Hola! Soy el Gemelo Digital interactivo de Santiago. Puedo responder preguntas sobre mi experiencia en ingeniería, proyectos estrella y disponibilidad presencial en Dublín en primera persona. ¿En qué te gustaría profundizar?",
      timestamp: new Date().toLocaleTimeString()
    });
  }

  onEnterPressed(event: Event) {
    const keyboardEvent = event as KeyboardEvent;
    if (!keyboardEvent.shiftKey) {
      event.preventDefault();
      this.sendMessage();
    }
  }

  onClose() {
    this.close.emit();
  }

  async sendMessage(customText?: string) {
    const textToSend = (customText || this.userInput).trim();
    if (!textToSend || this.isGenerating) return;

    this.messages.push({
      sender: 'user',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString()
    });

    this.userInput = '';
    this.isGenerating = true;
    this.currentStreamingMessage = true;
    this.streamStart.emit(); // Emits TALKING state to avatar!

    this.scrollToBottom();

    // Prepare streaming response placeholder
    const aiMessageIndex = this.messages.length;
    this.messages.push({
      sender: 'ai',
      text: '',
      timestamp: new Date().toLocaleTimeString(),
      isStreaming: true
    });

    const history = this.messages.slice(0, -2).map(m => ({
      role: m.sender === 'user' ? 'user' : 'model',
      content: m.text
    }));

    await this.aiChatService.streamChat(
      textToSend,
      history,
      (partialChunk: string) => {
        this.messages[aiMessageIndex].text = partialChunk;
        this.scrollToBottom();
      },
      (finalText: string) => {
        this.messages[aiMessageIndex].text = finalText;
        this.messages[aiMessageIndex].isStreaming = false;
        this.isGenerating = false;
        this.currentStreamingMessage = false;
        this.streamEnd.emit(); // Emits CHAT_IDLE state to avatar!
        this.scrollToBottom();
      },
      (error: any) => {
        console.error('Chat stream error:', error);
        this.messages[aiMessageIndex].text = this.lang === 'en'
          ? "I encountered a minor network issue. Please ask again!"
          : "Hubo un pequeño error de conexión. ¡Por favor, vuelve a preguntar!";
        this.messages[aiMessageIndex].isStreaming = false;
        this.isGenerating = false;
        this.currentStreamingMessage = false;
        this.streamEnd.emit();
      }
    );
  }

  sendQuickPrompt(prompt: { labelEn: string; labelEs: string; query: string }) {
    this.sendMessage(prompt.query);
  }

  private scrollToBottom() {
    setTimeout(() => {
      if (this.scrollContainer) {
        this.scrollContainer.nativeElement.scrollTop = this.scrollContainer.nativeElement.scrollHeight;
      }
    }, 20);
  }
}
