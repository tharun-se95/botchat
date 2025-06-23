import { Message } from "@/contexts/ChatContext";

export const formatTimestamp = (
  timestamp: Date | string | undefined
): string => {
  if (!timestamp) return "";

  const date = new Date(timestamp);
  const now = new Date();
  const diffInMinutes = Math.floor(
    (now.getTime() - date.getTime()) / (1000 * 60)
  );

  if (diffInMinutes < 1) return "Just now";
  if (diffInMinutes < 60) return `${diffInMinutes}m ago`;

  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `${diffInHours}h ago`;

  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) return `${diffInDays}d ago`;

  return date.toLocaleDateString();
};

export const validateMessage = (
  message: string
): { isValid: boolean; error?: string } => {
  if (!message || message.trim().length === 0) {
    return { isValid: false, error: "Message cannot be empty" };
  }

  if (message.length > 4000) {
    return {
      isValid: false,
      error: "Message is too long (max 4000 characters)",
    };
  }

  return { isValid: true };
};

export const truncateMessage = (
  message: string,
  maxLength: number = 100
): string => {
  if (message.length <= maxLength) return message;
  return message.substring(0, maxLength) + "...";
};

export const getMessageWordCount = (message: string): number => {
  return message.trim().split(/\s+/).length;
};

export const estimateReadingTime = (message: string): number => {
  const wordsPerMinute = 200; // Average reading speed
  const wordCount = getMessageWordCount(message);
  return Math.ceil(wordCount / wordsPerMinute);
};

export const sanitizeMessage = (message: string): string => {
  // Remove potentially harmful HTML/script tags
  return message
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
    .replace(/<[^>]*>/g, "")
    .trim();
};

export const groupMessagesByDate = (
  messages: Message[]
): Record<string, Message[]> => {
  const groups: Record<string, Message[]> = {};

  messages.forEach((message) => {
    const date = new Date(message.timestamp || Date.now()).toDateString();
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(message);
  });

  return groups;
};

export const getConversationSummary = (messages: Message[]): string => {
  if (messages.length === 0) return "No messages yet";

  const userMessages = messages.filter((msg) => msg.sender === "user");
  const botMessages = messages.filter((msg) => msg.sender === "bot");

  return `${messages.length} messages (${userMessages.length} from you, ${botMessages.length} from AI)`;
};

export const isMessageFromToday = (message: Message): boolean => {
  const messageDate = new Date(message.timestamp || Date.now());
  const today = new Date();

  return (
    messageDate.getDate() === today.getDate() &&
    messageDate.getMonth() === today.getMonth() &&
    messageDate.getFullYear() === today.getFullYear()
  );
};

export const getMessageStatus = (
  message: Message,
  isLastMessage: boolean
): string => {
  if (!message.timestamp) return "Unknown";

  if (isLastMessage && isMessageFromToday(message)) {
    return "Latest";
  }

  return formatTimestamp(message.timestamp);
};
