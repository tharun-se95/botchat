import { useState, useRef } from "react";
import { ArrowUp, Plus, Mic, Settings2, X, File } from "lucide-react";

type ChatInputProps = {
  onSend: (message: string, file?: File) => void;
  disabled: boolean;
};

export function ChatInput({ onSend, disabled }: ChatInputProps) {
  const [message, setMessage] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const disallowedExtensions: String[] = [];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() || selectedFile) {
      onSend(message, selectedFile || undefined);
      setMessage("");
      setSelectedFile(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const ext = file.name.slice(file.name.lastIndexOf(".")).toLowerCase();
      if (disallowedExtensions.includes(ext)) {
        alert("This file type is not allowed.");
        e.target.value = "";
        return;
      }
      setSelectedFile(file);
    }
  };

  const handlePlusClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col w-full h-full p-2 justify-between"
    >
      <div className="flex items-center gap-2 mb-2">
        {selectedFile && (
          <div className=" p-2 rounded text-xs mt-1 flex items-center gap-2 h-10 border border-accent">
            <File />
            <div className="flex flex-col justify-start items-start gap-1">
              <span className="text-sm">{selectedFile.name}</span>
              <span className="text-xs">{selectedFile.type}</span>
            </div>
            <button
              type="button"
              onClick={() => setSelectedFile(null)}
              className="text-white hover:text-red-500"
              aria-label="Remove file"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
      <textarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Type a message..."
        className="w-full bg-transparent focus:outline-none text-white placeholder-accent text-sm resize-none overflow-auto scrollbar-hide min-h-[40px] max-h-40"
        disabled={disabled}
        autoFocus
        rows={1}
        onInput={(e) => {
          const target = e.target as HTMLTextAreaElement;
          target.style.height = "auto";
          target.style.height = target.scrollHeight + "px";
        }}
      />
      <input
        type="file"
        ref={fileInputRef}
        style={{ display: "none" }}
        onChange={handleFileChange}
        disabled={disabled}
        accept=".pdf,.doc,.docx,.txt,.md,.json,.xml,.ppt,.pptx,.xls,.xlsx,image/*,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/vnd.ms-powerpoint,application/vnd.openxmlformats-officedocument.presentationml.presentation,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/pdf,text/plain,text/markdown,application/json,application/xml"
      />
      <div className="flex justify-between items-center">
        {/* Left Controls */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            className="text-accent hover:text-white"
            onClick={handlePlusClick}
          >
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
