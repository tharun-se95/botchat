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
  const {
    messages,
    sessions,
    currentSessionId,
    createNewSession,
    switchSession,
    deleteSession,
    clearMessages,
  } = useChat();
  const { exportConversation, getConversationStats, hasMessages } =
    useChatActions();

  const handleNewChat = () => {
    createNewSession();
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

      {/* Session List */}
      <div className="mb-4">
        <h3 className="font-semibold mb-1 text-xs text-gray-400 uppercase tracking-wider">Chats</h3>
        <ul className="space-y-0.5">
          {sessions.map((session) => (
            <li key={session.id} className="flex items-center group">
              <button
                className={`flex-1 text-left px-2 py-1 rounded-md truncate text-xs ${
                  session.id === currentSessionId
                    ? "bg-blue-100 dark:bg-blue-900 font-semibold text-primaryText"
                    : "hover:bg-surface text-gray-200"
                }`}
                onClick={() => switchSession(session.id)}
                title={session.title}
                style={{ maxWidth: '140px' }}
              >
                {session.title}
              </button>
              <button
                className="ml-1 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={(e) => {
                  e.stopPropagation();
                  if (confirm("Delete this chat?")) deleteSession(session.id);
                }}
                title="Delete chat"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* Current Chat Info */}
      {hasMessages && (
        <div className="mb-3 p-2 bg-surface rounded-md">
          <h3 className="font-semibold mb-1 text-xs text-gray-400 uppercase tracking-wider">Current Chat</h3>
          <p className="text-xs text-gray-400 mb-1 truncate">
            {getConversationSummary(messages)}
          </p>
          <div className="flex flex-wrap gap-1">
            <button
              onClick={handleExportChat}
              className="text-xs px-1.5 py-0.5 bg-blue-500 text-white rounded hover:bg-blue-600"
              title="Export as JSON"
            >
              JSON
            </button>
            <button
              onClick={handleExportAsText}
              className="text-xs px-1.5 py-0.5 bg-green-500 text-white rounded hover:bg-green-600"
              title="Export as Text"
            >
              TXT
            </button>
            <button
              onClick={handleExportAsMarkdown}
              className="text-xs px-1.5 py-0.5 bg-purple-500 text-white rounded hover:bg-purple-600"
              title="Export as Markdown"
            >
              MD
            </button>
            <button
              onClick={handleShowStats}
              className="text-xs px-1.5 py-0.5 bg-orange-500 text-white rounded hover:bg-orange-600"
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
