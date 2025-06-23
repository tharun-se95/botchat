import { Message } from "@/contexts/ChatContext";

export interface ChatResponse {
  response: string;
  error?: string;
}

export class ChatService {
  private static readonly API_ENDPOINT = "/api/chat";

  static async sendMessage(
    message: string,
    conversationHistory: Message[] = [],
    model?: string
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
          model,
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

  static async testConnection(): Promise<boolean> {
    try {
      const result = await this.sendMessage("Hello");
      return !result.error;
    } catch {
      return false;
    }
  }
}
