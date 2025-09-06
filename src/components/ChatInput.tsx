import { 
  Box, 
  TextField, 
  IconButton, 
  Paper,
  Chip,
  Typography,
  Tooltip,
  useMediaQuery
} from '@mui/material';
import { 
  Send, 
  AttachFile, 
  Image,
  Mic,
  Close,
  InsertDriveFile,
  PictureAsPdf,
  Description,
  Code
} from '@mui/icons-material';
import { useState, useRef } from 'react';
import { useTheme } from '../hooks/useTheme';

interface UploadedFile {
  id: string;
  file: File;
  type: 'image' | 'document' | 'code' | 'pdf' | 'other';
  preview?: string;
}

interface ChatInputProps {
  onSendMessage: (message: string, files?: UploadedFile[]) => void;
  disabled?: boolean;
  selectedModel?: string;
}

export default function ChatInput({ onSendMessage, disabled = false, selectedModel }: ChatInputProps) {
  const { mode } = useTheme();
  const isMobile = useMediaQuery('(max-width: 640px)');
  const [message, setMessage] = useState('');
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [isDragOver, setIsDragOver] = useState(false);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const getFileType = (file: File): UploadedFile['type'] => {
    if (file.type.startsWith('image/')) return 'image';
    if (file.type === 'application/pdf') return 'pdf';
    if (file.type.includes('text/') || file.name.match(/\.(js|ts|jsx|tsx|py|java|cpp|c|html|css|json|xml|yaml|yml)$/i)) return 'code';
    if (file.type.includes('document') || file.name.match(/\.(doc|docx|txt|rtf)$/i)) return 'document';
    return 'other';
  };

  const getFileIcon = (type: UploadedFile['type']) => {
    switch (type) {
      case 'image': return <Image />;
      case 'pdf': return <PictureAsPdf />;
      case 'code': return <Code />;
      case 'document': return <Description />;
      default: return <InsertDriveFile />;
    }
  };

  const handleFileUpload = (files: FileList | null) => {
    if (!files) return;

    Array.from(files).forEach(file => {
      const fileType = getFileType(file);
      const id = Math.random().toString(36).substr(2, 9);
      
      const newFile: UploadedFile = {
        id,
        file,
        type: fileType,
      };

      // Create preview for images
      if (fileType === 'image') {
        const reader = new FileReader();
        reader.onload = (e) => {
          setUploadedFiles(prev => prev.map(f => 
            f.id === id ? { ...f, preview: e.target?.result as string } : f
          ));
        };
        reader.readAsDataURL(file);
      }

      setUploadedFiles(prev => [...prev, newFile]);
    });
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const files = e.dataTransfer.files;
    handleFileUpload(files);
  };

  const removeFile = (id: string) => {
    setUploadedFiles(prev => prev.filter(file => file.id !== id));
  };

  const handleSend = () => {
    if (message.trim() || uploadedFiles.length > 0) {
      onSendMessage(message.trim(), uploadedFiles);
      setMessage('');
      setUploadedFiles([]);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <Box sx={{ position: 'relative', p: isMobile ? 0.5 : 1 }}>
      {/* Hidden file inputs */}
      <input
        type="file"
        ref={imageInputRef}
        accept="image/*"
        multiple
        style={{ display: 'none' }}
        onChange={(e) => handleFileUpload(e.target.files)}
      />
      <input
        type="file"
        ref={fileInputRef}
        multiple
        style={{ display: 'none' }}
        onChange={(e) => handleFileUpload(e.target.files)}
      />

      {/* File previews */}
      {uploadedFiles.length > 0 && (
        <Box sx={{ mb: 1 }}>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            {uploadedFiles.map((file) => (
              <Chip
                key={file.id}
                label={
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, maxWidth: 200 }}>
                    {file.type === 'image' && file.preview ? (
                      <Box
                        component="img"
                        src={file.preview}
                        sx={{
                          width: 20,
                          height: 20,
                          borderRadius: 0.5,
                          objectFit: 'cover'
                        }}
                      />
                    ) : (
                      getFileIcon(file.type)
                    )}
                    <Typography
                      variant="caption"
                      sx={{
                        color: 'inherit',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                        maxWidth: 150
                      }}
                    >
                      {file.file.name}
                    </Typography>
                  </Box>
                }
                onDelete={() => removeFile(file.id)}
                deleteIcon={<Close />}
                sx={{
                  bgcolor: 'rgba(102, 126, 234, 0.1)',
                  color: '#fff',
                  border: '1px solid rgba(102, 126, 234, 0.3)',
                  '& .MuiChip-deleteIcon': {
                    color: 'rgba(255, 255, 255, 0.7)',
                    '&:hover': {
                      color: '#fff'
                    }
                  }
                }}
              />
            ))}
          </Box>
        </Box>
      )}

      {/* Gradient border container */}
      <Box
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        sx={{
          position: 'relative',
          background: isDragOver 
            ? 'linear-gradient(135deg, #43e97b 0%, #38f9d7 25%, #667eea 50%, #764ba2 75%, #f093fb 100%)'
            : 'linear-gradient(135deg, #667eea 0%, #764ba2 25%, #f093fb 50%, #f5576c 75%, #4facfe 100%)',
          borderRadius: 4,
          padding: '2px',
          transition: 'all 0.3s ease',
          transform: isDragOver ? 'scale(1.02)' : 'scale(1)',
          '&:hover': {
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 20%, #f093fb 40%, #f5576c 60%, #4facfe 80%, #43e97b 100%)',
            // transform: 'scale(1.02)',
            boxShadow: '0 8px 32px rgba(102, 126, 234, 0.3)',
          },
          '&:focus-within': {
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 20%, #f093fb 40%, #f5576c 60%, #4facfe 80%, #43e97b 100%)',
          }
        }}
      >
        {/* Input container */}
        <Paper
          elevation={0}
          sx={{
            display: 'flex',
            alignItems: 'flex-end',
            background: mode === 'light' 
              ? 'linear-gradient(145deg, #f8f9fa 0%, #e9ecef 50%, #f8f9fa 100%)'
              : 'linear-gradient(145deg, #1e1e1e 0%, #2a2a2a 50%, #1a1a1a 100%)',
            borderRadius: 3.5,
            p: 2, // Increased padding from 1.5 to 2
            gap: 1,
            position: 'relative',
            overflow: 'hidden',
            minHeight: '70px', // Added minimum height
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: mode === 'light'
                ? 'linear-gradient(145deg, rgba(0,0,0,0.02) 0%, rgba(0,0,0,0.01) 50%, rgba(0,0,0,0.03) 100%)'
                : 'linear-gradient(145deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 50%, rgba(255,255,255,0.08) 100%)',
              pointerEvents: 'none',
            }
          }}
        >
        {/* File attachment buttons */}
        <Box sx={{ display: 'flex', gap: isMobile ? 0.25 : 0.5 }}>
          <Tooltip title="Upload Image">
            <IconButton
              size={isMobile ? "small" : "small"}
              onClick={() => imageInputRef.current?.click()}
              sx={{ 
                color: mode === 'light' ? '#666' : '#999',
                background: mode === 'light' 
                  ? 'rgba(0,0,0,0.03)' 
                  : 'rgba(255,255,255,0.05)',
                backdropFilter: 'blur(10px)',
                border: mode === 'light' 
                  ? '1px solid rgba(0,0,0,0.1)' 
                  : '1px solid rgba(255,255,255,0.1)',
                transition: 'all 0.3s ease',
                width: isMobile ? 28 : 32,
                height: isMobile ? 28 : 32,
                '&:hover': { 
                  color: mode === 'light' ? '#333' : '#fff', 
                  background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.3), rgba(118, 75, 162, 0.3))',
                  transform: 'translateY(-2px)',
                  boxShadow: '0 4px 12px rgba(102, 126, 234, 0.3)',
                },
              }}
            >
              <Image sx={{ fontSize: isMobile ? '0.9rem' : '1rem' }} />
            </IconButton>
          </Tooltip>
          <Tooltip title="Upload File">
            <IconButton
              size={isMobile ? "small" : "small"}
              onClick={() => fileInputRef.current?.click()}
              sx={{ 
                color: mode === 'light' ? '#666' : '#999',
                background: mode === 'light' 
                  ? 'rgba(0,0,0,0.03)' 
                  : 'rgba(255,255,255,0.05)',
                backdropFilter: 'blur(10px)',
                border: mode === 'light' 
                  ? '1px solid rgba(0,0,0,0.1)' 
                  : '1px solid rgba(255,255,255,0.1)',
                transition: 'all 0.3s ease',
                width: isMobile ? 28 : 32,
                height: isMobile ? 28 : 32,
                '&:hover': { 
                  color: mode === 'light' ? '#333' : '#fff', 
                  background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.3), rgba(118, 75, 162, 0.3))',
                  transform: 'translateY(-2px)',
                  boxShadow: '0 4px 12px rgba(102, 126, 234, 0.3)',
                },
              }}
            >
              <AttachFile sx={{ fontSize: isMobile ? '0.9rem' : '1rem' }} />
            </IconButton>
          </Tooltip>
        </Box>

        {/* Text input */}
        <TextField
          multiline
          maxRows={6}
          placeholder={selectedModel ? `Ask ${selectedModel}...` : "Ask me anything..."}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          disabled={disabled}
          variant="standard"
          InputProps={{
            disableUnderline: true,
            sx: {
              color: mode === 'light' ? '#333' : '#fff',
              fontSize: isMobile ? '14px' : '16px',
              fontWeight: '400',
              lineHeight: '1.5',
              '& ::placeholder': {
                color: mode === 'light' ? '#666' : '#888',
                opacity: 1,
                fontStyle: 'italic',
              },
            },
          }}
          sx={{
            flex: 1,
            '& .MuiInputBase-root': {
              bgcolor: 'transparent',
              borderRadius: 2,
              padding: isMobile ? '10px 12px' : '12px 16px', // Increased padding
              minHeight: '20px', // Added minimum height for input
              transition: 'all 0.3s ease',
              '&:hover': {
                backgroundColor: mode === 'light' 
                  ? 'rgba(0,0,0,0.02)' 
                  : 'rgba(255,255,255,0.02)',
              },
              '&.Mui-focused': {
                backgroundColor: mode === 'light' 
                  ? 'rgba(0,0,0,0.05)' 
                  : 'rgba(255,255,255,0.05)',
              }
            },
          }}
        />

        {/* Action buttons */}
        <Box sx={{ display: 'flex', gap: 0.5, alignItems: 'flex-end' }}>
          <Tooltip title="Voice Input">
            <IconButton
              size="small"
              sx={{ 
                color: mode === 'light' ? '#666' : '#999',
                background: mode === 'light' 
                  ? 'rgba(0,0,0,0.03)' 
                  : 'rgba(255,255,255,0.05)',
                backdropFilter: 'blur(10px)',
                border: mode === 'light' 
                  ? '1px solid rgba(0,0,0,0.1)' 
                  : '1px solid rgba(255,255,255,0.1)',
                transition: 'all 0.3s ease',
                '&:hover': { 
                  color: mode === 'light' ? '#333' : '#fff', 
                  background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.3), rgba(118, 75, 162, 0.3))',
                  transform: 'translateY(-2px)',
                  boxShadow: '0 4px 12px rgba(102, 126, 234, 0.3)',
                },
              }}
            >
              <Mic />
            </IconButton>
          </Tooltip>
          
          <Tooltip title="Send Message">
            <IconButton
              onClick={handleSend}
              disabled={(!message.trim() && uploadedFiles.length === 0) || disabled}
              size={isMobile ? "small" : "medium"}
              sx={{
                background: (message.trim() || uploadedFiles.length > 0)
                  ? 'linear-gradient(135deg, #00d4aa 0%, #00b894 50%, #00a085 100%)' 
                  : mode === 'light' 
                    ? 'rgba(0,0,0,0.1)' 
                    : 'rgba(255,255,255,0.1)',
                color: 'white',
                border: '1px solid rgba(255,255,255,0.2)',
                backdropFilter: 'blur(10px)',
                transition: 'all 0.3s ease',
                width: isMobile ? 32 : 40,
                height: isMobile ? 32 : 40,
                '&:hover': {
                  background: (message.trim() || uploadedFiles.length > 0)
                    ? 'linear-gradient(135deg, #00e6c0 0%, #00d4aa 50%, #00b894 100%)' 
                    : 'rgba(255,255,255,0.15)',
                  transform: 'translateY(-2px) scale(1.05)',
                  boxShadow: (message.trim() || uploadedFiles.length > 0)
                    ? '0 6px 20px rgba(0, 212, 170, 0.4)' 
                    : '0 4px 12px rgba(255,255,255,0.2)',
                },
                '&.Mui-disabled': {
                  background: 'rgba(255,255,255,0.05)',
                  color: '#666',
                  border: '1px solid rgba(255,255,255,0.1)',
                },
              }}
            >
              <Send sx={{ fontSize: isMobile ? '1rem' : '1.25rem' }} />
            </IconButton>
          </Tooltip>
        </Box>
      </Paper>
      </Box>
    </Box>
  );
}
