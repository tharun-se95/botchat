import { ChatTogetherAI } from "@langchain/community/chat_models/togetherai";
import { HumanMessage, AIMessage } from "@langchain/core/messages";
import { BufferMemory, ConversationSummaryMemory, CombinedMemory } from "langchain/memory";
import { ConversationChain } from "langchain/chains";

export interface ChatMessage {
  sender: "user" | "bot";
  text: string;
}

const model = process.env.TOGETHER_MODEL || "meta-llama/Meta-Llama-3.1-8B-Instruct-Turbo";

function getApiKey() {
  const apiKey = process.env.TOGETHER_API_KEY;
  if (!apiKey) {
    throw new Error("TOGETHER_API_KEY is not set in environment variables");
  }
  return apiKey;
}

const createTogetherChatModel = (modelOverride?: string) => {
  const apiKey = getApiKey();
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
    // Decide which memory to use based on conversation length
    let memory;
    if (conversationHistory.length < 100) {
      console.log("[Memory] Using BufferMemory (TogetherAI)");
      memory = new BufferMemory();
    } else {
      console.log("[Memory] Using ConversationSummaryMemory (TogetherAI)");
      memory = new ConversationSummaryMemory({ llm: togetherModel });
    }
    // Optionally, you can use CombinedMemory for more advanced logic
    // Uncomment below to use CombinedMemory and see log
    // memory = new CombinedMemory({
    //   memories: [
    //     new BufferMemory(),
    //     new ConversationSummaryMemory({ llm: togetherModel }),
    //   ],
    // });
    // console.log("[Memory] Using CombinedMemory (Buffer + Summary) (TogetherAI)");
    const chain = new ConversationChain({ llm: togetherModel, memory });
    // Save context only when both user and bot messages are present
    for (let i = 0; i < conversationHistory.length - 1; i += 2) {
      const userMsg = conversationHistory[i];
      const botMsg = conversationHistory[i + 1];
      if (userMsg.sender === "user" && botMsg.sender === "bot") {
        await memory.saveContext(
          { input: userMsg.text },
          { output: botMsg.text }
        );
      }
    }
    const response = await chain.call({ input: userMessage });
    return response.response || response.text || "";
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