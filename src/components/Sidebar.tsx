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
  MoreHorizontal,
  Bot
} from "lucide-react";
import { useChat } from "@/contexts/ChatContext";
import { useChatActions } from "@/hooks/useChatActions";
import { getConversationSummary } from "@/lib/chatUtils";
import { useState, useRef, useEffect } from "react";

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
  const [menuOpenId, setMenuOpenId] = useState<string | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close menu on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpenId(null);
      }
    }
    if (menuOpenId) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [menuOpenId]);

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


  return (
    <div className="p-4 flex flex-col h-full text-sm">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <Bot className="h-5 w-5" />
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
        <h3 className="font-semibold mb-1 text-xs md:text-sm text-gray-400 uppercase tracking-wider">Chats</h3>
        <ul className="space-y-0.5">
          {sessions.map((session) => (
            <li
              key={session.id}
              className={`flex items-center group px-2 py-2 rounded-md ${
                session.id === currentSessionId
                  ? "bg-surface font-semibold text-primaryText "
                  : "hover:bg-surface text-gray-200"
              }`}
            >
              <button
                className="flex-1 text-left truncate text-xs md:text-sm"
                onClick={() => switchSession(session.id)}
                title={session.title}
              >
                {session.title}
              </button>
              {/* Three-dot menu button */}
              <div className="relative flex items-center">
                <button
                  className="ml-1 text-gray-400 hover:text-accent transition-opacity"
                  onClick={e => {
                    e.stopPropagation();
                    setMenuOpenId(menuOpenId === session.id ? null : session.id);
                  }}
                  title="More options"
                  tabIndex={0}
                >
                  <MoreHorizontal className="h-4 w-4" />
                </button>
                {/* Dropdown menu */}
                {menuOpenId === session.id && (
                  <div
                    ref={menuRef}
                    className="fixed left-full top-0 z-[9999] w-40 bg-[#232324] border border-[#39393b] rounded-lg shadow-xl flex flex-col text-xs md:text-sm animate-fade-in py-2 ml-2"
                    style={{ minWidth: '160px' }}
                  >
                    <button className="flex items-center px-4 py-2 hover:bg-[#2a2a2c] text-left gap-2 text-xs md:text-sm">
                      <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M4 12v7a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-7"/><polyline points="16 6 12 2 8 6"/><line x1="12" y1="2" x2="12" y2="15"/></svg>
                      Share
                    </button>
                    <button className="flex items-center px-4 py-2 hover:bg-[#2a2a2c] text-left gap-2 text-xs md:text-sm">
                      <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19.5 2 21l1.5-5L16.5 3.5z"/></svg>
                      Rename
                    </button>
                    <hr className="my-1 border-[#39393b]" />
                    <button className="flex items-center px-4 py-2 text-gray-500 cursor-not-allowed gap-2 text-xs md:text-sm" disabled>
                      <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect width="18" height="18" x="3" y="3" rx="2"/><path d="M9 3v18"/><path d="M15 3v18"/></svg>
                      Archive
                    </button>
                    <button
                      className="flex items-center px-4 py-2 hover:bg-red-600 text-left gap-2 text-red-500 rounded-b-lg text-xs md:text-sm"
                      onClick={e => {
                        e.stopPropagation();
                        if (confirm("Delete this chat?")) deleteSession(session.id);
                        setMenuOpenId(null);
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                      Delete
                    </button>
                  </div>
                )}
              </div>
            </li>
          ))}
        </ul>
      </div>

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
