import { Message } from "@/contexts/ChatContext";

export interface ChatResponse {
  response: string;
  error?: string;
}

export interface StreamChunk {
  type: "start" | "chunk" | "done" | "error";
  content?: string;
  error?: string;
}

export class ChatService {
  private static readonly API_ENDPOINT = "/api/chat";
  private static readonly STREAM_ENDPOINT = "/api/chat/stream";

  static async sendMessage(
    message: string,
    conversationHistory: Message[] = []
  ): Promise<ChatResponse> {
    try {
      const response = await fetch(this.API_ENDPOINT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: message.trim(),
          conversationHistory,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.error) {
        throw new Error(data.error);
      }

      return { response: data.response };
    } catch (error) {
      console.error("ChatService error:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error occurred";
      return { response: "", error: errorMessage };
    }
  }

  static async *streamMessage(
    message: string,
    conversationHistory: Message[] = []
  ): AsyncGenerator<StreamChunk, void, unknown> {
    try {
      const response = await fetch(this.STREAM_ENDPOINT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: message.trim(),
          conversationHistory,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      if (!response.body) {
        throw new Error("No response body");
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();

      try {
        while (true) {
          const { done, value } = await reader.read();

          if (done) break;

          const chunk = decoder.decode(value);
          const lines = chunk.split("\n");

          for (const line of lines) {
            if (line.startsWith("data: ")) {
              try {
                const data = JSON.parse(line.slice(6));
                yield data as StreamChunk;

                if (data.type === "done" || data.type === "error") {
                  return;
                }
              } catch (parseError) {
                console.error("Error parsing SSE data:", parseError);
              }
            }
          }
        }
      } finally {
        reader.releaseLock();
      }
    } catch (error) {
      console.error("ChatService streaming error:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error occurred";
      yield { type: "error", error: errorMessage };
    }
  }

  static async testConnection(): Promise<boolean> {
    try {
      const result = await this.sendMessage("Hello");
      return !result.error;
    } catch {
      return false;
    }
  }
}
