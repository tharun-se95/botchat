import { ChatOpenAI } from "@langchain/openai";
import { HumanMessage, AIMessage } from "@langchain/core/messages";
import { BufferMemory, ConversationSummaryMemory, CombinedMemory, EntityMemory } from "langchain/memory";
import { ConversationChain } from "langchain/chains";

// Singleton memory instance (per process)
const memory = new BufferMemory();

// Initialize the OpenAI chat model
const createChatModel = (streaming: boolean = false, modelOverride?: string) => {
  const apiKey = process.env.OPENAI_API_KEY;
  const model = modelOverride || process.env.OPENAI_MODEL || "gpt-4o-mini";

  if (!apiKey) {
    throw new Error("OPENAI_API_KEY is not set in environment variables");
  }

  return new ChatOpenAI({
    openAIApiKey: apiKey,
    modelName: model,
    temperature: 0.7,
    maxTokens: 1000,
    streaming,
  });
};

// Interface for chat messages
export interface ChatMessage {
  sender: "user" | "bot";
  text: string;
}

// Convert our chat format to LangChain format
const convertToLangChainMessages = (messages: ChatMessage[]) => {
  return messages.map((msg) => {
    if (msg.sender === "user") {
      return new HumanMessage(msg.text);
    } else {
      return new AIMessage(msg.text);
    }
  });
};

// Main function to get response from OpenAI (non-streaming)
export async function getOpenAIResponse(
  userMessage: string,
  conversationHistory: ChatMessage[] = [],
  model?: string
): Promise<string> {
  try {
    const chatModel = createChatModel(false, model);
    // Decide which memory to use based on conversation length
    let memory;
    if (conversationHistory.length < 10) {
      console.log("[Memory] Using BufferMemory");
      memory = new BufferMemory();
    } else {
      console.log("[Memory] Using ConversationSummaryMemory");
      memory = new ConversationSummaryMemory({ llm: chatModel });
    }
    // Optionally, you can use CombinedMemory for more advanced logic
    // Uncomment below to use CombinedMemory and see log
    // memory = new CombinedMemory({
    //   memories: [
    //     new BufferMemory(),
    //     new ConversationSummaryMemory({ llm: chatModel }),
    //     new EntityMemory({ llm: chatModel }),
    //   ],
    // });
    // console.log("[Memory] Using CombinedMemory (Buffer + Summary + Entity)");
    const chain = new ConversationChain({ llm: chatModel, memory });
    for (const msg of conversationHistory) {
      await memory.saveContext(
        msg.sender === "user" ? { input: msg.text } : {},
        msg.sender === "bot" ? { output: msg.text } : {}
      );
    }
    const response = await chain.call({ input: userMessage });
    return response.response || response.text || "";
  } catch (error) {
    console.error("Error getting OpenAI response:", error);

    // Return a helpful error message
    if (error instanceof Error) {
      if (error.message.includes("API key")) {
        return "❌ **Configuration Error**: Please set your OpenAI API key in the `.env.local` file. You can get one from [OpenAI's website](https://platform.openai.com/api-keys).";
      }
      if (error.message.includes("quota")) {
        return "❌ **API Quota Exceeded**: You've reached your OpenAI API usage limit. Please check your OpenAI account or upgrade your plan.";
      }
      if (error.message.includes("network")) {
        return "❌ **Network Error**: Unable to connect to OpenAI. Please check your internet connection and try again.";
      }
    }

    return "❌ **Error**: Something went wrong while processing your request. Please try again later.";
  }
}

// Streaming function to get response from OpenAI
export async function* getOpenAIStreamResponse(
  userMessage: string,
  conversationHistory: ChatMessage[] = [],
  model?: string
): AsyncGenerator<string, void, unknown> {
  try {
    const chatModel = createChatModel(true, model);

    // Convert conversation history to LangChain format
    const langChainMessages = convertToLangChainMessages(conversationHistory);

    // Add the current user message
    langChainMessages.push(new HumanMessage(userMessage));

    // Get streaming response from OpenAI
    const stream = await chatModel.stream(langChainMessages);

    for await (const chunk of stream) {
      if (chunk.content) {
        yield chunk.content as string;
      }
    }
  } catch (error) {
    console.error("Error getting OpenAI streaming response:", error);

    // Return a helpful error message
    if (error instanceof Error) {
      if (error.message.includes("API key")) {
        yield "❌ **Configuration Error**: Please set your OpenAI API key in the `.env.local` file. You can get one from [OpenAI's website](https://platform.openai.com/api-keys).";
        return;
      }
      if (error.message.includes("quota")) {
        yield "❌ **API Quota Exceeded**: You've reached your OpenAI API usage limit. Please check your OpenAI account or upgrade your plan.";
        return;
      }
      if (error.message.includes("network")) {
        yield "❌ **Network Error**: Unable to connect to OpenAI. Please check your internet connection and try again.";
        return;
      }
    }

    yield "❌ **Error**: Something went wrong while processing your request. Please try again later.";
  }
}

// Function to test the OpenAI connection
export async function testOpenAIConnection(): Promise<boolean> {
  try {
    const chatModel = createChatModel();
    const response = await chatModel.invoke([new HumanMessage("Hello!")]);
    return !!response.content;
  } catch (error) {
    console.error("OpenAI connection test failed:", error);
    return false;
  }
}
