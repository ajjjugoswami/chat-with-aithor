import { Box } from '@mui/material';
import type { ReactNode } from 'react';
import FormattedMessage from './shared/FormattedMessage';

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
  return (
    <FormattedMessage
      content={message.content}
      isUser={message.sender === 'user'}
      timestamp={message.timestamp}
    />
  );
}
