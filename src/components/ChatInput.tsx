import { useState } from "react";
import { ArrowUp, Plus, Mic, Settings2 } from "lucide-react";

type ChatInputProps = {
  onSend: (message: string) => void;
  disabled: boolean;
};

export function ChatInput({ onSend, disabled }: ChatInputProps) {
  const [message, setMessage] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim()) {
      onSend(message);
      setMessage("");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col w-full h-full p-2 justify-between"
    >
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Type a message..."
        className="w-full bg-transparent focus:outline-none text-white placeholder-accent text-sm"
        disabled={disabled}
        autoFocus
      />
      <div className="flex justify-between items-center">
        {/* Left Controls */}
        <div className="flex items-center gap-3">
          <button type="button" className="text-accent hover:text-white">
            <Plus className="w-5 h-5" />
          </button>
          <button
            type="button"
            className="flex items-center gap-2 text-accent hover:text-white"
          >
            <Settings2 className="w-5 h-5" />
            <span className="text-sm">Tools</span>
          </button>
        </div>

        {/* Right Controls */}
        <div className="flex items-center gap-3">
          <button type="button" className="text-accent hover:text-white">
            <Mic className="w-5 h-5" />
          </button>
          <button
            type="submit"
            className="p-2 bg-white text-black rounded-full disabled:opacity-50"
            disabled={disabled || !message.trim()}
          >
            <ArrowUp className="w-5 h-5" />
          </button>
        </div>
      </div>
    </form>
  );
}
