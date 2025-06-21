import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { cn } from "@/lib/utils";

type MessageBubbleProps = {
  sender: "user" | "bot";
  text: string;
  isTyping?: boolean;
};

export function MessageBubble({ sender, text, isTyping }: MessageBubbleProps) {
  return (
    <div
      className={cn(
        "flex w-full",
        sender === "user" ? "justify-end" : "justify-start"
      )}
    >
      <div
        className={cn(
          "rounded-2xl p-4 my-8",
          sender === "user"
            ? "bg-surface text-primaryText prose  dark:prose-invert max-w-[80%]"
            : "text-primaryText w-full prose  dark:prose-invert max-w-none"
        )}
      >
        <ReactMarkdown remarkPlugins={[remarkGfm]}>{text}</ReactMarkdown>
        {isTyping && (
          <div className="flex space-x-1 mt-2">
            <div className="w-2 h-2 bg-card rounded-full animate-bounce" />
            <div className="w-2 h-2 bg-card rounded-full animate-bounce delay-100" />
            <div className="w-2 h-2 bg-card rounded-full animate-bounce delay-200" />
          </div>
        )}
      </div>
    </div>
  );
}
