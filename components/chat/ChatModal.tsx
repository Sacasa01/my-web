import React, { useState, useRef, useEffect } from 'react';

interface ChatMessage {
  sender: 'ai' | 'user';
  text: string;
  timestamp: string;
  isStreaming?: boolean;
}

interface ChatModalProps {
  isOpen: boolean;
  lang?: 'en' | 'es';
  onClose: () => void;
  onStreamStart?: () => void;
  onStreamEnd?: () => void;
}

const QUICK_PROMPTS = [
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

export const ChatModal: React.FC<ChatModalProps> = ({
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
        ? "Hi! I am Santiago's AI Digital Twin. I can answer questions about my engineering background, flagship projects, and Dublin on-site availability in first person. How can I help you today?"
        : "¡Hola! Soy el Gemelo Digital interactivo de Santiago. Puedo responder preguntas sobre mi experiencia en ingeniería, proyectos estrella y disponibilidad presencial en Dublín en primera persona. ¿En qué te gustaría profundizar?",
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

    setMessages(prev => [...prev, userMessage, { sender: 'ai', text: '', timestamp: new Date().toLocaleTimeString(), isStreaming: true }]);
    setUserInput('');
    setIsGenerating(true);
    onStreamStart?.(); // Drives avatar TALKING state
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
      console.warn('Stream fallback execution:', err);
      // Local fallback simulation
      const fallbackReply = "Como gemelo digital de Santiago Castro Salt, me especializo en Backend (Python, Go, Symfony 7) e IA aplicada (PyTorch, MONAI, agentes MCP). Estaré físicamente en Dublín disponible para incorporarme desde el 30 de Septiembre de 2026.";
      setMessages(prev => {
        const updated = [...prev];
        const lastIdx = updated.length - 1;
        updated[lastIdx] = { ...updated[lastIdx], text: fallbackReply, isStreaming: false };
        return updated;
      });
    } finally {
      setIsGenerating(false);
      onStreamEnd?.(); // Drives avatar CHAT_IDLE state
      scrollToBottom();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/40 backdrop-blur-xs">
      <div className="relative w-full max-w-lg bg-white/95 backdrop-blur-xl border border-black/10 rounded-3xl shadow-2xl flex flex-col overflow-hidden text-[#0f172a] max-h-[85vh] h-[560px] animate-in fade-in zoom-in-95 duration-200">

        {/* Header */}
        <div className="h-14 px-6 border-b border-black/10 flex items-center justify-between bg-white/80 select-none shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#1e293b] to-[#475569] flex items-center justify-center text-white text-xs font-bold shadow-xs">
              🤖
            </div>
            <div>
              <h3 className="font-syne font-bold text-sm text-[#0f172a]">
                {lang === 'en' ? "Santiago's Digital Twin" : 'Gemelo Digital de Santiago'}
              </h3>
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[10px] font-mono text-[#64748b]">
                  {isGenerating ? (lang === 'en' ? 'Streaming response...' : 'Generando respuesta...') : 'Online & Ready'}
                </span>
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-black/5 hover:bg-black/10 text-[#64748b] hover:text-[#0f172a] flex items-center justify-center transition-all cursor-pointer font-mono text-sm font-bold"
            title="Close chat">
            ✕
          </button>
        </div>

        {/* Messages */}
        <div ref={scrollContainerRef} className="flex-1 overflow-y-auto p-5 space-y-4 pr-3">
          {messages.map((msg, idx) => (
            <div key={idx} className={`flex gap-3 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
              {msg.sender === 'ai' && (
                <div className="w-7 h-7 rounded-full bg-[#d97706]/15 border border-[#d97706]/30 flex items-center justify-center shrink-0 mt-0.5 text-xs text-[#d97706] font-bold">
                  🤖
                </div>
              )}
              <div
                className={`max-w-[82%] px-4 py-3 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                  msg.sender === 'user'
                    ? 'bg-[#1e293b] text-white rounded-br-none shadow-sm font-medium'
                    : 'bg-[#f8fafc] border border-black/10 text-[#1e293b] rounded-bl-none shadow-xs font-normal'
                }`}>
                <div className="whitespace-pre-wrap">{msg.text}</div>
                {msg.isStreaming && <span className="inline-block w-1.5 h-3.5 bg-[#d97706] ml-1 animate-pulse align-middle" />}
              </div>
            </div>
          ))}
        </div>

        {/* Quick Chips */}
        <div className="px-5 py-2 border-t border-black/5 bg-[#f8fafc] flex gap-2 overflow-x-auto text-[11px] no-scrollbar">
          {QUICK_PROMPTS.map((prompt, idx) => (
            <button
              key={idx}
              onClick={() => sendMessage(prompt.query)}
              disabled={isGenerating}
              className="px-3 py-1.5 rounded-xl border border-black/10 bg-white hover:border-[#d97706] hover:text-[#d97706] text-[#475569] whitespace-nowrap transition-all shadow-2xs font-medium cursor-pointer disabled:opacity-50 active:scale-95">
              {lang === 'en' ? prompt.labelEn : prompt.labelEs}
            </button>
          ))}
        </div>

        {/* Input */}
        <div className="p-4 border-t border-black/10 bg-white flex gap-2.5 items-center">
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
            placeholder={lang === 'en' ? 'Ask anything about my experience, stack or Dublin 2026...' : 'Pregúntame sobre mi experiencia, stack o metas en Dublín...'}
            className="flex-1 bg-[#f8fafc] border border-black/15 rounded-2xl px-4 py-2.5 text-xs sm:text-sm text-[#0f172a] focus:outline-none focus:border-[#d97706] transition-colors placeholder:text-[#94a3b8]"
          />
          <button
            onClick={() => sendMessage()}
            disabled={!userInput.trim() || isGenerating}
            className="px-5 py-2.5 bg-[#1e293b] hover:bg-[#0f172a] active:scale-95 text-white rounded-2xl text-xs sm:text-sm font-bold uppercase tracking-wider disabled:opacity-40 transition-all cursor-pointer shadow-sm shrink-0">
            {lang === 'en' ? 'Send' : 'Enviar'}
          </button>
        </div>

      </div>
    </div>
  );
};
