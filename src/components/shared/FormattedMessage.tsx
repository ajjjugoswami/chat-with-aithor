import { Box, Typography, IconButton, Avatar } from '@mui/material';
import { ContentCopy, Check } from '@mui/icons-material';
import { UserIcon } from './Icons';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import rehypeRaw from 'rehype-raw';
import { useState } from 'react';
import 'highlight.js/styles/vs2015.css'; // Dark theme for code highlighting
import './message-styles.css'; // Custom message styles
import { useTheme } from '../../hooks/useTheme';

interface FormattedMessageProps {
  content: string;
  isUser?: boolean;
  modelColor?: string;
  timestamp?: Date;
  isTyping?: boolean;
}

export default function FormattedMessage({ 
  content, 
  isUser = false, 
  modelColor,
  timestamp,
  isTyping = false 
}: FormattedMessageProps) {
  const { mode } = useTheme();
  const [copiedBlocks, setCopiedBlocks] = useState<Set<number>>(new Set());
  const [messageCopied, setMessageCopied] = useState(false);

  const handleCopyCode = async (code: string, blockIndex: number) => {
    try {
      await navigator.clipboard.writeText(code);
      setCopiedBlocks(prev => new Set(prev).add(blockIndex));
      setTimeout(() => {
        setCopiedBlocks(prev => {
          const newSet = new Set(prev);
          newSet.delete(blockIndex);
          return newSet;
        });
      }, 2000);
    } catch (err) {
      console.error('Failed to copy code:', err);
    }
  };

  const handleCopyMessage = async () => {
    try {
      await navigator.clipboard.writeText(content);
      setMessageCopied(true);
      setTimeout(() => setMessageCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy message:', err);
    }
  };

  if (isUser) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'flex-end',
          mb: 2,
          alignItems: 'flex-start',
          gap: 1.5,
        }}
      >
        <Box
          sx={{
            maxWidth: '75%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-end',
          }}
        >
          {/* User question label */}
          <Typography
            variant="caption"
            sx={{
              color: mode === 'light' ? '#666' : '#888',
              fontSize: '12px',
              mb: 0.5,
              fontWeight: 500,
              display: 'flex',
              alignItems: 'center',
              gap: 0.5,
            }}
          >
            You
          </Typography>
          
          {/* Message bubble */}
          <Box
            sx={{
              p: 2,
              borderRadius: '18px 18px 4px 18px',
              bgcolor: mode === 'light' ? '#1976d2' : '#007aff',
              color: 'white',
              wordBreak: 'break-word',
              fontSize: '14px',
              lineHeight: 1.5,
              position: 'relative',
              boxShadow: '0 2px 8px rgba(0, 122, 255, 0.2)',
              border: '1px solid rgba(0, 122, 255, 0.3)',
            }}
          >
            <Typography 
              variant="body2" 
              sx={{ 
                whiteSpace: 'pre-wrap',
                fontWeight: 400,
              }}
            >
              {content}
            </Typography>
            {timestamp && (
              <Typography
                variant="caption"
                sx={{
                  fontSize: '11px',
                  opacity: 0.8,
                  display: 'block',
                  textAlign: 'right',
                  mt: 1,
                  pt: 0.5,
                }}
              >
                {timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </Typography>
            )}
          </Box>
        </Box>
        
        {/* User avatar */}
        <Avatar
          sx={{
            width: 36,
            height: 36,
            bgcolor: '#007aff',
            color: 'white',
            fontSize: '18px',
            mt: 0.5,
          }}
        >
          <UserIcon sx={{ fontSize: 20 ,color:"#fff"}} />
        </Avatar>
      </Box>
    );
  }

  // Typing indicator
  if (isTyping) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'flex-start',
          mb: 2,
          alignItems: 'flex-start',
          gap: 1.5,
        }}
      >
        {/* AI Model indicator */}
        <Box
          sx={{
            width: 36,
            height: 36,
            borderRadius: '50%',
            bgcolor: modelColor || '#4fc3f7',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '16px',
            fontWeight: 'bold',
            color: 'white',
            flexShrink: 0,
            mt: 0.5,
          }}
        >
          AI
        </Box>
        
        <Box
          sx={{
            p: 2,
            borderRadius: '18px 18px 18px 4px',
            bgcolor: mode === 'light' ? '#f5f5f5' : '#2a2a2a',
            color: mode === 'light' ? '#333' : 'white',
            border: `1px solid ${modelColor}30`,
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            boxShadow: `0 2px 8px ${modelColor}15`,
          }}
        >
          <Box
            sx={{
              display: 'flex',
              gap: 0.5,
              '& .typing-dot': {
                width: 6,
                height: 6,
                borderRadius: '50%',
                backgroundColor: modelColor || '#666',
                animation: 'typing 1.4s infinite ease-in-out',
                '&:nth-of-type(1)': { animationDelay: '0s' },
                '&:nth-of-type(2)': { animationDelay: '0.2s' },
                '&:nth-of-type(3)': { animationDelay: '0.4s' },
              },
              '@keyframes typing': {
                '0%, 60%, 100%': { opacity: 0.3, transform: 'scale(0.8)' },
                '30%': { opacity: 1, transform: 'scale(1)' },
              },
            }}
          >
            <Box className="typing-dot" />
            <Box className="typing-dot" />
            <Box className="typing-dot" />
          </Box>
        </Box>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'flex-start',
        mb: 2,
        alignItems: 'flex-start',
        gap: 1.5,
      }}
    >
      {/* AI Model indicator */}
      <Box
        sx={{
          width: 36,
          height: 36,
          borderRadius: '50%',
          bgcolor: modelColor || '#4fc3f7',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '16px',
          fontWeight: 'bold',
          color: 'white',
          flexShrink: 0,
          mt: 0.5,
        }}
      >
        AI
      </Box>
      
      <Box
        sx={{
          maxWidth: 'calc(100% - 60px)',
          borderRadius: '18px 18px 18px 4px',
          bgcolor: mode === 'light' ? '#f8f9fa' : '#2a2a2a',
          color: mode === 'light' ? '#333' : 'white',
          wordBreak: 'break-word',
          fontSize: '14px',
          lineHeight: 1.5,
          border: `1px solid ${modelColor}30`,
          overflow: 'hidden',
          position: 'relative',
          boxShadow: `0 2px 8px ${modelColor}15`,
          '&:hover .message-actions': {
            opacity: 1,
          },
          '& .markdown-content': {
            p: 2,
          },
          '& pre': {
            position: 'relative',
            margin: '16px 0',
            borderRadius: '8px',
            backgroundColor: mode === 'light' ? '#f1f1f1 !important' : '#1e1e1e !important',
            border: mode === 'light' ? '1px solid #ddd' : '1px solid #333',
            overflow: 'hidden',
            '& code': {
              fontSize: '13px',
              lineHeight: 1.4,
              display: 'block',
              padding: '12px',
              background: 'transparent !important',
            },
          },
          '& code': {
            backgroundColor: mode === 'light' ? '#e9ecef' : '#333',
            padding: '2px 6px',
            borderRadius: '4px',
            fontSize: '13px',
            fontFamily: '"Fira Code", "Consolas", "Monaco", monospace',
            color: mode === 'light' ? '#495057' : '#f8f8f2',
          },
          '& pre code': {
            backgroundColor: 'transparent',
            padding: 0,
            borderRadius: 0,
          },
          '& p': {
            margin: '0 0 12px 0',
            lineHeight: 1.6,
            fontSize: '14px',
            '&:last-child': {
              marginBottom: 0,
            },
          },
          '& h1, & h2, & h3, & h4, & h5, & h6': {
            color: modelColor || '#fff',
            marginTop: '20px',
            marginBottom: '12px',
            fontWeight: 'bold',
            lineHeight: 1.3,
            '&:first-of-type': {
              marginTop: 0,
            },
          },
          '& h1': {
            fontSize: '24px',
            borderBottom: `2px solid ${modelColor || '#666'}`,
            paddingBottom: '8px',
          },
          '& h2': {
            fontSize: '20px',
            borderBottom: `1px solid ${modelColor || '#666'}`,
            paddingBottom: '6px',
          },
          '& h3': {
            fontSize: '18px',
          },
          '& h4': {
            fontSize: '16px',
          },
          '& h5, & h6': {
            fontSize: '14px',
          },
          '& ul, & ol': {
            paddingLeft: '24px',
            margin: '12px 0',
            '& li': {
              marginBottom: '6px',
              lineHeight: 1.5,
            },
            '& ul, & ol': {
              margin: '6px 0',
            },
          },
          '& blockquote': {
            borderLeft: `4px solid ${modelColor || '#666'}`,
            paddingLeft: '16px',
            margin: '16px 0',
            fontStyle: 'italic',
            opacity: 0.9,
            backgroundColor: 'rgba(255, 255, 255, 0.05)',
            padding: '12px 16px',
            borderRadius: '0 8px 8px 0',
          },
          '& table': {
            borderCollapse: 'collapse',
            width: '100%',
            margin: '16px 0',
            border: '1px solid #444',
            borderRadius: '8px',
            overflow: 'hidden',
          },
          '& th, & td': {
            border: '1px solid #444',
            padding: '10px 14px',
            textAlign: 'left',
          },
          '& th': {
            backgroundColor: '#333',
            fontWeight: 'bold',
            color: modelColor || '#fff',
          },
          '& tr:nth-of-type(even)': {
            backgroundColor: 'rgba(255, 255, 255, 0.02)',
          },
          '& a': {
            color: modelColor || '#4fc3f7',
            textDecoration: 'none',
            '&:hover': {
              textDecoration: 'underline',
            },
          },
          '& hr': {
            border: 'none',
            borderTop: `1px solid ${modelColor || '#666'}`,
            margin: '20px 0',
            opacity: 0.5,
          },
          '& strong': {
            fontWeight: 'bold',
            color: '#fff',
          },
          '& em': {
            fontStyle: 'italic',
            color: '#ddd',
          },
        }}
      >
        {/* Message Actions */}
        <Box
          className="message-actions"
          sx={{
            position: 'absolute',
            top: 8,
            right: 8,
            opacity: 0,
            transition: 'opacity 0.2s ease',
            display: 'flex',
            gap: 0.5,
            zIndex: 10,
          }}
        >
          <IconButton
            size="small"
            onClick={handleCopyMessage}
            sx={{
              bgcolor: 'rgba(0, 0, 0, 0.7)',
              color: messageCopied ? '#4caf50' : '#888',
              '&:hover': { 
                color: 'white',
                bgcolor: 'rgba(0, 0, 0, 0.9)',
              },
              p: 0.5,
            }}
          >
            {messageCopied ? (
              <Check sx={{ fontSize: '16px' }} />
            ) : (
              <ContentCopy sx={{ fontSize: '16px' }} />
            )}
          </IconButton>
        </Box>
        <Box className="markdown-content">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            rehypePlugins={[rehypeHighlight, rehypeRaw]}
            components={{
              pre: ({ children, ...props }) => {
                return (
                  <Box sx={{ position: 'relative' }}>
                    <pre {...props} style={{ padding: '12px' }}>
                      {children}
                    </pre>
                  </Box>
                );
              },
              code: ({ children, className, ...props }) => {
                const isInline = !className;
                const language = className?.replace('language-', '') || '';
                const codeContent = typeof children === 'string' ? children : String(children);
                const blockIndex = Math.random();

                if (isInline) {
                  return <code {...props}>{children}</code>;
                }

                return (
                  <Box sx={{ position: 'relative' }}>
                    {language && (
                      <Box
                        sx={{
                          position: 'absolute',
                          top: 0,
                          right: 0,
                          display: 'flex',
                          alignItems: 'center',
                          gap: 1,
                          p: 1,
                          backgroundColor: 'rgba(0, 0, 0, 0.3)',
                          borderBottomLeftRadius: '4px',
                          zIndex: 1,
                        }}
                      >
                        <Typography
                          variant="caption"
                          sx={{
                            color: '#888',
                            fontSize: '11px',
                            textTransform: 'uppercase',
                            fontWeight: 'bold',
                          }}
                        >
                          {language}
                        </Typography>
                        <IconButton
                          size="small"
                          onClick={() => handleCopyCode(codeContent, blockIndex)}
                          sx={{
                            color: '#888',
                            '&:hover': { color: 'white' },
                            p: 0.5,
                          }}
                        >
                          {copiedBlocks.has(blockIndex) ? (
                            <Check sx={{ fontSize: '14px' }} />
                          ) : (
                            <ContentCopy sx={{ fontSize: '14px' }} />
                          )}
                        </IconButton>
                      </Box>
                    )}
                    <code {...props} style={{ paddingTop: language ? '32px' : '12px' }}>
                      {children}
                    </code>
                  </Box>
                );
              },
            }}
          >
            {content}
          </ReactMarkdown>
          {timestamp && (
            <Typography
              variant="caption"
              sx={{
                fontSize: '11px',
                opacity: 0.5,
                display: 'block',
                textAlign: 'right',
                mt: 1,
                pt: 1,
                borderTop: '1px solid rgba(255, 255, 255, 0.1)',
              }}
            >
              {timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </Typography>
          )}
        </Box>
      </Box>
    </Box>
  );
}
