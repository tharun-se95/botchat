"use client";
import { useState } from "react";
import { ChatLayout } from "@/components/ChatLayout";
import { Sidebar } from "@/components/Sidebar";
import { Menu, Pencil, Search, Library } from "lucide-react";
import { Tooltip } from "@/components/Tooltip";
import { useChat } from "@/contexts/ChatContext";
import { MODEL_OPTIONS, ModelOption } from "@/lib/models";
import { Toaster, toast } from "react-hot-toast";

export default function Home() {
  const {
    messages,
    isTyping,
    sendMessage,
    isLoading,
    error,
    currentSessionId,
  } = useChat();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [fileSummary, setFileSummary] = useState<null | {
    name: string;
    size: number;
    chunkCount: number;
  }>(null);
  const deepseekV3 = MODEL_OPTIONS.find(
    (m) => m.value === "deepseek-ai/DeepSeek-V3"
  );
  const [selectedModel, setSelectedModel] = useState(
    deepseekV3 ? deepseekV3.value : MODEL_OPTIONS[0].value
  );

  const handleSend = async (message: string, file?: File) => {
    if (!message.trim() && !file) return;
    try {
      if (file) {
        setUploading(true);
        setFileSummary(null);
        const formData = new FormData();
        formData.append("file", file);
        if (currentSessionId) {
          formData.append("sessionId", currentSessionId);
        }
        const res = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });
        const data = await res.json();
        setUploading(false);
        if (!res.ok || !data?.name) {
          toast.error(
            data?.error
              ? `${data.error}${data.details ? ": " + data.details : ""}`
              : "File upload failed"
          );
          return;
        }
        setFileSummary({
          name: data.name,
          size: data.size,
          chunkCount: data.chunkCount,
        });
        toast.success(
          `File '${data.name}' uploaded and indexed (${data.chunkCount} chunks)`
        );
        await sendMessage(
          `${message}\n[Uploaded file: ${data.name}]`,
          selectedModel
        );
      } else {
        await sendMessage(message, selectedModel);
      }
    } catch (err: any) {
      setUploading(false);
      toast.error(
        "Error uploading file or sending message: " + (err.message || err)
      );
    }
  };

  const handleModelChange = (model: string) => {
    setSelectedModel(model);
  };

  return (
    <main className="w-screen h-screen bg-background flex">
      <Toaster position="top-right" />
      <div
        className={`h-full bg-sidebar transition-all duration-300 overflow-hidden ${
          isSidebarOpen ? "w-[20%]" : "w-0"
        }`}
      >
        <Sidebar setIsOpen={setIsSidebarOpen} />
      </div>

      <div className="flex-1 flex flex-col">
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
        {/* Upload/Indexing Progress UI */}
        {/* {uploading && (
          <div className="w-full flex justify-center items-center py-2">
            <div className="flex items-center gap-2 text-accent">
              <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                  fill="none"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v8z"
                />
              </svg>
              <span>Uploading & indexing file...</span>
            </div>
          </div>
        )} */}
        {/* File Summary UI */}
        {/* {fileSummary && (
          <div className="w-full flex justify-center items-center py-2">
            <div className="bg-surface rounded-lg px-4 py-2 text-xs text-accent flex flex-col items-center">
              <span>
                File: <b>{fileSummary.name}</b>
              </span>
              <span>Size: {(fileSummary.size / 1024).toFixed(1)} KB</span>
              <span>Chunks: {fileSummary.chunkCount}</span>
            </div>
          </div>
        )} */}
        <ChatLayout
          messages={messages}
          onSend={handleSend}
          isTyping={isTyping}
          disabled={isTyping || isLoading || uploading}
          models={MODEL_OPTIONS}
          selectedModel={selectedModel}
          onModelChange={handleModelChange}
        />
      </div>
    </main>
  );
}
