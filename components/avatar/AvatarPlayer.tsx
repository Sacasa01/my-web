import React, { useState, useRef, useEffect, useCallback } from 'react';

export type AvatarState = 'TYPING' | 'GREETING' | 'CHAT_IDLE' | 'TALKING' | 'RETURNING';

interface VideoConfig {
  srcWebm: string;
  srcMp4: string;
  loop: boolean;
  nextStateOnEnd?: AvatarState;
}

const VIDEO_MAP: Record<AvatarState, VideoConfig> = {
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

interface AvatarPlayerProps {
  state?: AvatarState;
  lang?: 'en' | 'es';
  onAvatarClick?: () => void;
  onStateChange?: (newState: AvatarState) => void;
}

export const AvatarPlayer: React.FC<AvatarPlayerProps> = ({
  state = 'TYPING',
  lang = 'en',
  onAvatarClick,
  onStateChange
}) => {
  const [currentState, setCurrentState] = useState<AvatarState>(state);
  const [activePlayer, setActivePlayer] = useState<'A' | 'B'>('A');
  const [isHovered, setIsHovered] = useState<boolean>(false);

  const playerARef = useRef<HTMLVideoElement>(null);
  const playerBRef = useRef<HTMLVideoElement>(null);

  const playState = useCallback((targetState: AvatarState, crossfade: boolean) => {
    const config = VIDEO_MAP[targetState];
    const currentPlayer = activePlayer;
    const nextPlayer = currentPlayer === 'A' ? 'B' : 'A';

    const currentEl = currentPlayer === 'A' ? playerARef.current : playerBRef.current;
    const nextEl = nextPlayer === 'A' ? playerARef.current : playerBRef.current;

    if (!nextEl) return;

    nextEl.src = config.srcMp4;
    nextEl.loop = config.loop;
    nextEl.currentTime = 0;

    nextEl.play().then(() => {
      setActivePlayer(nextPlayer);
      if (currentEl && crossfade) {
        setTimeout(() => {
          currentEl.pause();
        }, 300);
      }
    }).catch(err => {
      console.warn('Autoplay prevented:', err);
    });
  }, [activePlayer]);

  useEffect(() => {
    if (state !== currentState) {
      setCurrentState(state);
      playState(state, true);
    }
  }, [state, currentState, playState]);

  useEffect(() => {
    playState('TYPING', false);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleEnded = (player: 'A' | 'B') => {
    if (activePlayer !== player) return;
    const config = VIDEO_MAP[currentState];
    if (config.nextStateOnEnd) {
      const next = config.nextStateOnEnd;
      setCurrentState(next);
      onStateChange?.(next);
      playState(next, true);
    }
  };

  const handleClick = () => {
    if (currentState === 'TYPING') {
      setCurrentState('GREETING');
      onStateChange?.('GREETING');
      playState('GREETING', true);
    }
    onAvatarClick?.();
  };

  const getStatusText = () => {
    if (lang === 'en') {
      switch (currentState) {
        case 'TYPING': return '💻 Santiago is coding (Click to interact)';
        case 'GREETING': return '👋 "Hello! Welcome to my portfolio"';
        case 'CHAT_IDLE': return '🎧 Receptive & listening to your questions';
        case 'TALKING': return '💬 Explaining architecture & systems...';
        case 'RETURNING': return '↩ Returning to work...';
      }
    } else {
      switch (currentState) {
        case 'TYPING': return '💻 Santiago está programando (Haz clic para hablar)';
        case 'GREETING': return '👋 "¡Hola! Bienvenido a mi portfolio"';
        case 'CHAT_IDLE': return '🎧 Receptivo y escuchando tus preguntas';
        case 'TALKING': return '💬 Explicando arquitectura y sistemas...';
        case 'RETURNING': return '↩ Retomando el teclado...';
      }
    }
  };

  return (
    <div
      className="relative w-full max-w-[640px] mx-auto flex flex-col items-center justify-center select-none"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}>

      {/* Status Tooltip */}
      <div
        className={`absolute -top-8 z-30 transition-all duration-300 transform pointer-events-none ${
          isHovered || currentState !== 'TYPING' ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
        }`}>
        <div className="px-4 py-1.5 rounded-full bg-[#1e293b]/95 backdrop-blur-md border border-white/20 shadow-lg flex items-center gap-2">
          <span className={`w-2 h-2 rounded-full ${
            currentState === 'TYPING' ? 'bg-emerald-400 animate-pulse' :
            currentState === 'GREETING' ? 'bg-amber-400 animate-bounce' :
            currentState === 'CHAT_IDLE' ? 'bg-sky-400 animate-pulse' :
            currentState === 'TALKING' ? 'bg-rose-400 animate-pulse' : 'bg-indigo-400'
          }`} />
          <span className="font-space text-xs font-bold text-white tracking-wide whitespace-nowrap">
            {getStatusText()}
          </span>
        </div>
        <div className="w-2.5 h-2.5 bg-[#1e293b] border-r border-b border-white/20 transform rotate-45 mx-auto -mt-1" />
      </div>

      {/* Dual Video Player with Cross-fade */}
      <div
        onClick={handleClick}
        className="relative w-full aspect-[16/10] sm:aspect-[16/9.5] max-h-[380px] sm:max-h-[420px] rounded-2xl overflow-hidden cursor-pointer group flex items-center justify-center transition-transform duration-300 hover:scale-[1.015]">

        <video
          ref={playerARef}
          playsInline
          muted
          preload="auto"
          className="absolute inset-0 w-full h-full object-contain pointer-events-none transition-opacity duration-300 ease-in-out"
          style={{ opacity: activePlayer === 'A' ? 1 : 0 }}
          onEnded={() => handleEnded('A')}
        />

        <video
          ref={playerBRef}
          playsInline
          muted
          preload="auto"
          className="absolute inset-0 w-full h-full object-contain pointer-events-none transition-opacity duration-300 ease-in-out"
          style={{ opacity: activePlayer === 'B' ? 1 : 0 }}
          onEnded={() => handleEnded('B')}
        />

        <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-[#d6d6d6]/40 via-transparent to-[#d6d6d6]/20" />
      </div>

    </div>
  );
};
