import React, { useRef, useEffect } from 'react';
import { AvatarState } from '../../hooks/useAvatarState';

interface AvatarContainerProps {
  currentState: AvatarState;
  onAvatarClick: () => void;
  onVideoEnded: (state: AvatarState) => void;
  lang?: 'en' | 'es';
}

const VIDEOS: { state: AvatarState; srcMp4: string; srcWebm: string; loop: boolean }[] = [
  { state: 'TYPING', srcMp4: '/videos/avatar-typing-loop.mp4', srcWebm: '/videos/avatar-typing-loop.webm', loop: true },
  { state: 'GREETING', srcMp4: '/videos/avatar-greeting.mp4', srcWebm: '/videos/avatar-greeting.webm', loop: false },
  { state: 'CHAT_IDLE', srcMp4: '/videos/avatar-chat-idle.mp4', srcWebm: '/videos/avatar-chat-idle.webm', loop: true },
  { state: 'TALKING', srcMp4: '/videos/avatar-talking.mp4', srcWebm: '/videos/avatar-talking.webm', loop: true },
  { state: 'RETURNING', srcMp4: '/videos/avatar-return.mp4', srcWebm: '/videos/avatar-return.webm', loop: false }
];

export const AvatarContainer: React.FC<AvatarContainerProps> = ({
  currentState,
  onAvatarClick,
  onVideoEnded,
  lang = 'en'
}) => {
  const videoRefs = useRef<Map<AvatarState, HTMLVideoElement>>(new Map());

  // Play and synchronize active video whenever state changes
  useEffect(() => {
    const activeVideo = videoRefs.current.get(currentState);
    if (activeVideo) {
      activeVideo.currentTime = 0;
      activeVideo.play().catch(err => {
        console.warn('Autoplay caught:', err);
      });
    }

    // Pause non-active videos after cross-fade completes (500ms)
    const timeout = setTimeout(() => {
      videoRefs.current.forEach((video, state) => {
        if (state !== currentState && !video.paused) {
          video.pause();
        }
      });
    }, 520);

    return () => clearTimeout(timeout);
  }, [currentState]);

  return (
    <div className="relative w-full max-w-[620px] mx-auto flex flex-col items-center justify-center select-none">
      
      <!-- Video Stage Container with Radial Edge Feathering Mask -->
      <div
        onClick={onAvatarClick}
        style={{
          maskImage: 'radial-gradient(circle at center, black 70%, transparent 100%)',
          WebkitMaskImage: 'radial-gradient(circle at center, black 70%, transparent 100%)'
        }}
        className="relative w-full aspect-[16/10] sm:aspect-[16/9.5] max-h-[390px] sm:max-h-[420px] overflow-hidden cursor-pointer group flex items-center justify-center transition-transform duration-300 hover:scale-[1.01]">

        {VIDEOS.map(v => (
          <video
            key={v.state}
            ref={el => {
              if (el) videoRefs.current.set(v.state, el);
              else videoRefs.current.delete(v.state);
            }}
            src={v.srcMp4}
            loop={v.loop}
            muted
            playsInline
            preload="auto"
            onEnded={() => onVideoEnded(v.state)}
            className={`absolute inset-0 w-full h-full object-contain pointer-events-none transition-opacity duration-500 ease-in-out ${
              currentState === v.state ? 'opacity-100' : 'opacity-0'
            }`}
          />
        ))}

        {/* Ambient Blend Overlay */}
        <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-[#d6d6d6]/30 via-transparent to-[#d6d6d6]/10" />
      </div>

      {/* Subtle interaction cue below desk */}
      {currentState === 'TYPING' && (
        <p className="text-[10px] sm:text-[11px] font-mono font-medium text-[#64748b] tracking-wider uppercase mt-1 animate-pulse">
          {lang === 'en' ? 'Click avatar to chat with digital twin' : 'Haz clic en el avatar para hablar con su gemelo'}
        </p>
      )}

    </div>
  );
};
