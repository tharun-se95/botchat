"use client";
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { ChatService } from "@/services/chatService";
import { v4 as uuidv4 } from "uuid";
import { getOpenAIResponse } from "@/lib/openai-service";
import { getTogetherResponse } from "@/lib/together-service";
import { MODEL_OPTIONS } from "@/lib/models";

export interface Message {
  sender: "user" | "bot";
  text: string;
  timestamp?: Date;
}

export interface ChatSessionMeta {
  id: string;
  title: string;
  created: string;
}

interface ChatContextType {
  messages: Message[];
  isTyping: boolean;
  sendMessage: (message: string, model?: string) => Promise<void>;
  clearMessages: () => void;
  isLoading: boolean;
  error: string | null;
  sessions: ChatSessionMeta[];
  currentSessionId: string;
  createNewSession: (title?: string) => void;
  switchSession: (id: string) => void;
  deleteSession: (id: string) => void;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

interface ChatProviderProps {
  children: ReactNode;
}

const SESSIONS_KEY = "chatSessions";
const SESSION_PREFIX = "chat_";

function getSessionsFromStorage(): ChatSessionMeta[] {
  const data = localStorage.getItem(SESSIONS_KEY);
  return data ? JSON.parse(data) : [];
}

function saveSessionsToStorage(sessions: ChatSessionMeta[]) {
  localStorage.setItem(SESSIONS_KEY, JSON.stringify(sessions));
}

function getMessagesFromStorage(sessionId: string): Message[] {
  const data = localStorage.getItem(SESSION_PREFIX + sessionId);
  if (!data) return [];
  try {
    const parsed = JSON.parse(data);
    return parsed.map((msg: Message) => ({
      ...msg,
      timestamp: msg.timestamp ? new Date(msg.timestamp) : new Date(),
    }));
  } catch {
    return [];
  }
}

function saveMessagesToStorage(sessionId: string, messages: Message[]) {
  localStorage.setItem(SESSION_PREFIX + sessionId, JSON.stringify(messages));
}

function deleteMessagesFromStorage(sessionId: string) {
  localStorage.removeItem(SESSION_PREFIX + sessionId);
}

// Helper to generate a session title using the API route
async function generateSessionTitle(
  messages: Message[],
  model?: string,
  provider?: string
): Promise<string> {
  // Use the first 3 messages for context
  const contextMsgs = messages.slice(0, 3);
  try {
    console.log("[generateSessionTitle] provider:", provider, "model:", model);
    const res = await fetch("/api/chat/generate-title", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messages: contextMsgs, model, provider }),
    });
    const data = await res.json();
    console.log("[generateSessionTitle] API response:", data);
    if (data && data.title) {
      return data.title;
    }
    return "New Chat";
  } catch (err) {
    console.error("[generateSessionTitle] error:", err);
    return "New Chat";
  }
}

export function ChatProvider({ children }: ChatProviderProps) {
  const [sessions, setSessions] = useState<ChatSessionMeta[]>([]);
  const [currentSessionId, setCurrentSessionId] = useState<string>("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load sessions and last session on mount
  useEffect(() => {
    const loadedSessions = getSessionsFromStorage();
    setSessions(loadedSessions);
    if (loadedSessions.length > 0) {
      setCurrentSessionId(loadedSessions[0].id);
      setMessages(getMessagesFromStorage(loadedSessions[0].id));
    } else {
      // Create a default session
      const newId = uuidv4();
      const newSession: ChatSessionMeta = {
        id: newId,
        title: "New Chat",
        created: new Date().toISOString(),
      };
      setSessions([newSession]);
      setCurrentSessionId(newId);
      setMessages([]);
      saveSessionsToStorage([newSession]);
    }
  }, []);

  // Save messages to localStorage whenever messages or session changes
  useEffect(() => {
    if (currentSessionId) {
      saveMessagesToStorage(currentSessionId, messages);
    }
  }, [messages, currentSessionId]);

  // Save sessions to localStorage whenever sessions change
  useEffect(() => {
    saveSessionsToStorage(sessions);
  }, [sessions]);

  const sendMessage = async (message: string, model?: string) => {
    if (!message.trim()) return;
    if (!currentSessionId) return;

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
      // 1. Fetch RAG context
      const { context } = await ChatService.fetchRagContext(
        message.trim(),
        currentSessionId
      );
      console.log("[sendMessage] context:", context);
      // 2. Prepend context to prompt
      const ragPrompt = context
        ? `Use the following context to answer the user's question.\nContext:\n${context}\n\nUser: ${message.trim()}`
        : message.trim();
      // 3. Call LLM with context-augmented prompt
      const result = await ChatService.sendMessage(ragPrompt, messages, model);

      if (result.error) {
        throw new Error(result.error);
      }

      const botMessage: Message = {
        sender: "bot",
        text: result.response,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, botMessage]);

      // LLM-based session titling after a few messages
      setTimeout(async () => {
        const currentMsgs = [...messages, userMessage, botMessage];
        if (currentMsgs.length >= 3) {
          // Only update if still default title
          const session = sessions.find((s) => s.id === currentSessionId);
          if (session && session.title === "New Chat") {
            const modelOption = MODEL_OPTIONS.find((m) => m.value === model);
            const provider = modelOption?.provider || "openai";
            const title = await generateSessionTitle(
              currentMsgs,
              model,
              provider
            );
            if (title && title !== "New Chat") {
              setSessions((prev) =>
                prev.map((s) =>
                  s.id === currentSessionId ? { ...s, title } : s
                )
              );
            }
          }
        }
      }, 0);
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

  const clearMessages = () => {
    if (!currentSessionId) return;
    setMessages([]);
    setError(null);
    deleteMessagesFromStorage(currentSessionId);
  };

  const createNewSession = (title = "New Chat") => {
    const newId = uuidv4();
    const newSession: ChatSessionMeta = {
      id: newId,
      title,
      created: new Date().toISOString(),
    };
    setSessions((prev) => [newSession, ...prev]);
    setCurrentSessionId(newId);
    setMessages([]);
  };

  const switchSession = (id: string) => {
    setCurrentSessionId(id);
    setMessages(getMessagesFromStorage(id));
    setError(null);
  };

  const deleteSession = (id: string) => {
    setSessions((prev) => prev.filter((s) => s.id !== id));
    deleteMessagesFromStorage(id);
    if (id === currentSessionId) {
      // Switch to another session or create a new one
      const remaining = sessions.filter((s) => s.id !== id);
      if (remaining.length > 0) {
        setCurrentSessionId(remaining[0].id);
        setMessages(getMessagesFromStorage(remaining[0].id));
      } else {
        createNewSession();
      }
    }
  };

  const value: ChatContextType = {
    messages,
    isTyping,
    sendMessage,
    clearMessages,
    isLoading,
    error,
    sessions,
    currentSessionId,
    createNewSession,
    switchSession,
    deleteSession,
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
