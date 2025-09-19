import {
  Box,
  Typography,
  IconButton,
  Avatar,
  useMediaQuery,
} from "@mui/material";
import { ContentCopy, Check, Download } from "@mui/icons-material";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import rehypeRaw from "rehype-raw";
import { useState } from "react";
import "highlight.js/styles/vs2015.css"; // Dark theme for code highlighting
import "./message-styles.css"; // Custom message styles
import { useTheme } from "../../hooks/useTheme";
import { useAuth } from "../../hooks/useAuth";
import TypewriterMessage from "./TypewriterMessage";

interface FormattedMessageProps {
  content: string;
  isUser?: boolean;
  modelColor?: string;
  timestamp?: Date;
  isTyping?: boolean;
  enableTypewriter?: boolean;
  isNewMessage?: boolean; // Add this prop to control animation
  onTypewriterComplete?: () => void; // Callback when typewriter completes
  images?: Array<{ mimeType: string; data: string }>; // Base64 encoded images
  imageLinks?: string[]; // Store image URLs/links for generated images
}

export default function FormattedMessage({
  content,
  isUser = false,
  modelColor,
  timestamp,
  isTyping = false,
  enableTypewriter = false,
  isNewMessage = false,
  onTypewriterComplete,
  images,
  imageLinks,
}: FormattedMessageProps) {
  const { mode } = useTheme();
  const { user } = useAuth();
  const isMobile = useMediaQuery("(max-width: 640px)");
  const [copiedBlocks, setCopiedBlocks] = useState<Set<number>>(new Set());
  const [messageCopied, setMessageCopied] = useState(false);

  // Clean up malformed footnote/citation references
  const cleanContent = (text: string) => {
    // Remove patterns like [2][3], [1][2][3], etc.
    return text.replace(/\[\d+\](?:\s*\[\d+\])*/g, "").trim();
  };

  const processedContent = cleanContent(content);
  const handleDownloadImage = (
    imageData: string,
    mimeType: string,
    index: number
  ) => {
    // Create a blob from the base64 data
    const byteCharacters = atob(imageData);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], { type: mimeType });

    // Create download link
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;

    // Generate filename based on timestamp and index
    const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, "-");
    const extension = mimeType.split("/")[1] || "png";
    link.download = `Aithor-generated-image-${timestamp}-${
      index + 1
    }.${extension}`;

    // Trigger download
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    // Clean up
    URL.revokeObjectURL(url);
  };

  const handleCopyCode = async (code: string, blockIndex: number) => {
    try {
      // Ensure we copy the exact text as displayed
      const textToCopy = code.trim();
      await navigator.clipboard.writeText(textToCopy);
      setCopiedBlocks((prev) => new Set(prev).add(blockIndex));
      setTimeout(() => {
        setCopiedBlocks((prev) => {
          const newSet = new Set(prev);
          newSet.delete(blockIndex);
          return newSet;
        });
      }, 2000);
    } catch (err) {
      console.error("Failed to copy code:", err);
    }
  };

  const handleCopyMessage = async () => {
    try {
      await navigator.clipboard.writeText(processedContent);
      setMessageCopied(true);
      setTimeout(() => setMessageCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy message:", err);
    }
  };

  if (isUser) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "flex-end",
          mb: isMobile ? 1 : 1.5, // Reduced spacing
          alignItems: "flex-start",
          gap: isMobile ? 0.75 : 1, // Reduced gap
        }}
      >
        <Box
          sx={{
            maxWidth: "80%", // Increased width
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-end",
          }}
        >
          {/* User question label */}
          <Typography
            variant="caption"
            sx={{
              color: mode === "light" ? "#666" : "#888",
              fontSize: isMobile ? "10px" : "11px", // Smaller label
              mb: 0.25, // Reduced margin
              fontWeight: 500,
              display: "flex",
              alignItems: "center",
              gap: 0.5,
            }}
          >
            You
          </Typography>

          {/* Message bubble */}
          <Box
            sx={{
              p: isMobile ? 1.25 : 1.5, // Reduced padding
              borderRadius: "16px 16px 4px 16px", // Smaller radius
              background:
                mode === "light"
                  ? "#1976d2" // Blue color for light mode
                  : "#007aff", // Blue color for dark mode
              color: "white", // White text on blue background
              wordBreak: "break-word",
              fontSize: isMobile ? "13px" : "14px",
              lineHeight: 1.4, // Tighter line spacing
              position: "relative",
              boxShadow:
                mode === "light"
                  ? "0 2px 8px rgba(25, 118, 210, 0.2)" // Blue shadow for light mode
                  : "0 2px 8px rgba(0, 122, 255, 0.3)", // Blue shadow for dark mode
              border:
                mode === "light"
                  ? "1px solid rgba(25, 118, 210, 0.3)"
                  : "1px solid rgba(0, 122, 255, 0.3)",
            }}
          >
            <Typography
              variant="body2"
              sx={{
                whiteSpace: "pre-wrap",
                fontWeight: 400,
              }}
            >
              {processedContent}
            </Typography>
            {timestamp && (
              <Typography
                variant="caption"
                sx={{
                  fontSize: "10px",
                  opacity: 0.6,
                  display: "block",
                  textAlign: "right",
                  mt: 0.5,
                  pt: 0.25,
                }}
              >
                {timestamp.toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </Typography>
            )}
          </Box>
        </Box>

        {/* User avatar */}
        <Avatar
          sx={{
            width: isMobile ? 28 : 32, // Smaller avatar
            height: isMobile ? 28 : 32,
            bgcolor: mode === "light" ? "#1976d2" : "#007aff", // Matching blue colors
            color: "white",
            fontSize: isMobile ? "14px" : "16px",
            mt: 0.25,
            boxShadow: "0 2px 6px rgba(25, 118, 210, 0.3)", // Blue shadow
          }}
          src={user?.picture || "https://ui-avatars.com/api/?name=User&background=1976d2&color=fff&size=32"}
          alt={user?.name || "User Avatar"}
        />
      </Box>
    );
  }

  // Typing indicator
  if (isTyping) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "flex-start",
          mb: isMobile ? 1.5 : 2,
          alignItems: "flex-start",
          gap: isMobile ? 1 : 1.5,
        }}
      >
        {/* AIthor Logo */}
        <Box
          sx={{
            width: isMobile ? 28 : 36,
            height: isMobile ? 28 : 36,
            borderRadius: "50%",
            bgcolor: "rgba(255, 255, 255, 0.1)",
            border: "2px solid rgba(59, 130, 246, 0.3)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
            mt: 0.5,
            animation: "breathe 2s ease-in-out infinite",
            "@keyframes breathe": {
              "0%, 100%": {
                transform: "scale(1)",
                boxShadow: "0 0 10px rgba(59, 130, 246, 0.2)",
              },
              "50%": {
                transform: "scale(1.1)",
                boxShadow: "0 0 20px rgba(59, 130, 246, 0.4)",
              },
            },
          }}
        >
          <Box
            component="img"
            src="/favicon.png"
            alt="AIthor Logo"
            sx={{
              width: isMobile ? 20 : 24,
              height: isMobile ? 20 : 24,
              animation: "rotate 2s linear infinite",
              "@keyframes rotate": {
                "0%": { transform: "rotate(0deg)" },
                "100%": { transform: "rotate(360deg)" },
              },
            }}
          />
        </Box>

        <Box
          sx={{
            p: isMobile ? 1.5 : 2,
            borderRadius: "18px 18px 18px 4px",
            bgcolor: mode === "light" ? "#f5f5f5" : "#2a2a2a",
            color: mode === "light" ? "#333" : "white",
            border: `1px solid ${modelColor}30`,
            display: "flex",
            alignItems: "center",
            gap: 1,
            boxShadow: `0 2px 8px ${modelColor}15`,
          }}
        >
          <Box
            sx={{
              display: "flex",
              gap: 0.5,
              "& .typing-dot": {
                width: 6,
                height: 6,
                borderRadius: "50%",
                backgroundColor: modelColor || "#666",
                animation: "typing 1.4s infinite ease-in-out",
                "&:nth-of-type(1)": { animationDelay: "0s" },
                "&:nth-of-type(2)": { animationDelay: "0.2s" },
                "&:nth-of-type(3)": { animationDelay: "0.4s" },
              },
              "@keyframes typing": {
                "0%, 60%, 100%": { opacity: 0.3, transform: "scale(0.8)" },
                "30%": { opacity: 1, transform: "scale(1)" },
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
        display: "flex",
        justifyContent: "flex-start",
        mb: isMobile ? 1.5 : 2,
        alignItems: "flex-start",
        gap: isMobile ? 1 : 1.5,
      }}
    >
      {/* AI Model indicator */}
      <Box
        sx={{
          width: isMobile ? 28 : 36,
          height: isMobile ? 28 : 36,
          borderRadius: "50%",
          bgcolor: "rgba(255, 255, 255, 0.1)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: isMobile ? "12px" : "16px",
          fontWeight: "bold",
          color: "white",
          flexShrink: 0,
          mt: 0.5,
          boxShadow: mode === "light"
            ? "0 2px 8px rgba(0, 0, 0, 0.15)"
            : "0 2px 8px rgba(255, 255, 255, 0.1)",
        }}
      >
        <Box
          component="img"
          src="/favicon.png"
          alt="AIthor Logo"
          sx={{
            width: isMobile ? 20 : 24,
            height: isMobile ? 20 : 24,
          }}
        />
      </Box>

      <Box
        sx={{
          maxWidth: isMobile ? "calc(100% - 40px)" : "calc(100% - 60px)",
          borderRadius: "18px 18px 18px 4px",
          bgcolor: mode === "light" ? "#f8f9fa" : "#2a2a2a",
          color: mode === "light" ? "#333" : "white",
          wordBreak: "break-word",
          fontSize: isMobile ? "13px" : "14px",
          lineHeight: 1.5,
          border: `1px solid ${modelColor}30`,
          overflow: "hidden",
          position: "relative",
          boxShadow: `0 2px 8px ${modelColor}15`,
          "&:hover .message-actions": {
            opacity: 1,
          },
          "& .markdown-content": {
            p: isMobile ? 1.5 : 2,
          },
          "& pre": {
            position: "relative",
            margin: isMobile ? "12px 0" : "16px 0",
            borderRadius: "8px",
            backgroundColor:
              mode === "light" ? "#f8f9fa !important" : "#1e1e1e !important",
            border: mode === "light" ? "1px solid #e9ecef" : "1px solid #333",
            overflowX: "auto", // Enable horizontal scrolling for wide code
            overflowY: "hidden", // Prevent vertical scrolling
            "& code": {
              fontSize: isMobile ? "12px" : "13px",
              lineHeight: 1.4,
              display: "block",
              padding: isMobile ? "8px" : "12px",
              background: "transparent !important",
              color: mode === "light" ? "#495057" : "#f8f8f2",
              whiteSpace: "pre", // Preserve whitespace and line breaks
              minWidth: "fit-content", // Ensure code doesn't shrink below content width
            },
          },
          "& code": {
            backgroundColor: mode === "light" ? "#e9ecef" : "#333",
            padding: "2px 6px",
            borderRadius: "4px",
            fontSize: "13px",
            fontFamily: '"Fira Code", "Consolas", "Monaco", monospace',
            color: mode === "light" ? "#495057" : "#f8f8f2",
          },
          "& pre code": {
            backgroundColor: "transparent",
            padding: 0,
            borderRadius: 0,
          },
          "& p": {
            margin: "0 0 12px 0",
            lineHeight: 1.6,
            fontSize: "14px",
            "&:last-child": {
              marginBottom: 0,
            },
          },
          "& h1, & h2, & h3, & h4, & h5, & h6": {
            color:
              mode === "light" ? modelColor || "#1976d2" : modelColor || "#fff",
            marginTop: "20px",
            marginBottom: "12px",
            fontWeight: "bold",
            lineHeight: 1.3,
            "&:first-of-type": {
              marginTop: 0,
            },
          },
          "& h1": {
            fontSize: "24px",
            borderBottom:
              mode === "light"
                ? `2px solid ${modelColor || "#1976d2"}`
                : `2px solid ${modelColor || "#666"}`,
            paddingBottom: "8px",
          },
          "& h2": {
            fontSize: "20px",
            borderBottom:
              mode === "light"
                ? `1px solid ${modelColor || "#1976d2"}`
                : `1px solid ${modelColor || "#666"}`,
            paddingBottom: "6px",
          },
          "& h3": {
            fontSize: "18px",
          },
          "& h4": {
            fontSize: "16px",
          },
          "& h5, & h6": {
            fontSize: "14px",
          },
          "& ul, & ol": {
            paddingLeft: "24px",
            margin: "12px 0",
            "& li": {
              marginBottom: "6px",
              lineHeight: 1.5,
            },
            "& ul, & ol": {
              margin: "6px 0",
            },
          },
          "& blockquote": {
            borderLeft:
              mode === "light"
                ? `4px solid ${modelColor || "#1976d2"}`
                : `4px solid ${modelColor || "#666"}`,
            paddingLeft: "16px",
            margin: "16px 0",
            fontStyle: "italic",
            opacity: 0.9,
            backgroundColor:
              mode === "light"
                ? "rgba(25, 118, 210, 0.05)"
                : "rgba(255, 255, 255, 0.05)",
            padding: "12px 16px",
            borderRadius: "0 8px 8px 0",
          },
          "& table": {
            borderCollapse: "collapse",
            width: "100%",
            margin: "16px 0",
            border: mode === "light" ? "1px solid #ddd" : "1px solid #444",
            borderRadius: "8px",
            overflow: "hidden",
          },
          "& th, & td": {
            border: mode === "light" ? "1px solid #ddd" : "1px solid #444",
            padding: "10px 14px",
            textAlign: "left",
          },
          "& th": {
            backgroundColor: mode === "light" ? "#f5f5f5" : "#333",
            fontWeight: "bold",
            color:
              mode === "light" ? modelColor || "#1976d2" : modelColor || "#fff",
          },
          "& tr:nth-of-type(even)": {
            backgroundColor:
              mode === "light"
                ? "rgba(25, 118, 210, 0.02)"
                : "rgba(255, 255, 255, 0.02)",
          },
          "& a": {
            color:
              mode === "light"
                ? modelColor || "#1976d2"
                : modelColor || "#4fc3f7",
            textDecoration: "none",
            "&:hover": {
              textDecoration: "underline",
            },
          },
          "& hr": {
            border: "none",
            borderTop:
              mode === "light"
                ? `1px solid ${modelColor || "#ddd"}`
                : `1px solid ${modelColor || "#666"}`,
            margin: "20px 0",
            opacity: 0.5,
          },
          "& strong": {
            fontWeight: "bold",
            color: mode === "light" ? "#333" : "#fff",
          },
          "& em": {
            fontStyle: "italic",
            color: mode === "light" ? "#666" : "#ddd",
          },
        }}
      >
        {/* Message Actions */}
        <Box
          className="message-actions"
          sx={{
            position: "absolute",
            top: 8,
            right: 8,
            opacity: 0,
            transition: "opacity 0.2s ease",
            display: "flex",
            gap: 0.5,
            zIndex: 10,
          }}
        >
          <IconButton
            size="small"
            onClick={handleCopyMessage}
            sx={{
              bgcolor:
                mode === "light"
                  ? "rgba(255, 255, 255, 0.9)"
                  : "rgba(0, 0, 0, 0.7)",
              color: messageCopied
                ? "#4caf50"
                : mode === "light"
                ? "#666"
                : "#888",
              boxShadow:
                mode === "light" ? "0 2px 4px rgba(0,0,0,0.1)" : "none",
              border: mode === "light" ? "1px solid rgba(0,0,0,0.1)" : "none",
              "&:hover": {
                color: messageCopied
                  ? "#4caf50"
                  : mode === "light"
                  ? "#333"
                  : "white",
                bgcolor:
                  mode === "light"
                    ? "rgba(255, 255, 255, 1)"
                    : "rgba(0, 0, 0, 0.9)",
                transform: "scale(1.05)",
              },
              p: 0.5,
            }}
          >
            {messageCopied ? (
              <Check sx={{ fontSize: "16px" }} />
            ) : (
              <ContentCopy sx={{ fontSize: "16px" }} />
            )}
          </IconButton>
        </Box>
        <Box className="markdown-content">
          {enableTypewriter ? (
            <TypewriterMessage
              content={processedContent}
              speed={25}
              isUser={false}
              modelColor={modelColor}
              shouldAnimate={isNewMessage}
              onComplete={onTypewriterComplete}
            />
          ) : (
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              rehypePlugins={[rehypeHighlight, rehypeRaw]}
              components={{
                pre: ({ children, ...props }) => {
                  return (
                    <Box sx={{ position: "relative" }}>
                      <pre {...props} style={{ padding: "12px" }}>
                        {children}
                      </pre>
                    </Box>
                  );
                },
                code: ({ children, className, ...props }) => {
                  const isInline = !className;

                  // Extract raw code content properly from ReactMarkdown children
                  let codeContent = "";
                  if (typeof children === "string") {
                    codeContent = children;
                  } else if (Array.isArray(children)) {
                    codeContent = children
                      .map((child) =>
                        typeof child === "string"
                          ? child
                          : child &&
                            typeof child === "object" &&
                            "props" in child &&
                            child.props.children
                          ? String(child.props.children)
                          : String(child)
                      )
                      .join("");
                  } else {
                    codeContent = String(children);
                  }

                  const blockIndex = Math.random();

                  if (isInline) {
                    return <code {...props}>{children}</code>;
                  }

                  return (
                    <Box sx={{ position: "relative" }}>
                      {/* Copy button positioned outside scrolling area */}
                      <IconButton
                        size="small"
                        onClick={() => handleCopyCode(codeContent, blockIndex)}
                        sx={{
                          position: "absolute",
                          top: 8,
                          right: 8,
                          color: mode === "light" ? "#666" : "#888",
                          bgcolor:
                            mode === "light"
                              ? "rgba(255, 255, 255, 0.9)"
                              : "rgba(0, 0, 0, 0.6)",
                          "&:hover": {
                            color: mode === "light" ? "#333" : "white",
                            bgcolor:
                              mode === "light"
                                ? "rgba(255, 255, 255, 1)"
                                : "rgba(0, 0, 0, 0.8)",
                          },
                          p: 0.5,
                          zIndex: 2,
                          boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
                        }}
                      >
                        {copiedBlocks.has(blockIndex) ? (
                          <Check sx={{ fontSize: "14px" }} />
                        ) : (
                          <ContentCopy sx={{ fontSize: "14px" }} />
                        )}
                      </IconButton>
                      {/* Code content in scrollable container */}
                      <Box
                        sx={{
                          overflowX: "auto",
                          "& pre": {
                            margin: 0,
                            padding: "12px",
                            backgroundColor: "transparent",
                          },
                          "& code": {
                            display: "block",
                            whiteSpace: "pre",
                            minWidth: "fit-content",
                          },
                        }}
                      >
                        <code {...props}>{children}</code>
                      </Box>
                    </Box>
                  );
                },
              }}
            >
              {processedContent}
            </ReactMarkdown>
          )}

          {/* Render images if present */}
          {((images && images.length > 0) ||
            (imageLinks && imageLinks.length > 0)) && (
            <Box
              sx={{ mt: 2, display: "flex", flexDirection: "column", gap: 1 }}
            >
              {/* Render base64 images (for new messages) */}
              {images &&
                images.map((image, index) => (
                  <Box
                    key={`base64-${index}`}
                    sx={{
                      maxWidth: "100%",
                      borderRadius: 1,
                      overflow: "hidden",
                      position: "relative",
                    }}
                  >
                    <img
                      src={`data:${image.mimeType};base64,${image.data}`}
                      alt={`Generated image ${index + 1}`}
                      style={{
                        maxWidth: "100%",
                        height: "auto",
                        borderRadius: "8px",
                        boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                      }}
                    />
                    {/* Download button overlay */}
                    <IconButton
                      onClick={() =>
                        handleDownloadImage(image.data, image.mimeType, index)
                      }
                      sx={{
                        position: "absolute",
                        top: 8,
                        right: 8,
                        backgroundColor: "rgba(0, 0, 0, 0.6)",
                        color: "white",
                        "&:hover": {
                          backgroundColor: "rgba(0, 0, 0, 0.8)",
                        },
                        width: 32,
                        height: 32,
                      }}
                      size="small"
                    >
                      <Download fontSize="small" />
                    </IconButton>
                  </Box>
                ))}

              {/* Render image links (for loaded messages) - only if no base64 images */}
              {!images &&
                imageLinks &&
                imageLinks.map((imageUrl, index) => (
                  <Box
                    key={`link-${index}`}
                    sx={{
                      maxWidth: "100%",
                      borderRadius: 1,
                      overflow: "hidden",
                      position: "relative",
                    }}
                  >
                    <img
                      src={imageUrl}
                      alt={`Generated image ${index + 1}`}
                      style={{
                        maxWidth: "100%",
                        height: "auto",
                        borderRadius: "8px",
                        boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                      }}
                      onError={(e) => {
                        // Handle broken image links
                        const target = e.target as HTMLImageElement;
                        target.style.display = "none";
                        const parent = target.parentElement;
                        if (parent) {
                          parent.innerHTML =
                            '<div style="padding: 16px; background: #f5f5f5; border-radius: 8px; color: #666;">Image not available</div>';
                        }
                      }}
                    />
                    {/* Download link button overlay */}
                    <IconButton
                      component="a"
                      href={imageUrl}
                      download={`Aithor-generated-image-${new Date()
                        .toISOString()
                        .slice(0, 19)
                        .replace(/:/g, "-")}-${index + 1}.png`}
                      target="_blank"
                      rel="noopener noreferrer"
                      sx={{
                        position: "absolute",
                        top: 8,
                        right: 8,
                        backgroundColor: "rgba(0, 0, 0, 0.6)",
                        color: "white",
                        "&:hover": {
                          backgroundColor: "rgba(0, 0, 0, 0.8)",
                        },
                        width: 32,
                        height: 32,
                      }}
                      size="small"
                    >
                      <Download fontSize="small" />
                    </IconButton>
                  </Box>
                ))}
            </Box>
          )}

          {timestamp && (
            <Typography
              variant="caption"
              sx={{
                fontSize: "11px",
                opacity: 0.5,
                display: "block",
                textAlign: "right",
                mt: 1,
                pt: 1,
                borderTop: "1px solid rgba(255, 255, 255, 0.1)",
              }}
            >
              {timestamp.toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </Typography>
          )}
        </Box>
      </Box>
    </Box>
  );
}
