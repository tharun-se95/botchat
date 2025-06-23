export interface AppConfig {
  openai: {
    model: string;
    temperature: number;
    maxTokens: number;
    timeout: number;
  };
  chat: {
    maxMessageLength: number;
    maxConversationLength: number;
    autoSave: boolean;
    typingIndicatorDelay: number;
  };
  ui: {
    theme: "light" | "dark" | "auto";
    sidebarWidth: string;
    messageSpacing: number;
    showTimestamps: boolean;
  };
}

export const defaultConfig: AppConfig = {
  openai: {
    model: process.env.OPENAI_MODEL || "gpt-3.5-turbo",
    temperature: 0.7,
    maxTokens: 1000,
    timeout: 30000, // 30 seconds
  },
  chat: {
    maxMessageLength: 4000,
    maxConversationLength: 50, // Max messages in a conversation
    autoSave: true,
    typingIndicatorDelay: 1000, // 1 second
  },
  ui: {
    theme: "auto",
    sidebarWidth: "15%",
    messageSpacing: 4,
    showTimestamps: true,
  },
};

class ConfigService {
  private config: AppConfig;

  constructor() {
    this.config = { ...defaultConfig };
    this.loadFromStorage();
  }

  private loadFromStorage() {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("botchat-config");
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          this.config = { ...defaultConfig, ...parsed };
        } catch (error) {
          console.error("Error loading config from storage:", error);
        }
      }
    }
  }

  private saveToStorage() {
    if (typeof window !== "undefined") {
      localStorage.setItem("botchat-config", JSON.stringify(this.config));
    }
  }

  get<K extends keyof AppConfig>(key: K): AppConfig[K] {
    return this.config[key];
  }

  set<K extends keyof AppConfig>(key: K, value: AppConfig[K]) {
    this.config[key] = value;
    this.saveToStorage();
  }

  update<K extends keyof AppConfig>(key: K, updates: Partial<AppConfig[K]>) {
    this.config[key] = { ...this.config[key], ...updates };
    this.saveToStorage();
  }

  reset() {
    this.config = { ...defaultConfig };
    this.saveToStorage();
  }

  getAll(): AppConfig {
    return { ...this.config };
  }
}

export const configService = new ConfigService();

// Helper functions for common config access
export const getOpenAIConfig = () => configService.get("openai");
export const getChatConfig = () => configService.get("chat");
export const getUIConfig = () => configService.get("ui");
