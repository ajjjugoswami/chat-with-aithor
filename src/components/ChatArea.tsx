import { Box } from '@mui/material';
import type { ReactNode } from 'react';

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'ai';
  timestamp: Date;
}

interface ChatAreaProps {
  messages: Message[];
  chatInput: ReactNode;
}

export default function ChatArea({ messages, chatInput }: ChatAreaProps) {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        bgcolor: '#1a1a1a',
        flex: 1,
      }}
    >
      {/* Messages Container */}
      <Box
        sx={{
          flex: 1,
          overflowY: 'auto',
          p: 3,
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
        }}
      >
        {messages.length === 0 ? (
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              height: '100%',
              color: '#666',
              fontSize: '18px',
            }}
          >
            Start a conversation...
          </Box>
        ) : (
          messages.map((message) => (
            <MessageBubble key={message.id} message={message} />
          ))
        )}
      </Box>

      {/* Input Area */}
      <Box
        sx={{
          borderTop: '1px solid #404040',
          p: 2,
        }}
      >
        {chatInput}
      </Box>
    </Box>
  );
}

function MessageBubble({ message }: { message: Message }) {
  const isUser = message.sender === 'user';

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: isUser ? 'flex-end' : 'flex-start',
        mb: 2,
      }}
    >
      <Box
        sx={{
          maxWidth: '70%',
          p: 2,
          borderRadius: 2,
          bgcolor: isUser ? '#007aff' : '#2a2a2a',
          color: 'white',
          wordBreak: 'break-word',
        }}
      >
        {message.content}
      </Box>
    </Box>
  );
}
