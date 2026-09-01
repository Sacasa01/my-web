import { useState, useCallback, useRef } from 'react';

export type AvatarState = 'TYPING' | 'GREETING' | 'CHAT_IDLE' | 'TALKING' | 'RETURNING';

export interface UseAvatarStateReturn {
  currentState: AvatarState;
  isChatOpen: boolean;
  handleAvatarClick: () => void;
  handleStreamStart: () => void;
  handleStreamEnd: () => void;
  handleCloseChat: () => void;
  handleVideoEnded: (endedState: AvatarState) => void;
  setAvatarState: (state: AvatarState) => void;
}

export const useAvatarState = (initialState: AvatarState = 'TYPING'): UseAvatarStateReturn => {
  const [currentState, setCurrentState] = useState<AvatarState>(initialState);
  const [isChatOpen, setIsChatOpen] = useState<boolean>(false);
  const isStreamingRef = useRef<boolean>(false);

  // Click on avatar: starts GREETING and opens speech bubble chat
  const handleAvatarClick = useCallback(() => {
    if (currentState === 'TYPING') {
      setCurrentState('GREETING');
      setIsChatOpen(true);
    } else if (currentState === 'CHAT_IDLE' || currentState === 'TALKING') {
      setIsChatOpen(true);
    }
  }, [currentState]);

  // AI begins streaming response -> avatar gesticulates
  const handleStreamStart = useCallback(() => {
    isStreamingRef.current = true;
    setCurrentState('TALKING');
  }, []);

  // AI finishes streaming response -> avatar returns to receptive listening
  const handleStreamEnd = useCallback(() => {
    isStreamingRef.current = false;
    setCurrentState('CHAT_IDLE');
  }, []);

  // User closes speech bubble chat -> starts RETURNING transition
  const handleCloseChat = useCallback(() => {
    setIsChatOpen(false);
    isStreamingRef.current = false;
    setCurrentState('RETURNING');
  }, []);

  // Natural video end event handler
  const handleVideoEnded = useCallback((endedState: AvatarState) => {
    if (endedState === 'GREETING') {
      // After greeting clip completes, stay in receptive CHAT_IDLE loop
      setCurrentState(isStreamingRef.current ? 'TALKING' : 'CHAT_IDLE');
    } else if (endedState === 'RETURNING') {
      // After returning clip completes, resume TYPING loop
      setCurrentState('TYPING');
    }
  }, []);

  const setAvatarState = useCallback((state: AvatarState) => {
    setCurrentState(state);
    if (state === 'GREETING' || state === 'CHAT_IDLE' || state === 'TALKING') {
      setIsChatOpen(true);
    } else if (state === 'TYPING' || state === 'RETURNING') {
      setIsChatOpen(false);
    }
  }, []);

  return {
    currentState,
    isChatOpen,
    handleAvatarClick,
    handleStreamStart,
    handleStreamEnd,
    handleCloseChat,
    handleVideoEnded,
    setAvatarState
  };
};
