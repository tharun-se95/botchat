import { ChatTogetherAI } from "@langchain/community/chat_models/togetherai";
import { HumanMessage, AIMessage } from "@langchain/core/messages";

export interface ChatMessage {
  sender: "user" | "bot";
  text: string;
}

const apiKey = process.env.TOGETHER_API_KEY;
const model = process.env.TOGETHER_MODEL || "meta-llama/Meta-Llama-3.1-8B-Instruct-Turbo";

if (!apiKey) {
  throw new Error("TOGETHER_API_KEY is not set in environment variables");
}

const createTogetherChatModel = (modelOverride?: string) => {
  return new ChatTogetherAI({
    apiKey,
    model: modelOverride || model,
    maxTokens: 1000,
    temperature: 0.7,
  });
};

const convertToLangChainMessages = (messages: ChatMessage[]) => {
  return messages.map((msg) => {
    if (msg.sender === "user") {
      return new HumanMessage(msg.text);
    } else {
      return new AIMessage(msg.text);
    }
  });
};

export async function getTogetherResponse(
  userMessage: string,
  conversationHistory: ChatMessage[] = [],
  modelOverride?: string
): Promise<string> {
  try {
    const togetherModel = createTogetherChatModel(modelOverride);
    const langChainMessages = convertToLangChainMessages(conversationHistory);
    langChainMessages.push(new HumanMessage(userMessage));
    const response = await togetherModel.invoke(langChainMessages);
    if (typeof response === 'string') return response;
    if (response && typeof response === 'object' && 'content' in response) return String((response as any).content);
    return '';
  } catch (error) {
    console.error("Error getting TogetherAI response:", error);
    if (error instanceof Error) {
      if (error.message.includes("API key")) {
        return "❌ **Configuration Error**: Please set your TogetherAI API key in the `.env.local` file. You can get one from https://platform.together.xyz/";
      }
    }
    return "❌ **Error**: Something went wrong while processing your request. Please try again later.";
  }
} 