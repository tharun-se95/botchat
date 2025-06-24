import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { cn } from "@/lib/utils";
import { useTypewriter } from "@/hooks/useTypewriter";

type MessageBubbleProps = {
  sender: "user" | "bot";
  text: string;
  isTyping?: boolean;
  isStreaming?: boolean;
};

function StreamingBotMessage({ text }: { text: string }) {
  const animatedText = useTypewriter(text, 15);
  return (
    <ReactMarkdown remarkPlugins={[remarkGfm]}>{animatedText}</ReactMarkdown>
  );
}

export function MessageBubble({
  sender,
  text,
  isTyping,
  isStreaming,
}: MessageBubbleProps) {
  return (
    <div
      className={cn(
        "flex w-full",
        sender === "user" ? "justify-end" : "justify-start"
      )}
    >
      <div
        className={cn(
          "rounded-2xl p-4 my-8 text-sm md:text-base",
          sender === "user"
            ? "bg-surface text-primaryText prose prose-sm dark:prose-invert max-w-[80%]"
            : "text-primaryText w-full prose prose-sm dark:prose-invert max-w-none"
        )}
      >
        {sender === "bot" && isStreaming ? (
          <StreamingBotMessage text={text} />
        ) : (
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{text}</ReactMarkdown>
        )}

        {/* Streaming cursor */}
        {isStreaming && sender === "bot" && (
          <span className="inline-block w-0.5 h-5 bg-primaryText ml-1 animate-pulse" />
        )}

        {/* Typing indicator */}
        {isTyping && !isStreaming && (
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
