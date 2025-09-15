// AI API Service Integration
import { getAPIKeyForModel } from "../utils/enhancedApiKeys";

// Preference helpers
const getProviderFromModelId = (modelId: string): 'openai' | 'gemini' | null => {
	const id = modelId.toLowerCase();
	if (id.includes('gpt') || id.includes('chatgpt') || id.startsWith('oai-')) return 'openai';
	if (id.includes('gemini')) return 'gemini';
	return null;
};

const getUseOwnKeyPreference = (modelId: string): boolean => {
	try {
		const provider = getProviderFromModelId(modelId);
		if (!provider) return true; // default to own key for non-free providers
		const raw = localStorage.getItem(`ai_use_own_key_${provider}`);
		if (raw === null) {
			// Default: use free quota for OpenAI/Gemini (false) if no preference set
			return false;
		}
		return raw === 'true';
	} catch {
		return false;
	}
};

export interface ChatMessage {
	role: "user" | "assistant" | "system";
	content: string;
}

export interface AIResponse {
	success: boolean;
	message?: string;
	error?: string;
	images?: Array<{ mimeType: string; data: string }>;
	usage?: {
		provider: string;
		usedCalls: number;
		maxFreeCalls: number;
		remainingCalls: number;
	};
	quotaExceeded?: boolean;
	requiresUserKey?: boolean;
	provider?: string;
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
		// Support only gemini-2.0-flash and gemini-2.5-flash
		let modelName = "gemini-2.0-flash"; // Default

		switch (modelId) {
			case "gemini-2.0-flash":
				modelName = "gemini-2.0-flash";
				break;
			case "gemini-2.0-flash-exp":
				modelName = "gemini-2.0-flash-exp";
				break;
			default:
				modelName = "gemini-2.0-flash";
				break;
		}

		// Decide initial response modalities: only request images for models known to support them
		const initialModalities =
			modelName === "gemini-2.0-flash-exp" ? ["text", "image"] : ["text"];

		const safetySettings = [
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
		];

		const makePayload = (modalities: string[]) => ({
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
				responseModalities: modalities,
			},
			safetySettings,
		});

		const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${apiKey}`;

		// Try initial request
		let response = await fetch(endpoint, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(makePayload(initialModalities)),
		});

		console.log("Gemini API Response Status:", response.status);

		// If model rejects modalities (e.g., doesn't support image), retry with text-only
		if (!response.ok) {
			const errorText = await response.text();
			console.error("Gemini API Error:", errorText);

			const modalityErrorPattern =
				/does not support the requested response modalities|only supports text|requested response modalities/i;
			if (
				initialModalities.includes("image") &&
				modalityErrorPattern.test(errorText)
			) {
				console.log("Gemini rejected image modality, retrying with text-only");
				response = await fetch(endpoint, {
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify(makePayload(["text"])),
				});

				console.log("Gemini retry Response Status:", response.status);
				if (!response.ok) {
					const retryError = await response.text();
					console.error("Gemini retry error:", retryError);
					return {
						success: false,
						error: `HTTP ${response.status}: ${retryError}`,
					};
				}
			} else {
				return {
					success: false,
					error: `HTTP ${response.status}: ${errorText}`,
				};
			}
		}

		const data = await response.json();
		console.log("Gemini API Response:", data);

		const candidate = data.candidates?.[0];
		if (!candidate || !candidate.content || !candidate.content.parts) {
			return { success: false, error: "No response from Gemini" };
		}

		let assistantMessage = "";
		const images: Array<{ mimeType: string; data: string }> = [];

		for (const part of candidate.content.parts) {
			if (part.text) {
				assistantMessage += part.text;
			} else if (
				part.inlineData &&
				part.inlineData.mimeType?.startsWith("image/")
			) {
				images.push({
					mimeType: part.inlineData.mimeType,
					data: part.inlineData.data,
				});
			}
		}

		if (!assistantMessage && images.length === 0) {
			return { success: false, error: "No valid response content from Gemini" };
		}

		// Return both text and images
		return {
			success: true,
			message: assistantMessage || "[Image generated]",
			images: images.length > 0 ? images : undefined,
		};
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

export interface AIResponse {
	success: boolean;
	message?: string;
	error?: string;
	images?: Array<{ mimeType: string; data: string }>;
	quotaExceeded?: boolean;
	requiresUserKey?: boolean;
	provider?: string;
}

// Main function to route messages to backend AI service
export async function sendToAI(
	messages: ChatMessage[],
	modelId: string
): Promise<AIResponse> {
	console.log("Sending message to backend AI service:", modelId);

	// Determine provider by modelId
	const lowerId = modelId.toLowerCase();
	const isOpenAI = lowerId.includes("gpt") || lowerId.includes("chatgpt") || lowerId.startsWith("oai-");
	const isGemini = lowerId.includes("gemini");
	const isClaude = lowerId.includes("claude");
	const isDeepseek = lowerId.includes("deepseek");
	const isPerplexity = lowerId.includes("perplexity") || lowerId.includes("sonar");

	// Preference: whether to use own key for OpenAI/Gemini
	const preferOwnKey = getUseOwnKeyPreference(modelId);

	// If user prefers own key and provided an API key, call provider directly
	const userApiKey = getAPIKeyForModel(modelId);
	const hasUserKey = !!(userApiKey && userApiKey.trim().length > 0);
	if (preferOwnKey && hasUserKey) {
		if (isOpenAI) return sendToChatGPT(messages, modelId);
		if (isGemini) return sendToGemini(messages, modelId);
	}
	// For other providers (Claude/Deepseek/Perplexity), still use direct calls when user key exists
	if (!isOpenAI && !isGemini && hasUserKey) {
		if (isClaude) return sendToClaude(messages, modelId);
		if (isDeepseek) return sendToDeepseek(messages, modelId);
		if (isPerplexity) return sendToPerplexity(messages, modelId);
	}
	// If own key is preferred but missing, request user key
	if (preferOwnKey && (isOpenAI || isGemini) && !hasUserKey) {
		return {
			success: false,
			requiresUserKey: true,
			provider: isOpenAI ? 'openai' : 'gemini',
			error: 'Please add your own API key for this provider.',
		};
	}

	try {
		// No user key preference or using free quota: Only OpenAI and Gemini support free quota via backend
		if (isOpenAI || isGemini) {
			const provider = isOpenAI ? 'openai' : 'gemini';

			// Client-side attempt limiter: stop calling backend after 10 attempts
			const attemptsKey = `ai_backend_attempts_${provider}`;
			const attemptsRaw = localStorage.getItem(attemptsKey);
			const attempts = attemptsRaw ? parseInt(attemptsRaw, 10) || 0 : 0;
			if (attempts >= 10) {
				return {
					success: false,
					error: 'Free quota exceeded. Add your own API key to continue.',
					quotaExceeded: true,
					provider,
				};
			}

			const token = localStorage.getItem('token');
			if (!token) {
				return { success: false, error: 'No authentication token found' };
			}

			// Increment attempts before calling backend to avoid extra calls past the limit
			localStorage.setItem(attemptsKey, String(attempts + 1));

			const response = await fetch('https://aithor-be.vercel.app/api/chat/send', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					'Authorization': `Bearer ${token}`,
				},
				body: JSON.stringify({
					messages,
					modelId,
				}),
			});

			const data = await response.json();

			if (response.status === 429 && data.quotaExceeded) {
				return {
					success: false,
					error: data.error || 'Free quota exceeded. Add your own API key to continue.',
					quotaExceeded: true,
					provider: data.provider || provider,
				};
			}

			if (response.status === 400 && data.requiresUserKey) {
				return {
					success: false,
					error: data.error || 'Please add your own API key for this provider.',
					requiresUserKey: true,
					provider: data.provider || provider,
				};
			}

			if (!response.ok) {
				return {
					success: false,
					error: data.error || `HTTP ${response.status}: ${response.statusText}`,
				};
			}

			return data;
		}

		// Other providers require user's own key
		const provider = isClaude
			? 'claude'
			: isDeepseek
				? 'deepseek'
				: isPerplexity
					? 'perplexity'
					: 'unknown';
		return {
			success: false,
			requiresUserKey: true,
			provider,
			error: 'Please add your own API key for this provider.',
		};
	} catch (error) {
		console.error('Backend AI service error:', error);
		return {
			success: false,
			error: error instanceof Error ? error.message : 'Unknown error occurred',
		};
	}
}
