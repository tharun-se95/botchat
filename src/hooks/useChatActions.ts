import { useChat, Message } from "@/contexts/ChatContext";

export function useChatActions() {
  const { messages, clearMessages } = useChat();

  const exportConversation = (format: "json" | "txt" | "md" = "json") => {
    if (messages.length === 0) {
      throw new Error("No messages to export");
    }

    const timestamp = new Date().toISOString().split("T")[0];
    let content: string;
    let filename: string;
    let mimeType: string;

    switch (format) {
      case "json":
        content = JSON.stringify(messages, null, 2);
        filename = `conversation-${timestamp}.json`;
        mimeType = "application/json";
        break;
      case "txt":
        content = messages
          .map((msg) => `${msg.sender.toUpperCase()}: ${msg.text}`)
          .join("\n\n");
        filename = `conversation-${timestamp}.txt`;
        mimeType = "text/plain";
        break;
      case "md":
        content = messages
          .map((msg) => `**${msg.sender.toUpperCase()}**: ${msg.text}`)
          .join("\n\n");
        filename = `conversation-${timestamp}.md`;
        mimeType = "text/markdown";
        break;
      default:
        throw new Error("Unsupported export format");
    }

    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const getConversationStats = () => {
    const userMessages = messages.filter((msg) => msg.sender === "user");
    const botMessages = messages.filter((msg) => msg.sender === "bot");
    const totalWords = messages.reduce(
      (acc, msg) => acc + msg.text.split(" ").length,
      0
    );
    const averageWordsPerMessage =
      messages.length > 0 ? Math.round(totalWords / messages.length) : 0;

    return {
      totalMessages: messages.length,
      userMessages: userMessages.length,
      botMessages: botMessages.length,
      totalWords,
      averageWordsPerMessage,
      conversationDuration:
        messages.length > 1
          ? new Date(
              messages[messages.length - 1].timestamp || Date.now()
            ).getTime() -
            new Date(messages[0].timestamp || Date.now()).getTime()
          : 0,
    };
  };

  const searchMessages = (query: string): Message[] => {
    if (!query.trim()) return messages;

    const lowerQuery = query.toLowerCase();
    return messages.filter((msg) =>
      msg.text.toLowerCase().includes(lowerQuery)
    );
  };

  const getMessageById = (index: number): Message | undefined => {
    return messages[index];
  };

  const deleteMessage = (index: number) => {
    // This would need to be implemented in the ChatContext
    // For now, we'll just return a function that can be called
    console.log(`Delete message at index ${index}`);
  };

  return {
    exportConversation,
    getConversationStats,
    searchMessages,
    getMessageById,
    deleteMessage,
    clearMessages,
    hasMessages: messages.length > 0,
  };
}
