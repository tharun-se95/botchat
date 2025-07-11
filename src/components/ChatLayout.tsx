import { useEffect, useRef } from "react";
import { MessageBubble } from "./MessageBubble";
import { ChatInput } from "./ChatInput";
import { ModelOption, PROVIDERS } from "@/lib/models";

interface Message {
  sender: "user" | "bot";
  text: string;
}

interface ChatLayoutProps {
  messages: Message[];
  onSend: (message: string) => void;
  isTyping: boolean;
  disabled: boolean;
  isStreaming?: boolean;
  models?: ModelOption[];
  selectedModel?: string;
  onModelChange?: (model: string) => void;
}

export function ChatLayout({
  messages,
  onSend,
  isTyping,
  disabled,
  isStreaming = false,
  models = [],
  selectedModel = "gpt-4o-mini",
  onModelChange,
}: ChatLayoutProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Group models by provider using PROVIDERS
  const groupedModels = PROVIDERS.map((provider) => ({
    provider,
    models: models.filter((m) => m.provider === provider.id),
  }));

  return (
    <div className="flex flex-col items-center justify-center w-full h-full bg-chatBackground">
      <div className="w-full h-20 px-4 bg-chatBackground flex items-center justify-start shadow-md">
        <select
          className="bg-chatBackground w-60 rounded-xl px-4 py-2 "
          value={selectedModel}
          onChange={e => onModelChange?.(e.target.value)}
        >
          {groupedModels.map(({ provider, models }) => (
            <optgroup key={provider.id} label={provider.name}>
              {models.map((model) => (
                <option key={model.value} value={model.value}>{model.name}</option>
              ))}
            </optgroup>
          ))}
        </select>
      </div>
      <div className="flex flex-col w-3/4 h-full overflow-y-auto scrollbar-hide ">
        <div className="flex-1  p-4 space-y-4 ">
          {messages.map((msg, i) => (
            <MessageBubble
              key={i}
              sender={msg.sender}
              text={msg.text}
              isTyping={
                isTyping && i === messages.length - 1 && msg.sender === "bot"
              }
              isStreaming={
                isStreaming && i === messages.length - 1 && msg.sender === "bot"
              }
            />
          ))}
          <div ref={messagesEndRef} />
        </div>
      </div>
      <div className="sticky flex justify-center items-center w-3/4 h-[150px] p-4 rounded-3xl bottom-10 bg-surface">
        <ChatInput onSend={onSend} disabled={disabled} />
      </div>
    </div>
  );
}
