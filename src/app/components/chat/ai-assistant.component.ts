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
  selector: 'app-ai-assistant',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    @if (isOpen) {
      <div
        class="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/40 backdrop-blur-xs transition-opacity duration-300">

        <!-- Console Window with Scale + Fade Animation -->
        <div
          class="relative w-full max-w-xl bg-white/95 backdrop-blur-xl border border-slate-200/90 rounded-3xl shadow-[0_25px_60px_-15px_rgba(0,0,0,0.3)] flex flex-col overflow-hidden animate-console-enter text-slate-900 max-h-[88vh] h-[600px]">

          <!-- Header Bar (Terminal / System Console Style) -->
          <div class="h-14 px-5 border-b border-slate-200/80 flex items-center justify-between bg-slate-50/80 select-none shrink-0">
            <div class="flex items-center gap-3">
              <div class="w-8 h-8 rounded-xl bg-slate-900 flex items-center justify-center text-white text-xs font-mono font-bold shadow-xs">
                &gt;_
              </div>
              <div class="leading-tight">
                <div class="flex items-center gap-2">
                  <h3 class="font-syne font-bold text-xs sm:text-sm text-slate-900">
                    {{ lang === 'en' ? "Santiago's AI Digital Twin" : 'Gemelo Digital de Santiago' }}
                  </h3>
                  <span class="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-700 border border-emerald-500/20 text-[9px] font-mono font-bold">
                    {{ isGenerating ? (lang === 'en' ? 'STREAMING...' : 'GENERANDO...') : 'DUBLIN 2026' }}
                  </span>
                </div>
                <p class="text-[10px] font-mono text-slate-500">
                  {{ lang === 'en' ? 'Grounded in Santiago CV & Technical Context' : 'Basado en CV y Contexto Técnico Verificado' }}
                </p>
              </div>
            </div>

            <!-- Window Controls -->
            <div class="flex items-center gap-2">
              <button
                (click)="onClose()"
                class="w-7 h-7 rounded-full bg-slate-200/70 hover:bg-slate-300 text-slate-600 hover:text-slate-900 flex items-center justify-center transition-colors cursor-pointer text-xs font-mono font-bold"
                title="Close console (✕)">
                ✕
              </button>
            </div>
          </div>

          <!-- Messages Stream Container with Auto-scroll -->
          <div
            #scrollContainer
            class="flex-1 overflow-y-auto p-5 space-y-4 pr-3 text-xs sm:text-sm leading-relaxed">
            @for (msg of messages; track $index) {
              <div
                class="flex gap-3"
                [ngClass]="msg.sender === 'user' ? 'justify-end' : 'justify-start'">
                
                @if (msg.sender === 'ai') {
                  <div class="w-7 h-7 rounded-lg bg-amber-500/15 border border-amber-500/30 flex items-center justify-center shrink-0 mt-0.5 text-xs text-amber-600 font-mono font-bold">
                    AI
                  </div>
                }

                <div
                  class="max-w-[85%] px-4 py-3 rounded-2xl shadow-2xs font-sans"
                  [ngClass]="msg.sender === 'user'
                    ? 'bg-slate-900 text-white rounded-br-none font-medium'
                    : 'bg-slate-100/90 border border-slate-200/80 text-slate-800 rounded-bl-none font-normal'">
                  <div class="whitespace-pre-wrap">{{ msg.text }}</div>
                  @if (msg.isStreaming) {
                    <span class="inline-block w-1.5 h-3.5 bg-amber-500 ml-1 animate-pulse align-middle"></span>
                  }
                </div>
              </div>
            }

            @if (isGenerating && !currentStreamingMessage) {
              <div class="flex gap-3 items-center">
                <div class="w-7 h-7 rounded-lg bg-amber-500/15 border border-amber-500/30 flex items-center justify-center shrink-0 text-xs text-amber-600 font-mono font-bold">
                  AI
                </div>
                <div class="bg-slate-100 border border-slate-200/80 px-4 py-3 rounded-2xl rounded-bl-none flex items-center gap-1.5 shadow-2xs">
                  <span class="w-1.5 h-1.5 rounded-full bg-amber-500 animate-bounce" style="animation-delay: 0ms"></span>
                  <span class="w-1.5 h-1.5 rounded-full bg-amber-500 animate-bounce" style="animation-delay: 150ms"></span>
                  <span class="w-1.5 h-1.5 rounded-full bg-amber-500 animate-bounce" style="animation-delay: 300ms"></span>
                </div>
              </div>
            }
          </div>

          <!-- Quick Suggestion Chips -->
          <div class="px-5 py-2.5 border-t border-slate-100 bg-slate-50/90 flex gap-2 overflow-x-auto text-[11px] no-scrollbar shrink-0">
            @for (prompt of quickPrompts; track prompt.labelEn) {
              <button
                (click)="sendQuickPrompt(prompt)"
                [disabled]="isGenerating"
                class="px-3 py-1.5 rounded-xl border border-slate-200 bg-white hover:border-amber-500 hover:text-amber-600 text-slate-600 whitespace-nowrap transition-all shadow-2xs font-mono font-medium cursor-pointer disabled:opacity-50 active:scale-95">
                {{ lang === 'en' ? prompt.labelEn : prompt.labelEs }}
              </button>
            }
          </div>

          <!-- Integrated Bottom Input Bar -->
          <div class="p-4 border-t border-slate-200/80 bg-white flex gap-2.5 items-center shrink-0">
            <input
              #messageInput
              [(ngModel)]="userInput"
              [disabled]="isGenerating"
              (keydown.enter)="onEnterPressed($event)"
              [placeholder]="lang === 'en' ? 'Ask about Dublin 2026, Hospital La Fe, FitForge, or my stack...' : 'Pregunta sobre Dublín 2026, Hospital La Fe, FitForge o mi stack...'"
              class="flex-1 bg-slate-50 border border-slate-200 rounded-2xl px-4 py-2.5 text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-amber-500 transition-colors placeholder:text-slate-400 font-sans shadow-inner disabled:opacity-60"
            />
            <button
              (click)="sendMessage()"
              [disabled]="!userInput.trim() || isGenerating"
              class="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 active:scale-95 text-white rounded-2xl text-xs sm:text-sm font-bold uppercase tracking-wider disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer shadow-sm shrink-0">
              {{ lang === 'en' ? 'Send' : 'Enviar' }}
            </button>
          </div>

        </div>

      </div>
    }
  `,
  styles: [`
    @keyframes consoleEnter {
      0% {
        opacity: 0;
        transform: scale(0.95) translateY(10px);
      }
      100% {
        opacity: 1;
        transform: scale(1) translateY(0);
      }
    }

    .animate-console-enter {
      animation: consoleEnter 0.25s cubic-bezier(0.16, 1, 0.3, 1) forwards;
    }
  `]
})
export class AiAssistantComponent implements OnInit {
  @Input() isOpen = false;
  @Input() lang: 'en' | 'es' = 'en';

  @Output() close = new EventEmitter<void>();

  @ViewChild('scrollContainer') private scrollContainer?: ElementRef<HTMLDivElement>;

  private aiChatService = inject(AiChatService);

  userInput = '';
  isGenerating = false;
  currentStreamingMessage = false;

  messages: ChatMessage[] = [];

  quickPrompts = [
    {
      labelEn: '📍 Dublin 2026 Relocation',
      labelEs: '📍 Disponibilidad Dublín 2026',
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
      labelEn: '🗺️ Legacy Land Mapper WFS',
      labelEs: '🗺️ Legacy Land Mapper (Catastro WFS)',
      query: '¿Cómo funciona la arquitectura multihilo de Legacy Land Mapper para la API del Catastro?'
    },
    {
      labelEn: '⚡ Core Backend & AI Stack',
      labelEs: '⚡ Stack Principal de Backend e IA',
      query: '¿Cuáles son tus tecnologías principales en Backend, IA y Cloud?'
    }
  ];

  ngOnInit() {
    this.messages.push({
      sender: 'ai',
      text: this.lang === 'en'
        ? "Hello! I am Santiago Castro Salt's AI Digital Twin. I can answer technical questions about my backend architecture, deep learning pipelines at Hospital La Fe, and Dublin on-site availability in first person. How can I assist your team today?"
        : "¡Hola! Soy el Gemelo Digital interactivo de Santiago Castro Salt. Puedo responder preguntas técnicas sobre mis arquitecturas backend, pipelines de Deep Learning en el Hospital La Fe y disponibilidad presencial en Dublín en primera persona. ¿En qué te gustaría profundizar?",
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

    this.scrollToBottom();

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
