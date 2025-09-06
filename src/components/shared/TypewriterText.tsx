import React, { useEffect, useRef } from 'react';
import Typed from 'typed.js';

interface TypewriterTextProps {
  text: string;
  speed?: number;
  onComplete?: () => void;
  className?: string;
  style?: React.CSSProperties;
}

export default function TypewriterText({ 
  text, 
  speed = 30, 
  onComplete,
  className,
  style 
}: TypewriterTextProps) {
  const elementRef = useRef<HTMLSpanElement>(null);
  const typedRef = useRef<Typed | null>(null);

  useEffect(() => {
    if (!elementRef.current) return;

    // Clean up previous instance
    if (typedRef.current) {
      typedRef.current.destroy();
    }

    // Create new Typed instance
    typedRef.current = new Typed(elementRef.current, {
      strings: [text],
      typeSpeed: speed,
      showCursor: false,
      onComplete: () => {
        onComplete?.();
      },
    });

    return () => {
      if (typedRef.current) {
        typedRef.current.destroy();
      }
    };
  }, [text, speed, onComplete]);

  return (
    <span 
      ref={elementRef} 
      className={className}
      style={style}
    />
  );
}
