import { Box, Typography, Avatar, IconButton, Button } from '@mui/material';
import { ExpandMore, ExpandLess, Settings, Key } from '@mui/icons-material';
import { useState } from 'react';
import type { ReactNode } from 'react';
import type { AIModel } from './AIModelTabs';
import { hasAPIKey } from '../utils/apiKeys';
import APIKeyDialog from './APIKeyDialog';
import { saveAPIKey } from '../utils/apiKeys';

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'ai';
  timestamp: Date;
  modelId?: string;
}

interface ModelPanelProps {
  model: AIModel;
  messages: Message[];
  isActive: boolean;
  onToggle?: (modelId: string) => void;
}

function ModelPanel({ model, messages, isActive }: ModelPanelProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [apiKeyDialogOpen, setApiKeyDialogOpen] = useState(false);
  const [hasApiKey, setHasApiKey] = useState(hasAPIKey(model.id));
  
  const modelMessages = messages.filter(msg => 
    msg.sender === 'user' || msg.modelId === model.id
  );

  const handleSaveAPIKey = (modelId: string, apiKey: string) => {
    saveAPIKey(modelId, apiKey, model.displayName);
    setHasApiKey(true); // Update local state
    setApiKeyDialogOpen(false);
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        minWidth: isCollapsed ? 60 : 380,
        maxWidth: isCollapsed ? 60 : 450,
        bgcolor: '#1a1a1a',
        borderRight: '1px solid #333',
        opacity: isActive ? 1 : 0.7,
        position: 'relative',
        flexShrink: 0,
        transition: 'all 0.3s ease',
      }}
    >
      {/* Model Header */}
      <Box
        sx={{
          p: 2,
          borderBottom: '1px solid #333',
          display: 'flex',
          alignItems: 'center',
          gap: 2,
          bgcolor: '#202020',
          position: 'sticky',
          top: 0,
          zIndex: 1,
          justifyContent: isCollapsed ? 'center' : 'space-between',
        }}
      >
        {!isCollapsed && (
          <>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Avatar
                sx={{
                  width: 28,
                  height: 28,
                  bgcolor: model.color,
                  fontSize: '12px',
                }}
              >
                {model.icon}
              </Avatar>
              <Typography variant="subtitle1" sx={{ color: 'white', fontWeight: 600 }}>
                {model.displayName}
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <IconButton
                size="small"
                onClick={() => setIsCollapsed(true)}
                sx={{ color: '#888', '&:hover': { color: 'white' } }}
              >
                <ExpandLess />
              </IconButton>
              <IconButton
                size="small"
                sx={{ color: '#888', '&:hover': { color: 'white' } }}
              >
                <Settings />
              </IconButton>
            </Box>
          </>
        )}
        
        {isCollapsed && (
          <IconButton
            size="small"
            onClick={() => setIsCollapsed(false)}
            sx={{ color: model.color, '&:hover': { color: 'white' } }}
          >
            <ExpandMore />
          </IconButton>
        )}
      </Box>

      {/* Messages Area - Only show when not collapsed */}
      {!isCollapsed && (
        <>
          <Box
            sx={{
              flex: 1,
              overflowY: 'auto',
              p: 2,
              display: 'flex',
              flexDirection: 'column',
              gap: 1.5,
              '&::-webkit-scrollbar': {
                width: '6px',
              },
              '&::-webkit-scrollbar-track': {
                background: '#1a1a1a',
              },
              '&::-webkit-scrollbar-thumb': {
                background: '#444',
                borderRadius: '3px',
              },
              '&::-webkit-scrollbar-thumb:hover': {
                background: '#555',
              },
            }}
          >
            {!hasApiKey ? (
              /* Show API Key button when no API key exists */
              <Box 
                sx={{ 
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexDirection: 'column',
                  height: '100%',
                  gap: 2
                }}
              >
                <Typography variant="body2" sx={{ color: '#666', textAlign: 'center' }}>
                  Add your API key to start chatting with {model.displayName}
                </Typography>
                <Button
                  variant="contained"
                  startIcon={<Key />}
                  onClick={() => setApiKeyDialogOpen(true)}
                  sx={{
                    bgcolor: model.color,
                    color: 'white',
                    borderRadius: 3,
                    textTransform: 'none',
                    px: 3,
                    py: 1.5,
                    '&:hover': { 
                      bgcolor: model.color,
                      filter: 'brightness(1.1)',
                    },
                  }}
                >
                  Add API Key
                </Button>
              </Box>
            ) : modelMessages.length === 0 ? (
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  height: '100%',
                  color: '#666',
                  textAlign: 'center',
                  fontSize: '14px',
                }}
              >
                <Typography variant="body2">
                  Start a conversation to see {model.displayName} responses
                </Typography>
              </Box>
            ) : (
              modelMessages.map((message) => (
                <MessageBubble 
                  key={`${model.id}-${message.id}`} 
                  message={message} 
                  modelColor={model.color}
                />
              ))
            )}
          </Box>
        </>
      )}

      {/* API Key Dialog */}
      <APIKeyDialog
        open={apiKeyDialogOpen}
        onClose={() => setApiKeyDialogOpen(false)}
        model={model}
        onSave={handleSaveAPIKey}
      />
    </Box>
  );
}

function MessageBubble({ message, modelColor }: { message: Message; modelColor?: string }) {
  const isUser = message.sender === 'user';

  if (isUser) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'flex-end',
          mb: 1,
        }}
      >
        <Box
          sx={{
            maxWidth: '80%',
            p: 1.5,
            borderRadius: 2,
            bgcolor: '#007aff',
            color: 'white',
            wordBreak: 'break-word',
            fontSize: '14px',
            lineHeight: 1.4,
          }}
        >
          {message.content}
        </Box>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'flex-start',
        mb: 1,
      }}
    >
      <Box
        sx={{
          maxWidth: '100%',
          p: 2,
          borderRadius: 2,
          bgcolor: '#2a2a2a',
          color: 'white',
          wordBreak: 'break-word',
          fontSize: '14px',
          lineHeight: 1.5,
          border: `1px solid ${modelColor}30`,
        }}
      >
        {message.content}
      </Box>
    </Box>
  );
}

interface MultiPanelChatAreaProps {
  models: AIModel[];
  messages: Message[];
  chatInput: ReactNode;
  onModelToggle?: (modelId: string) => void;
}

export default function MultiPanelChatArea({ models, messages, chatInput, onModelToggle }: MultiPanelChatAreaProps) {
  const enabledModels = models.filter(model => model.enabled);

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        bgcolor: '#1a1a1a',
        flex: 1,
        overflow: 'hidden', // Prevent whole app scroll
      }}
    >
      {/* Multi-Panel Messages Container */}
      <Box
        sx={{
          flex: 1,
          display: 'flex',
          overflowX: 'auto', // Horizontal scroll for panels
          overflowY: 'hidden',
          '&::-webkit-scrollbar': {
            height: '8px',
          },
          '&::-webkit-scrollbar-track': {
            background: '#1a1a1a',
          },
          '&::-webkit-scrollbar-thumb': {
            background: '#444',
            borderRadius: '4px',
          },
          '&::-webkit-scrollbar-thumb:hover': {
            background: '#555',
          },
        }}
      >
        {enabledModels.length === 0 ? (
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '100%',
              height: '100%',
              color: '#666',
              fontSize: '18px',
              textAlign: 'center',
            }}
          >
            <Box>
              <Typography variant="h5" sx={{ mb: 2 }}>
                No AI models enabled
              </Typography>
              <Typography>
                Enable at least one AI model from the tabs above to start chatting
              </Typography>
            </Box>
          </Box>
        ) : (
          enabledModels.map((model) => (
            <ModelPanel
              key={model.id}
              model={model}
              messages={messages}
              isActive={true}
              onToggle={onModelToggle}
            />
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
