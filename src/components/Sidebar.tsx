import {
  ChevronLeft,
  Pencil,
  Search,
  Library,
  Plus,
  Settings,
  Download,
  Trash2,
  BarChart3,
} from "lucide-react";
import { useChat } from "@/contexts/ChatContext";
import { useChatActions } from "@/hooks/useChatActions";
import { getConversationSummary } from "@/lib/chatUtils";

type SidebarProps = {
  setIsOpen: (isOpen: boolean) => void;
};

export function Sidebar({ setIsOpen }: SidebarProps) {
  const { messages, clearMessages } = useChat();
  const { exportConversation, getConversationStats, hasMessages } =
    useChatActions();

  const handleNewChat = () => {
    if (messages.length > 0) {
      if (
        confirm(
          "Are you sure you want to start a new chat? This will clear the current conversation."
        )
      ) {
        clearMessages();
      }
    }
  };

  const handleExportChat = () => {
    try {
      exportConversation("json");
    } catch (error) {
      alert("No messages to export");
    }
  };

  const handleExportAsText = () => {
    try {
      exportConversation("txt");
    } catch (error) {
      alert("No messages to export");
    }
  };

  const handleExportAsMarkdown = () => {
    try {
      exportConversation("md");
    } catch (error) {
      alert("No messages to export");
    }
  };

  const handleShowStats = () => {
    const stats = getConversationStats();
    const duration =
      stats.conversationDuration > 0
        ? Math.round(stats.conversationDuration / (1000 * 60))
        : 0;

    alert(`Conversation Statistics:
    
Total Messages: ${stats.totalMessages}
Your Messages: ${stats.userMessages}
AI Messages: ${stats.botMessages}
Total Words: ${stats.totalWords}
Average Words per Message: ${stats.averageWordsPerMessage}
Duration: ${duration} minutes`);
  };

  return (
    <div className="p-4 flex flex-col h-full text-sm">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-white rounded-full" />
          <span className="font-bold text-lg">BotChat</span>
        </div>
        <button
          className="p-2 hover:bg-surface rounded-full"
          onClick={() => setIsOpen(false)}
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
      </div>

      <div className="mb-4 space-y-2">
        <button
          className="flex items-center w-full p-2 rounded-lg hover:bg-surface"
          onClick={handleNewChat}
        >
          <Pencil className="mr-2 h-5 w-5" />
          New Chat
        </button>
        <button className="flex items-center w-full p-2 rounded-lg hover:bg-surface">
          <Search className="mr-2 h-5 w-5" />
          Search chats
        </button>
        <button className="flex items-center w-full p-2 rounded-lg hover:bg-surface">
          <Library className="mr-2 h-5 w-5" />
          Library
        </button>
      </div>

      <hr className="border-surface my-2" />

      {/* Current Chat Info */}
      {hasMessages && (
        <div className="mb-4 p-3 bg-surface rounded-lg">
          <h3 className="font-semibold mb-2">Current Chat</h3>
          <p className="text-xs text-gray-400 mb-2">
            {getConversationSummary(messages)}
          </p>
          <div className="flex flex-wrap gap-1">
            <button
              onClick={handleExportChat}
              className="text-xs px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
              title="Export as JSON"
            >
              Export JSON
            </button>
            <button
              onClick={handleExportAsText}
              className="text-xs px-2 py-1 bg-green-500 text-white rounded hover:bg-green-600"
              title="Export as Text"
            >
              Export TXT
            </button>
            <button
              onClick={handleExportAsMarkdown}
              className="text-xs px-2 py-1 bg-purple-500 text-white rounded hover:bg-purple-600"
              title="Export as Markdown"
            >
              Export MD
            </button>
            <button
              onClick={handleShowStats}
              className="text-xs px-2 py-1 bg-orange-500 text-white rounded hover:bg-orange-600"
              title="Show Statistics"
            >
              Stats
            </button>
          </div>
        </div>
      )}

      <div className="flex-1 overflow-y-auto space-y-2 scrollbar-hide">
        {!hasMessages && (
          <div className="text-center text-gray-400 py-8">
            <Pencil className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p>No conversations yet</p>
            <p className="text-xs">Start a new chat to begin</p>
          </div>
        )}
      </div>

      <hr className="border-surface my-2" />

      <div className="pt-2 space-y-2">
        <button className="flex items-center w-full p-2 hover:bg-surface rounded-lg">
          <Plus className="mr-2 h-5 w-5" />
          Upgrade plan
        </button>
        <button className="flex items-center w-full p-2 hover:bg-surface rounded-lg">
          <Settings className="mr-2 h-5 w-5" />
          Settings
        </button>
      </div>
    </div>
  );
}
