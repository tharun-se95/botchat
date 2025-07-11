# BotChat - AI-Powered Chat Application

A modern, responsive chat application built with Next.js, TypeScript, and Tailwind CSS, integrated with OpenAI and Together.ai language models through LangChain. Features a clean, service-oriented architecture for maximum reusability and maintainability.

## ✨ Features

- 🤖 **AI-Powered Responses**: Connect to OpenAI and Together.ai models for intelligent conversations
- 💬 **Real-time Chat**: Smooth, responsive chat interface with typing indicators
- 🎨 **Modern UI**: Beautiful, responsive design with Tailwind CSS
- 📱 **Mobile Friendly**: Works seamlessly on desktop and mobile devices
- 💾 **Local Storage**: Chat history persists between sessions
- 🔧 **TypeScript**: Full type safety and better development experience
- 🏗️ **Service Architecture**: Clean separation of concerns with Context, Services, and Hooks
- 📊 **Conversation Analytics**: Export conversations and view statistics
- ⚙️ **Configurable**: Easy-to-customize settings and preferences
- 🔄 **Multi-Provider Support**: Easily switch between OpenAI and Together.ai models from the UI

## 🏗️ Architecture

The application follows a modern React architecture with clear separation of concerns:

### **Core Components**

- **Context Layer**: `ChatContext` manages global chat state
- **Service Layer**: `ChatService` handles API communication
- **Hook Layer**: Custom hooks for reusable logic
- **Utility Layer**: Helper functions for common operations

### **Key Benefits**

- **Reusable**: Components and logic can be easily reused across the app
- **Testable**: Services and utilities are easily unit testable
- **Maintainable**: Clear structure makes code easy to understand and modify
- **Scalable**: Architecture supports easy feature additions

## 📋 Prerequisites

- Node.js 18+
- npm or yarn
- OpenAI API key (for OpenAI models)
- Together.ai API key (for Together.ai models)

## 🚀 Getting Started

### 1. Clone the repository

```bash
git clone <your-repo-url>
cd botchat
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up API Keys

Create a `.env.local` file in the root directory and add your API keys:

```env
# OpenAI Configuration
OPENAI_API_KEY=your_actual_openai_api_key_here
# Optional: Model configuration (defaults to gpt-3.5-turbo)
OPENAI_MODEL=gpt-3.5-turbo

# Together.ai Configuration
TOGETHER_API_KEY=your_actual_together_ai_api_key_here
# Optional: Model configuration (defaults to meta-llama/Meta-Llama-3.1-8B-Instruct-Turbo)
TOGETHER_MODEL=meta-llama/Meta-Llama-3.1-8B-Instruct-Turbo
```

### 4. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## 📁 Project Structure

```
botchat/
├── src/
│   ├── app/
│   │   ├── api/chat/          # API route for model integration
│   │   ├── globals.css        # Global styles
│   │   ├── layout.tsx         # Root layout with ChatProvider
│   │   └── page.tsx           # Main chat page (simplified)
│   ├── components/            # React components
│   │   ├── ChatInput.tsx      # Message input component
│   │   ├── ChatLayout.tsx     # Main chat layout
│   │   ├── MessageBubble.tsx  # Individual message display
│   │   ├── Sidebar.tsx        # Enhanced sidebar with actions
│   │   └── ui/                # UI components
│   ├── contexts/              # React Context providers
│   │   └── ChatContext.tsx    # Global chat state management
│   ├── hooks/                 # Custom React hooks
│   │   └── useChatActions.ts  # Chat-related actions and utilities
│   ├── lib/                   # Utility libraries
│   │   ├── openai-service.ts  # LangChain OpenAI integration
│   │   ├── together-service.ts# LangChain Together.ai integration
│   │   ├── models.ts          # List of supported models/providers
│   │   ├── chatUtils.ts       # Chat utility functions
│   │   └── config.ts          # Application configuration
│   └── services/              # Service layer
│       └── chatService.ts     # API communication service
├── public/                    # Static assets
├── .env.local                 # Environment variables
└── package.json               # Dependencies and scripts
```

## 🎯 Usage

### **Basic Chat**

1. **Start a Conversation**: Type your message in the input field and press Enter
2. **AI Responses**: The application will send your message to the selected model and display the AI's response
3. **Chat History**: Your conversation history is automatically saved and will persist between sessions
4. **Switch Models**: Use the dropdown at the top to switch between OpenAI and Together.ai models at any time

### **Advanced Features**

- **Export Conversations**: Use the sidebar to export chats in JSON, TXT, or Markdown formats
- **View Statistics**: Click "Stats" to see conversation analytics
- **New Chat**: Start a fresh conversation with the "New Chat" button
- **Search**: Search through your conversation history (coming soon)

### **Error Handling**

- **Configuration Errors**: Clear error messages for missing API keys
- **Network Issues**: Helpful feedback for connection problems
- **API Limits**: Notifications for quota exceeded scenarios

## ⚙️ Configuration

### **Environment Variables**

- `OPENAI_API_KEY`: Your OpenAI API key (required for OpenAI models)
- `OPENAI_MODEL`: The OpenAI model to use (optional, defaults to `gpt-3.5-turbo`)
- `TOGETHER_API_KEY`: Your Together.ai API key (required for Together.ai models)
- `TOGETHER_MODEL`: The Together.ai model to use (optional, defaults to `meta-llama/Meta-Llama-3.1-8B-Instruct-Turbo`)

### **Supported Providers and Models**

The app supports multiple providers and models. You can select any of these from the dropdown in the UI:

**Providers:**
- OpenAI
- Together.ai

**Models:**
- GPT-4o Mini (OpenAI)
- GPT-3.5 Turbo (OpenAI)
- Llama 3.3 70B Turbo (Together.ai)
- Llama 3.1 8B Instruct Turbo (Together.ai)
- Qwen3 235B A22B FP8 Throughput (Together.ai)
- Qwen 2.5 72B Instruct Turbo (Together.ai)
- DeepSeek R1 (Together.ai)
- DeepSeek V3 (Together.ai)
- Perplexity AI R1-1776 (Together.ai)
- Magistral Small 2506 (Together.ai)
- Marin 8B Instruct (Together.ai)
- Mistral Small 3 Instruct (24B) (Together.ai)
- Llama 3.1 Nemotron 70B (NVIDIA) (Together.ai)
- Arcee AI Virtuoso Medium (Together.ai)
- Arcee AI Maestro (Together.ai)
- Arcee AI Blitz (Together.ai)
- Llama 3.1 405B Instruct Turbo (Together.ai)
- Llama 3.2 3B Instruct Turbo (Together.ai)
- Llama 3 8B Instruct Lite (Together.ai)
- Llama 3 8B Instruct Reference (Together.ai)
- Llama 3 70B Instruct Reference (Together.ai)
- Gemma 2 27B (Together.ai)
- Mistral 7B Instruct v0.3 (Together.ai)
- Nous Hermes 2 - Mixtral 8x7B-DPO (Together.ai)

> **Note:** The list of models is maintained in `src/lib/models.ts` for easy updates.

## 🛠️ Technologies Used

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS, Tailwind Typography
- **AI Integration**: LangChain, OpenAI API, Together.ai API
- **State Management**: React Context API
- **Icons**: Lucide React
- **Markdown**: React Markdown with GitHub Flavored Markdown
- **Architecture**: Service-oriented with custom hooks

## 🐛 Troubleshooting

### **Common Issues**

1. **"Configuration Error"**: Make sure your OpenAI and Together.ai API keys are correctly set in `.env.local`
2. **"API Quota Exceeded"**: Check your OpenAI and Together.ai account usage and billing
3. **"Network Error"**: Verify your internet connection and try again
4. **"Context Error"**: Ensure components are wrapped in `ChatProvider`

### **Getting Help**

- Check the browser console for detailed error messages
- Verify your OpenAI and Together.ai API keys are valid and have sufficient credits
- Ensure all environment variables are properly set
- Review the Context and Service implementations for debugging

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Follow the established architecture patterns
4. Add tests for new functionality
5. Commit your changes (`git commit -m 'Add amazing feature'`)
6. Push to the branch (`git push origin feature/amazing-feature`)
7. Open a Pull Request

### **Code Style**

- Follow TypeScript best practices
- Use the established service/hook patterns
- Maintain separation of concerns
- Add proper error handling
- Include JSDoc comments for complex functions

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🆘 Support

If you encounter any issues or have questions:

1. Check the troubleshooting section above
2. Review the code architecture documentation
3. Open an issue on GitHub with detailed information
4. Include error messages and steps to reproduce

---

**Built with ❤️ using modern React patterns and best practices**
