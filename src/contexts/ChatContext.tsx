"use client";
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { ChatService, StreamChunk } from "@/services/chatService";

export interface Message {
  sender: "user" | "bot";
  text: string;
  timestamp?: Date;
}

interface ChatContextType {
  messages: Message[];
  isTyping: boolean;
  isStreaming: boolean;
  sendMessage: (message: string) => Promise<void>;
  sendStreamMessage: (message: string) => Promise<void>;
  clearMessages: () => void;
  isLoading: boolean;
  error: string | null;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

interface ChatProviderProps {
  children: ReactNode;
}

export function ChatProvider({ children }: ChatProviderProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load messages from localStorage on mount
  useEffect(() => {
    const savedMessages = localStorage.getItem("chatMessages");
    if (savedMessages) {
      try {
        const parsedMessages = JSON.parse(savedMessages);
        // Add timestamps to old messages if they don't have them
        const messagesWithTimestamps = parsedMessages.map((msg: Message) => ({
          ...msg,
          timestamp: msg.timestamp ? new Date(msg.timestamp) : new Date(),
        }));
        setMessages(messagesWithTimestamps);
      } catch (error) {
        console.error("Error loading messages from localStorage:", error);
      }
    }
  }, []);

  // Save messages to localStorage whenever messages change
  useEffect(() => {
    localStorage.setItem("chatMessages", JSON.stringify(messages));
  }, [messages]);

  const sendMessage = async (message: string) => {
    if (!message.trim()) return;

    const userMessage: Message = {
      sender: "user",
      text: message.trim(),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsTyping(true);
    setError(null);
    setIsLoading(true);

    try {
      const result = await ChatService.sendMessage(message.trim(), messages);

      if (result.error) {
        throw new Error(result.error);
      }

      const botMessage: Message = {
        sender: "bot",
        text: result.response,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error("Error getting response:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error occurred";
      setError(errorMessage);

      const errorBotMessage: Message = {
        sender: "bot",
        text: `❌ **Error**: Unable to get response from AI. ${errorMessage}`,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, errorBotMessage]);
    } finally {
      setIsTyping(false);
      setIsLoading(false);
    }
  };

  const sendStreamMessage = async (message: string) => {
    if (!message.trim()) return;

    const userMessage: Message = {
      sender: "user",
      text: message.trim(),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsTyping(false);
    setIsStreaming(true);
    setError(null);
    setIsLoading(true);

    // Create a placeholder bot message that will be updated
    const botMessage: Message = {
      sender: "bot",
      text: "",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, botMessage]);

    try {
      const stream = ChatService.streamMessage(message.trim(), messages);
      let fullResponse = "";

      for await (const chunk of stream) {
        switch (chunk.type) {
          case "start":
            // Stream started, keep the placeholder message
            break;
          case "chunk":
            if (chunk.content) {
              fullResponse += chunk.content;
              // Update the bot message with the accumulated response
              setMessages((prev) => {
                const newMessages = [...prev];
                const lastMessage = newMessages[newMessages.length - 1];
                if (lastMessage && lastMessage.sender === "bot") {
                  lastMessage.text = fullResponse;
                }
                return newMessages;
              });
            }
            break;
          case "done":
            // Stream completed, finalize the message
            setMessages((prev) => {
              const newMessages = [...prev];
              const lastMessage = newMessages[newMessages.length - 1];
              if (lastMessage && lastMessage.sender === "bot") {
                lastMessage.text = fullResponse;
              }
              return newMessages;
            });
            break;
          case "error":
            if (chunk.error) {
              setError(chunk.error);
              setMessages((prev) => {
                const newMessages = [...prev];
                const lastMessage = newMessages[newMessages.length - 1];
                if (lastMessage && lastMessage.sender === "bot") {
                  lastMessage.text = `❌ **Error**: ${chunk.error}`;
                }
                return newMessages;
              });
            }
            break;
        }
      }
    } catch (error) {
      console.error("Error getting streaming response:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error occurred";
      setError(errorMessage);

      setMessages((prev) => {
        const newMessages = [...prev];
        const lastMessage = newMessages[newMessages.length - 1];
        if (lastMessage && lastMessage.sender === "bot") {
          lastMessage.text = `❌ **Error**: Unable to get response from AI. ${errorMessage}`;
        }
        return newMessages;
      });
    } finally {
      setIsStreaming(false);
      setIsLoading(false);
    }
  };

  const clearMessages = () => {
    setMessages([]);
    setError(null);
    localStorage.removeItem("chatMessages");
  };

  const value: ChatContextType = {
    messages,
    isTyping,
    isStreaming,
    sendMessage,
    sendStreamMessage,
    clearMessages,
    isLoading,
    error,
  };

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
}

export function useChat() {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error("useChat must be used within a ChatProvider");
  }
  return context;
}
