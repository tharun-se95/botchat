"use client";
import { useState } from "react";
import { ChatLayout } from "@/components/ChatLayout";
import { Sidebar } from "@/components/Sidebar";
import { Menu, Pencil, Search, Library } from "lucide-react";
import { Tooltip } from "@/components/Tooltip";
import { useChat } from "@/contexts/ChatContext";
import { MODEL_OPTIONS, ModelOption } from "@/lib/models";

export default function Home() {
  const {
    messages,
    isTyping,
    sendMessage,
    isLoading,
    error,
  } = useChat();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [selectedModel, setSelectedModel] = useState(MODEL_OPTIONS[0].value);

  const handleSend = async (message: string) => {
    await sendMessage(message, selectedModel);
  };

  const handleModelChange = (model: string) => {
    setSelectedModel(model);
  };

  return (
    <main className="w-screen h-screen bg-background flex">
      <div
        className={`h-full bg-sidebar transition-all duration-300 overflow-hidden ${
          isSidebarOpen ? "w-[15%]" : "w-0"
        }`}
      >
        <Sidebar setIsOpen={setIsSidebarOpen} />
      </div>

      <div className="flex-1 flex">
        {!isSidebarOpen && (
          <div className="bg-sidebar p-2 h-full flex flex-col items-center space-y-4">
            <Tooltip content="Open sidebar" position="right">
              <button
                className="p-2 hover:bg-surface rounded-full"
                onClick={() => setIsSidebarOpen(true)}
              >
                <Menu className="h-5 w-5" />
              </button>
            </Tooltip>
            <Tooltip content="New Chat" position="right">
              <button className="p-2 rounded-lg hover:bg-surface">
                <Pencil className="h-5 w-5" />
              </button>
            </Tooltip>
            <Tooltip content="Search chats" position="right">
              <button className="p-2 rounded-lg hover:bg-surface">
                <Search className="h-5 w-5" />
              </button>
            </Tooltip>
            <Tooltip content="Library" position="right">
              <button className="p-2 rounded-lg hover:bg-surface">
                <Library className="h-5 w-5" />
              </button>
            </Tooltip>
          </div>
        )}
        <ChatLayout
          messages={messages}
          onSend={handleSend}
          isTyping={isTyping}
          disabled={isTyping || isLoading}
          models={MODEL_OPTIONS}
          selectedModel={selectedModel}
          onModelChange={handleModelChange}
        />
      </div>
    </main>
  );
}
