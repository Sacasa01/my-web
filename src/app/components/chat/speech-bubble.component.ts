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
  selector: 'app-speech-bubble',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div
      class="fixed sm:absolute z-50 transition-all duration-300 transform top-16 sm:top-[-45px] sm:-right-4 md:-right-24 lg:-right-36 w-[calc(100vw-32px)] sm:w-[380px] max-w-[400px]"
      [class.opacity-100]="isOpen"
      [class.scale-100]="isOpen"
      [class.translate-y-0]="isOpen"
      [class.pointer-events-auto]="isOpen"
      [class.opacity-0]="!isOpen"
      [class.scale-95]="!isOpen"
      [class.translate-y-3]="!isOpen"
      [class.pointer-events-none]="!isOpen">

      <!-- Comic Speech Bubble Body -->
      <div class="relative bg-white/95 backdrop-blur-md border border-slate-200/80 rounded-3xl shadow-2xl p-4 sm:p-5 flex flex-col text-[#0f172a]
                  after:content-[''] after:hidden sm:after:block after:absolute after:-bottom-2.5 after:left-12 after:border-8 after:border-transparent after:border-t-white/95 after:drop-shadow-xs">

        <!-- Bubble Header -->
        <div class="flex items-center justify-between border-b border-slate-100 pb-2.5 select-none">
          <div class="flex items-center gap-2">
            <span class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span class="font-syne font-bold text-xs text-[#0f172a] uppercase tracking-wider">
              {{ lang === 'en' ? 'Santiago Digital Twin' : 'Gemelo Digital de Santiago' }}
            </span>
          </div>

          <button
            (click)="onClose()"
            class="w-6 h-6 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-900 flex items-center justify-center transition-colors cursor-pointer text-xs font-mono font-bold"
            title="Close bubble">
            ✕
          </button>
        </div>

        <!-- Compact Scrollable Conversation History -->
        <div
          #scrollContainer
          class="my-3 max-h-[220px] sm:max-h-[250px] overflow-y-auto space-y-2.5 pr-1 text-xs leading-relaxed">
          @for (msg of messages; track $index) {
            <div
              class="flex flex-col"
              [ngClass]="msg.sender === 'user' ? 'items-end' : 'items-start'">
              <div
                class="px-3.5 py-2.5 rounded-2xl max-w-[90%] shadow-2xs"
                [ngClass]="msg.sender === 'user'
                  ? 'bg-[#1e293b] text-white rounded-br-none font-medium'
                  : 'bg-slate-100/90 border border-slate-200/60 text-[#1e293b] rounded-bl-none'">
                <div class="whitespace-pre-wrap">{{ msg.text }}</div>
                @if (msg.isStreaming) {
                  <span class="inline-block w-1.5 h-3 bg-[#d97706] ml-1 animate-pulse align-middle"></span>
                }
              </div>
            </div>
          }

          @if (isGenerating && !messages[messages.length - 1].text) {
            <div class="bg-slate-100 border border-slate-200 px-3 py-2 rounded-2xl rounded-bl-none w-fit flex gap-1 items-center">
              <span class="w-1.5 h-1.5 rounded-full bg-[#d97706] animate-bounce" style="animation-delay: 0ms"></span>
              <span class="w-1.5 h-1.5 rounded-full bg-[#d97706] animate-bounce" style="animation-delay: 150ms"></span>
              <span class="w-1.5 h-1.5 rounded-full bg-[#d97706] animate-bounce" style="animation-delay: 300ms"></span>
            </div>
          }
        </div>

        <!-- Quick Suggestion Chips -->
        <div class="flex gap-1.5 overflow-x-auto pb-2 text-[10px] font-medium no-scrollbar">
          @for (prompt of quickPrompts; track prompt.labelEn) {
            <button
              (click)="sendQuickPrompt(prompt)"
              [disabled]="isGenerating"
              class="px-2.5 py-1 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 hover:border-[#d97706] text-slate-600 hover:text-[#d97706] whitespace-nowrap transition-all cursor-pointer disabled:opacity-50 active:scale-95">
              {{ lang === 'en' ? prompt.labelEn : prompt.labelEs }}
            </button>
          }
        </div>

        <!-- Integrated Bottom Input Bar -->
        <div class="pt-2 border-t border-slate-100 flex gap-2 items-center">
          <input
            [(ngModel)]="userInput"
            (keydown.enter)="onEnterPressed($event)"
            [disabled]="isGenerating"
            [placeholder]="lang === 'en' ? 'Ask a question...' : 'Hazme una pregunta...'"
            class="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs text-[#0f172a] focus:outline-none focus:border-[#d97706] transition-colors placeholder:text-slate-400"
          />
          <button
            (click)="sendMessage()"
            [disabled]="!userInput.trim() || isGenerating"
            class="px-3.5 py-1.5 bg-[#1e293b] hover:bg-[#0f172a] active:scale-95 text-white rounded-xl text-xs font-bold uppercase tracking-wider disabled:opacity-40 transition-all cursor-pointer shadow-2xs shrink-0">
            {{ lang === 'en' ? 'Send' : 'Enviar' }}
          </button>
        </div>

      </div>

    </div>
  `,
  styles: [`
    :host {
      display: contents;
    }
  `]
})
export class SpeechBubbleComponent implements OnInit {
  @Input() isOpen = false;
  @Input() lang: 'en' | 'es' = 'en';

  @Output() close = new EventEmitter<void>();
  @Output() streamStart = new EventEmitter<void>();
  @Output() streamEnd = new EventEmitter<void>();

  @ViewChild('scrollContainer') private scrollContainer?: ElementRef<HTMLDivElement>;

  private aiChatService = inject(AiChatService);

  userInput = '';
  isGenerating = false;

  messages: ChatMessage[] = [];

  quickPrompts = [
    { labelEn: '📍 Dublin 2026', labelEs: '📍 Dublín 2026', query: '¿Cuál es tu disponibilidad para incorporarte en Dublín y qué condiciones buscas?' },
    { labelEn: '🏥 Hospital La Fe', labelEs: '🏥 Hospital La Fe', query: 'Cuéntame sobre tu experiencia desarrollando modelos de IA en el Hospital La Fe.' },
    { labelEn: '🏋️ FitForge Platform', labelEs: '🏋️ Plataforma FitForge', query: '¿Cómo diseñaste la arquitectura desacoplada de FitForge con Symfony 7 y Angular?' },
    { labelEn: '⚡ Main Tech Stack', labelEs: '⚡ Stack Principal', query: '¿Cuáles son tus tecnologías principales en Backend, IA y Cloud?' }
  ];

  ngOnInit() {
    this.messages.push({
      sender: 'ai',
      text: this.lang === 'en'
        ? "Hi! I am Santiago's AI Digital Twin. Ask me anything about my projects, technical stack, or CV."
        : "¡Hola! Soy el gemelo digital de Santiago. Pregúntame sobre mis proyectos, stack técnico o CV.",
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
    this.streamStart.emit(); // Avatar state -> TALKING
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
        this.streamEnd.emit(); // Avatar state -> CHAT_IDLE
        this.scrollToBottom();
      },
      (error: any) => {
        console.error('Stream error:', error);
        this.messages[aiMessageIndex].text = this.lang === 'en'
          ? "I encountered an issue. Please ask again!"
          : "Hubo un pequeño error. ¡Vuelve a preguntar!";
        this.messages[aiMessageIndex].isStreaming = false;
        this.isGenerating = false;
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
