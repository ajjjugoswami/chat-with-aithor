// AI API Service Integration
import { getAPIKeyForModel } from "../utils/apiKeys";

export interface ChatMessage {
  role: "user" | "assistant" | "system";
  content: string;
}

export interface AIResponse {
  success: boolean;
  message?: string;
  error?: string;
}

// OpenAI/ChatGPT API Integration
export async function sendToChatGPT(
  messages: ChatMessage[],
  modelId: string
): Promise<AIResponse> {
  const apiKey = getAPIKeyForModel(modelId);

  if (!apiKey) {
    return { success: false, error: "API key not found" };
  }

  try {
    // Map model IDs to actual OpenAI model names
    let actualModel = "gpt-4o-mini"; // Default to free tier

    switch (modelId) {
      case "gpt-4o-mini":
        actualModel = "gpt-4o-mini";
        break;
      case "gpt-4":
        actualModel = "gpt-4";
        break;
      case "gpt-3.5-turbo":
        actualModel = "gpt-3.5-turbo";
        break;
      default:
        // Fallback for backward compatibility
        if (modelId.includes("gpt-4")) {
          actualModel = "gpt-4o-mini"; // Free tier model
        } else if (modelId.includes("gpt-3.5")) {
          actualModel = "gpt-3.5-turbo";
        }
        break;
    }

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: actualModel,
        messages: messages,
        max_tokens: 1000,
        temperature: 0.7,
      }),
    });

    console.log("OpenAI API Request:", {
      model: actualModel,
      messagesCount: messages.length,
      status: response.status,
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("OpenAI API Error:", errorData);
      return {
        success: false,
        error: `OpenAI Error: ${
          errorData.error?.message ||
          `HTTP ${response.status}: ${response.statusText}`
        }`,
      };
    }

    const data = await response.json();
    console.log("OpenAI API Response:", data);
    const assistantMessage = data.choices?.[0]?.message?.content;

    if (!assistantMessage) {
      return { success: false, error: "No response from ChatGPT" };
    }

    return { success: true, message: assistantMessage };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred",
    };
  }
}

// Google Gemini API Integration
export async function sendToGemini(
  messages: ChatMessage[],
  modelId: string
): Promise<AIResponse> {
  const apiKey = getAPIKeyForModel(modelId);

  if (!apiKey) {
    return { success: false, error: "API key not found" };
  }

  try {
    // Get only the latest user message for Gemini
    const latestMessage = messages[messages.length - 1];

    // Map model IDs to actual Gemini model names
    let modelName = "gemini-1.5-flash"; // Default to free tier

    switch (modelId) {
      case "gemini-2.5-lite":
        modelName = "gemini-1.5-flash"; // Map to available free model
        break;
      case "gemini-2.5-flash":
        modelName = "gemini-1.5-flash";
        break;
      case "gemini-1.5-pro":
        modelName = "gemini-1.5-pro";
        break;
      case "gemini-2.5-pro":
        modelName = "gemini-2.5-pro";
        break;
      default:
        // Fallback for backward compatibility
        modelName = "gemini-1.5-flash";
        break;
    }

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: latestMessage.content,
                },
              ],
            },
          ],
          generationConfig: {
            temperature: 0.7,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 1024,
          },
          safetySettings: [
            {
              category: "HARM_CATEGORY_HARASSMENT",
              threshold: "BLOCK_MEDIUM_AND_ABOVE",
            },
            {
              category: "HARM_CATEGORY_HATE_SPEECH",
              threshold: "BLOCK_MEDIUM_AND_ABOVE",
            },
            {
              category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
              threshold: "BLOCK_MEDIUM_AND_ABOVE",
            },
            {
              category: "HARM_CATEGORY_DANGEROUS_CONTENT",
              threshold: "BLOCK_MEDIUM_AND_ABOVE",
            },
          ],
        }),
      }
    );

    console.log("Gemini API Response Status:", response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Gemini API Error:", errorText);
      return {
        success: false,
        error: `HTTP ${response.status}: ${errorText}`,
      };
    }

    const data = await response.json();
    console.log("Gemini API Response:", data);

    const assistantMessage = data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!assistantMessage) {
      return { success: false, error: "No response from Gemini" };
    }

    return { success: true, message: assistantMessage };
  } catch (error) {
    console.error("Gemini API Error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred",
    };
  }
}

// Claude API Integration (Anthropic)
export async function sendToClaude(
  messages: ChatMessage[],
  modelId: string
): Promise<AIResponse> {
  const apiKey = getAPIKeyForModel(modelId);

  if (!apiKey) {
    return { success: false, error: "API key not found" };
  }

  try {
    // Map model IDs to actual Claude model names
    let actualModel = "claude-3-haiku-20240307"; // Default to free tier

    switch (modelId) {
      case "claude-3-haiku":
        actualModel = "claude-3-haiku-20240307";
        break;
      case "claude-3-sonnet":
        actualModel = "claude-3-sonnet-20240229";
        break;
      case "claude-3-opus":
        actualModel = "claude-3-opus-20240229";
        break;
      default:
        // Fallback for backward compatibility
        actualModel = "claude-3-haiku-20240307";
        break;
    }

    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
        "anthropic-dangerous-direct-browser-access": "true",
      },
      body: JSON.stringify({
        model: actualModel,
        max_tokens: 1000,
        messages: messages.filter((msg) => msg.role !== "system"),
        system: messages.find((msg) => msg.role === "system")?.content,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      return {
        success: false,
        error:
          errorData.error?.message ||
          `HTTP ${response.status}: ${response.statusText}`,
      };
    }

    const data = await response.json();
    const assistantMessage = data.content?.[0]?.text;

    if (!assistantMessage) {
      return { success: false, error: "No response from Claude" };
    }

    return { success: true, message: assistantMessage };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred",
    };
  }
}

// Deepseek API Integration
export async function sendToDeepseek(
  messages: ChatMessage[],
  modelId: string
): Promise<AIResponse> {
  const apiKey = getAPIKeyForModel(modelId);

  if (!apiKey) {
    return { success: false, error: "API key not found" };
  }

  try {
    // Map model IDs to actual DeepSeek model names
    let actualModel = "deepseek-chat"; // Default to free tier

    switch (modelId) {
      case "deepseek-chat":
        actualModel = "deepseek-chat";
        break;
      case "deepseek-coder":
        actualModel = "deepseek-coder";
        break;
      default:
        // Fallback for backward compatibility
        actualModel = "deepseek-chat";
        break;
    }

    const response = await fetch(
      "https://api.deepseek.com/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: actualModel,
          messages: messages,
          max_tokens: 1000,
          temperature: 0.7,
          stream: false,
        }),
      }
    );

    console.log("Deepseek API Request:", {
      model: actualModel,
      messagesCount: messages.length,
      status: response.status,
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Deepseek API Error:", errorData);
      return {
        success: false,
        error: `Deepseek Error: ${
          errorData.error?.message ||
          `HTTP ${response.status}: ${response.statusText}`
        }`,
      };
    }

    const data = await response.json();
    console.log("Deepseek API Response:", data);
    const assistantMessage = data.choices?.[0]?.message?.content;

    if (!assistantMessage) {
      return { success: false, error: "No response from Deepseek" };
    }

    return { success: true, message: assistantMessage };
  } catch (error) {
    console.error("Deepseek API Error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred",
    };
  }
}

// Perplexity API Integration
export async function sendToPerplexity(
  messages: ChatMessage[],
  modelId: string
): Promise<AIResponse> {
  const apiKey = getAPIKeyForModel(modelId);

  if (!apiKey) {
    return { success: false, error: "API key not found" };
  }

  try {
    // Format messages to ensure proper alternating pattern for Perplexity
    const formattedMessages: ChatMessage[] = [];

    // Add system messages first (if any)
    const systemMessages = messages.filter((msg) => msg.role === "system");
    formattedMessages.push(...systemMessages);

    // Process user and assistant messages to ensure alternating pattern
    const conversationMessages = messages.filter(
      (msg) => msg.role !== "system"
    );
    let lastRole: string | null = null;

    for (const message of conversationMessages) {
      // Skip consecutive messages from the same role to maintain alternating pattern
      if (message.role !== lastRole) {
        formattedMessages.push(message);
        lastRole = message.role;
      } else if (message.role === "user") {
        // If we have consecutive user messages, combine them
        const lastMessage = formattedMessages[formattedMessages.length - 1];
        if (lastMessage && lastMessage.role === "user") {
          lastMessage.content += "\n\n" + message.content;
        } else {
          formattedMessages.push(message);
        }
      }
    }

    // Ensure the conversation ends with a user message
    const lastMessage = formattedMessages[formattedMessages.length - 1];
    if (lastMessage && lastMessage.role === "assistant") {
      // Remove the last assistant message if it's the final message
      formattedMessages.pop();
    }

    // Map model IDs to actual Perplexity model names
    let actualModel = "sonar"; // Default to free tier

    switch (modelId) {
      case "perplexity-sonar":
        actualModel = "sonar";
        break;
      case "perplexity-sonar-pro":
        actualModel = "sonar-pro";
        break;
      default:
        // Fallback for backward compatibility
        actualModel = "sonar";
        break;
    }

    const response = await fetch("https://api.perplexity.ai/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: actualModel,
        messages: formattedMessages,
        max_tokens: 1000,
        temperature: 0.7,
        stream: false,
      }),
    });

    console.log("Perplexity API Request:", {
      model: actualModel,
      messagesCount: messages.length,
      status: response.status,
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Perplexity API Error:", errorData);
      return {
        success: false,
        error: `Perplexity Error: ${
          errorData.error?.message ||
          `HTTP ${response.status}: ${response.statusText}`
        }`,
      };
    }

    const data = await response.json();
    console.log("Perplexity API Response:", data);
    const assistantMessage = data.choices?.[0]?.message?.content;

    if (!assistantMessage) {
      return { success: false, error: "No response from Perplexity" };
    }

    return { success: true, message: assistantMessage };
  } catch (error) {
    console.error("Perplexity API Error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred",
    };
  }
}

// Main function to route messages to appropriate AI service
export async function sendToAI(
  messages: ChatMessage[],
  modelId: string
): Promise<AIResponse> {
  console.log("Routing message to model:", modelId);

  // Route based on model ID patterns
  if (modelId.includes("gpt") || modelId.includes("GPT")) {
    return sendToChatGPT(messages, modelId);
  } else if (modelId.includes("gemini") || modelId.includes("Gemini")) {
    return sendToGemini(messages, modelId);
  } else if (modelId.includes("claude") || modelId.includes("Claude")) {
    return sendToClaude(messages, modelId);
  } else if (modelId.includes("deepseek") || modelId.includes("Deepseek")) {
    return sendToDeepseek(messages, modelId);
  } else if (modelId.includes("perplexity") || modelId.includes("sonar")) {
    return sendToPerplexity(messages, modelId);
  } else {
    return { success: false, error: `Unsupported AI model: ${modelId}` };
  }
}
