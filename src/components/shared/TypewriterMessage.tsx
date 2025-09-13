import { useState, useEffect, useRef } from 'react';
import { Box } from '@mui/material';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import rehypeRaw from 'rehype-raw';
import { useTheme } from '../../hooks/useTheme';
import { addActiveTypewriter, removeActiveTypewriter } from '../../utils/typewriterState';

interface TypewriterMessageProps {
  content: string;
  speed?: number;
  onComplete?: () => void;
  isUser?: boolean;
  modelColor?: string;
  shouldAnimate?: boolean; // Add prop to control animation
}

const TypewriterMessage = ({
  content,
  speed = 30,
  onComplete,
  isUser = false,
  modelColor,
  shouldAnimate = true // Default to true for backward compatibility
}: TypewriterMessageProps) => {
  const { mode } = useTheme();
  const [displayedContent, setDisplayedContent] = useState('');
  const [isTyping, setIsTyping] = useState(true);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const indexRef = useRef(0);
  const onCompleteRef = useRef(onComplete);
  const hasCompletedRef = useRef(false);

  // Update the ref when onComplete changes
  onCompleteRef.current = onComplete;

  useEffect(() => {
    // Reset completion flag for new content
    hasCompletedRef.current = false;

    if (isUser || !shouldAnimate) {
      // For user messages or when animation is disabled, show immediately without typing effect
      setDisplayedContent(content);
      setIsTyping(false);
      if (!hasCompletedRef.current) {
        hasCompletedRef.current = true;
        onCompleteRef.current?.();
      }
      return;
    }

    // Reset state for new content
    setDisplayedContent('');
    setIsTyping(true);
    indexRef.current = 0;

    const typeNextCharacter = () => {
      if (indexRef.current < content.length) {
        setDisplayedContent(content.slice(0, indexRef.current + 1));
        indexRef.current++;
        
        timeoutRef.current = setTimeout(typeNextCharacter, speed);
      } else {
        setIsTyping(false);
        if (!hasCompletedRef.current) {
          hasCompletedRef.current = true;
          onCompleteRef.current?.();
        }
        // Remove from active typewriters when complete
        if (cleanupFunction) {
          removeActiveTypewriter(cleanupFunction);
        }
      }
    };

    // Cleanup function to stop typing
    const cleanupFunction = () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
      // Show complete content immediately when interrupted
      setDisplayedContent(content);
      setIsTyping(false);
      if (!hasCompletedRef.current) {
        hasCompletedRef.current = true;
        onCompleteRef.current?.();
      }
    };

    // Register this typewriter as active
    addActiveTypewriter(cleanupFunction);

    // Start typing after a small delay
    timeoutRef.current = setTimeout(typeNextCharacter, 100);

    return () => {
      // Remove from active typewriters on unmount
      removeActiveTypewriter(cleanupFunction);
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [content, speed, isUser, shouldAnimate]);

  // If it's a user message or typing is complete, render normally
  if (isUser || !isTyping) {
    return (
      <Box
        sx={{
          '& p': {
            margin: '0.5em 0',
            lineHeight: 1.6,
            '&:first-of-type': {
              marginTop: 0,
            },
            '&:last-of-type': {
              marginBottom: 0,
            },
          },
          '& pre': {
            backgroundColor: mode === 'light' ? '#f5f5f5' : '#2d2d2d',
            borderRadius: '8px',
            padding: '12px',
            overflow: 'auto',
            fontSize: '14px',
            lineHeight: 1.4,
            margin: '8px 0',
          },
          '& code': {
            backgroundColor: mode === 'light' ? '#f5f5f5' : '#2d2d2d',
            padding: '2px 4px',
            borderRadius: '4px',
            fontSize: '0.9em',
            fontFamily: 'Monaco, Menlo, Consolas, monospace',
          },
          '& pre code': {
            backgroundColor: 'transparent',
            padding: 0,
          },
          '& ul, & ol': {
            paddingLeft: '20px',
            margin: '8px 0',
          },
          '& li': {
            margin: '4px 0',
          },
          '& blockquote': {
            borderLeft: `4px solid ${modelColor || '#1976d2'}`,
            paddingLeft: '12px',
            margin: '8px 0',
            fontStyle: 'italic',
            color: mode === 'light' ? '#666' : '#aaa',
          },
          '& h1, & h2, & h3, & h4, & h5, & h6': {
            margin: '16px 0 8px 0',
            fontWeight: 600,
          },
          '& table': {
            borderCollapse: 'collapse',
            width: '100%',
            margin: '8px 0',
          },
          '& th, & td': {
            border: `1px solid ${mode === 'light' ? '#ddd' : '#555'}`,
            padding: '8px 12px',
            textAlign: 'left',
          },
          '& th': {
            backgroundColor: mode === 'light' ? '#f5f5f5' : '#2d2d2d',
            fontWeight: 600,
          },
        }}
      >
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          rehypePlugins={[rehypeHighlight, rehypeRaw]}
        >
          {displayedContent || content}
        </ReactMarkdown>
      </Box>
    );
  }

  // During typing, show the content with a cursor
  return (
    <Box
      sx={{
        '& p': {
          margin: '0.5em 0',
          lineHeight: 1.6,
          '&:first-of-type': {
            marginTop: 0,
          },
          '&:last-of-type': {
            marginBottom: 0,
          },
        },
      }}
    >
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeHighlight, rehypeRaw]}
      >
        {displayedContent}
      </ReactMarkdown>
    </Box>
  );
};

export default TypewriterMessage;
