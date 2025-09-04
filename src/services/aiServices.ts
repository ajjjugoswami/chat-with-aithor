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
    let actualModel = "gpt-3.5-turbo";
    if (modelId.includes("gpt-4")) {
      actualModel = "gpt-4o-mini"; // Free tier model
    } else if (modelId.includes("gpt-3.5")) {
      actualModel = "gpt-3.5-turbo";
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

    // Use gemini-1.5-flash for free tier
    const modelName = "gemini-1.5-flash";

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
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-3-sonnet-20240229",
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
  } else {
    return { success: false, error: `Unsupported AI model: ${modelId}` };
  }
}
