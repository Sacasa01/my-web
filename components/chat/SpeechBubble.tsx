import React, { useState, useRef, useEffect } from 'react';

interface ChatMessage {
  sender: 'ai' | 'user';
  text: string;
  timestamp: string;
  isStreaming?: boolean;
}

interface SpeechBubbleProps {
  isOpen: boolean;
  lang?: 'en' | 'es';
  onClose: () => void;
  onStreamStart?: () => void;
  onStreamEnd?: () => void;
}

const QUICK_PROMPTS = [
  { labelEn: '📍 Dublin 2026', labelEs: '📍 Dublín 2026', query: '¿Cuál es tu disponibilidad para incorporarte en Dublín y qué condiciones buscas?' },
  { labelEn: '🏥 Hospital La Fe', labelEs: '🏥 Hospital La Fe', query: 'Cuéntame sobre tu experiencia desarrollando modelos de IA en el Hospital La Fe.' },
  { labelEn: '🏋️ FitForge Platform', labelEs: '🏋️ Plataforma FitForge', query: '¿Cómo diseñaste la arquitectura desacoplada de FitForge con Symfony 7 y Angular?' },
  { labelEn: '⚡ Main Tech Stack', labelEs: '⚡ Stack Principal', query: '¿Cuáles son tus tecnologías principales en Backend, IA y Cloud?' }
];

export const SpeechBubble: React.FC<SpeechBubbleProps> = ({
  isOpen,
  lang = 'en',
  onClose,
  onStreamStart,
  onStreamEnd
}) => {
  const [userInput, setUserInput] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      sender: 'ai',
      text: lang === 'en'
        ? "Hi! I am Santiago's AI Digital Twin. Ask me anything about my projects, technical stack, or CV."
        : "¡Hola! Soy el gemelo digital de Santiago. Pregúntame sobre mis proyectos, stack técnico o CV.",
      timestamp: new Date().toLocaleTimeString()
    }
  ]);

  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    setTimeout(() => {
      if (scrollContainerRef.current) {
        scrollContainerRef.current.scrollTop = scrollContainerRef.current.scrollHeight;
      }
    }, 20);
  };

  const sendMessage = async (customQuery?: string) => {
    const query = (customQuery || userInput).trim();
    if (!query || isGenerating) return;

    const userMessage: ChatMessage = {
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString()
    };

    setMessages(prev => [
      ...prev,
      userMessage,
      { sender: 'ai', text: '', timestamp: new Date().toLocaleTimeString(), isStreaming: true }
    ]);
    setUserInput('');
    setIsGenerating(true);
    onStreamStart?.(); // Avatar -> TALKING state
    scrollToBottom();

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: query })
      });

      if (!response.ok || !response.body) {
        throw new Error('API route unavailable');
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let fullText = '';

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        fullText += chunk;

        setMessages(prev => {
          const updated = [...prev];
          const lastIdx = updated.length - 1;
          updated[lastIdx] = { ...updated[lastIdx], text: fullText };
          return updated;
        });
        scrollToBottom();
      }

      setMessages(prev => {
        const updated = [...prev];
        const lastIdx = updated.length - 1;
        updated[lastIdx] = { ...updated[lastIdx], isStreaming: false };
        return updated;
      });
    } catch (err) {
      console.warn('Speech bubble stream error:', err);
      const fallbackReply = "Como gemelo digital de Santiago Castro Salt, me especializo en Backend (Python, Go, Symfony 7) e IA aplicada (PyTorch, MONAI, agentes MCP). Estaré físicamente disponible en Dublín para incorporarme On-Site desde el 30 de Septiembre de 2026.";
      setMessages(prev => {
        const updated = [...prev];
        const lastIdx = updated.length - 1;
        updated[lastIdx] = { ...updated[lastIdx], text: fallbackReply, isStreaming: false };
        return updated;
      });
    } finally {
      setIsGenerating(false);
      onStreamEnd?.(); // Avatar -> CHAT_IDLE state
      scrollToBottom();
    }
  };

  return (
    <div
      className={`fixed sm:absolute z-50 transition-all duration-300 transform ${
        isOpen
          ? 'opacity-100 scale-100 translate-y-0 pointer-events-auto'
          : 'opacity-0 scale-95 translate-y-3 pointer-events-none'
      } top-20 sm:top-[-45px] sm:-right-4 md:-right-24 lg:-right-36 w-[calc(100vw-32px)] sm:w-[380px] max-w-[400px]`}>

      {/* Comic Speech Bubble Body */}
      <div className="relative bg-white/95 backdrop-blur-md border border-slate-200/80 rounded-3xl shadow-2xl p-4 sm:p-5 flex flex-col text-[#0f172a]
                      after:content-[''] after:hidden sm:after:block after:absolute after:-bottom-2.5 after:left-12 after:border-8 after:border-transparent after:border-t-white/95 after:drop-shadow-xs">

        {/* Bubble Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-2.5 select-none">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="font-syne font-bold text-xs text-[#0f172a] uppercase tracking-wider">
              {lang === 'en' ? 'Santiago Digital Twin' : 'Gemelo Digital de Santiago'}
            </span>
          </div>

          <button
            onClick={onClose}
            className="w-6 h-6 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-900 flex items-center justify-center transition-colors cursor-pointer text-xs font-mono font-bold"
            title="Close bubble">
            ✕
          </button>
        </div>

        {/* Compact Scrollable Conversation History */}
        <div
          ref={scrollContainerRef}
          className="my-3 max-h-[220px] sm:max-h-[250px] overflow-y-auto space-y-2.5 pr-1 text-xs leading-relaxed">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}>
              <div
                className={`px-3.5 py-2.5 rounded-2xl max-w-[90%] shadow-2xs ${
                  msg.sender === 'user'
                    ? 'bg-[#1e293b] text-white rounded-br-none font-medium'
                    : 'bg-slate-100/90 border border-slate-200/60 text-[#1e293b] rounded-bl-none'
                }`}>
                <div className="whitespace-pre-wrap">{msg.text}</div>
                {msg.isStreaming && (
                  <span className="inline-block w-1.5 h-3 bg-[#d97706] ml-1 animate-pulse align-middle" />
                )}
              </div>
            </div>
          ))}

          {isGenerating && !messages[messages.length - 1]?.text && (
            <div className="bg-slate-100 border border-slate-200 px-3 py-2 rounded-2xl rounded-bl-none w-fit flex gap-1 items-center">
              <span className="w-1.5 h-1.5 rounded-full bg-[#d97706] animate-bounce" style={{ animationDelay: '0ms' }} />
              <span className="w-1.5 h-1.5 rounded-full bg-[#d97706] animate-bounce" style={{ animationDelay: '150ms' }} />
              <span className="w-1.5 h-1.5 rounded-full bg-[#d97706] animate-bounce" style={{ animationDelay: '300ms' }} />
            </div>
          )}
        </div>

        {/* Quick Suggestion Chips */}
        <div className="flex gap-1.5 overflow-x-auto pb-2 text-[10px] font-medium no-scrollbar">
          {QUICK_PROMPTS.map((prompt, idx) => (
            <button
              key={idx}
              onClick={() => sendMessage(prompt.query)}
              disabled={isGenerating}
              className="px-2.5 py-1 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 hover:border-[#d97706] text-slate-600 hover:text-[#d97706] whitespace-nowrap transition-all cursor-pointer disabled:opacity-50 active:scale-95">
              {lang === 'en' ? prompt.labelEn : prompt.labelEs}
            </button>
          ))}
        </div>

        {/* Integrated Bottom Input Bar */}
        <div className="pt-2 border-t border-slate-100 flex gap-2 items-center">
          <input
            value={userInput}
            onChange={e => setUserInput(e.target.value)}
            onKeyDown={e => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                sendMessage();
              }
            }}
            disabled={isGenerating}
            placeholder={lang === 'en' ? 'Ask a question...' : 'Hazme una pregunta...'}
            className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs text-[#0f172a] focus:outline-none focus:border-[#d97706] transition-colors placeholder:text-slate-400"
          />
          <button
            onClick={() => sendMessage()}
            disabled={!userInput.trim() || isGenerating}
            className="px-3.5 py-1.5 bg-[#1e293b] hover:bg-[#0f172a] active:scale-95 text-white rounded-xl text-xs font-bold uppercase tracking-wider disabled:opacity-40 transition-all cursor-pointer shadow-2xs shrink-0">
            {lang === 'en' ? 'Send' : 'Enviar'}
          </button>
        </div>

      </div>

    </div>
  );
};
