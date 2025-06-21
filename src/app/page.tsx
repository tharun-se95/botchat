"use client";
import { useState, useEffect } from "react";
import { ChatLayout } from "@/components/ChatLayout";
import { Sidebar } from "@/components/Sidebar";
import { Menu, Pencil, Search, Library } from "lucide-react";
import { Tooltip } from "@/components/Tooltip";

interface Message {
  sender: "user" | "bot";
  text: string;
}

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  useEffect(() => {
    const savedMessages = localStorage.getItem("chatMessages");
    if (savedMessages) {
      setMessages(JSON.parse(savedMessages));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("chatMessages", JSON.stringify(messages));
  }, [messages]);

  const generateBotResponse = (userMessage: string): string => {
    const lowerMessage = userMessage.toLowerCase();

    // CSS/Tailwind-related responses
    if (
      lowerMessage.includes("prose") ||
      lowerMessage.includes("classname") ||
      lowerMessage.includes("tailwind") ||
      lowerMessage.includes("css")
    ) {
      return `Great question! Let me explain Tailwind CSS's **prose** utilities:

## What is \`prose\` in Tailwind CSS?

**Prose** is a set of typography utilities in Tailwind CSS that provides beautiful, readable text styling for content-heavy pages like blog posts, articles, and documentation.

### **Basic Usage**

\`\`\`html
<!-- Basic prose styling -->
<article class="prose">
  <h1>Your Article Title</h1>
  <p>This paragraph will have beautiful typography...</p>
  <h2>Subheading</h2>
  <p>More content with proper spacing and readability.</p>
</article>
\`\`\`

### **Prose Variants**

\`\`\`html
<!-- Different prose sizes -->
<div class="prose prose-sm">Small text</div>
<div class="prose prose-base">Default size</div>
<div class="prose prose-lg">Large text</div>
<div class="prose prose-xl">Extra large</div>
<div class="prose prose-2xl">2XL size</div>
\`\`\`

### **Prose Colors**

\`\`\`html
<!-- Color variants -->
<div class="prose prose-gray">Gray prose</div>
<div class="prose prose-slate">Slate prose</div>
<div class="prose prose-zinc">Zinc prose</div>
<div class="prose prose-neutral">Neutral prose</div>
<div class="prose prose-stone">Stone prose</div>
<div class="prose prose-red">Red prose</div>
<div class="prose prose-orange">Orange prose</div>
<div class="prose prose-amber">Amber prose</div>
<div class="prose prose-yellow">Yellow prose</div>
<div class="prose prose-lime">Lime prose</div>
<div class="prose prose-green">Green prose</div>
<div class="prose prose-emerald">Emerald prose</div>
<div class="prose prose-teal">Teal prose</div>
<div class="prose prose-cyan">Cyan prose</div>
<div class="prose prose-sky">Sky prose</div>
<div class="prose prose-blue">Blue prose</div>
<div class="prose prose-indigo">Indigo prose</div>
<div class="prose prose-violet">Violet prose</div>
<div class="prose prose-purple">Purple prose</div>
<div class="prose prose-fuchsia">Fuchsia prose</div>
<div class="prose prose-pink">Pink prose</div>
<div class="prose prose-rose">Rose prose</div>
\`\`\`

### **What Prose Styles**

The \`prose\` class automatically applies:
- **Typography scale**: Proper heading sizes and line heights
- **Spacing**: Consistent margins and padding
- **Lists**: Styled ordered and unordered lists
- **Links**: Proper link styling with hover states
- **Code blocks**: Syntax highlighting and formatting
- **Blockquotes**: Styled quote blocks
- **Tables**: Responsive table styling

### **Customization**

\`\`\`css
/* Custom prose styles */
.prose-custom {
  @apply prose prose-lg prose-blue max-w-none;
}

.prose-custom h1 {
  @apply text-4xl font-bold text-gray-900;
}

.prose-custom p {
  @apply text-gray-700 leading-relaxed;
}
\`\`\`

### **Common Use Cases**

1. **Blog Posts**: Perfect for article content
2. **Documentation**: Great for technical docs
3. **Newsletters**: Email content styling
4. **Markdown Rendering**: Convert markdown to styled HTML
5. **Rich Text Editors**: WYSIWYG editor output

**Pro Tip**: Prose utilities are part of the \`@tailwindcss/typography\` plugin, so make sure you have it installed and configured in your \`tailwind.config.js\`!`;
    }

    // Code-related responses
    if (
      lowerMessage.includes("code") ||
      lowerMessage.includes("function") ||
      lowerMessage.includes("javascript")
    ) {
      return `Here's an example of a JavaScript function that demonstrates modern ES6+ syntax:

\`\`\`javascript
const processData = async (data) => {
  try {
    const result = await fetch('/api/data', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data)
    });
    
    if (!result.ok) {
      throw new Error('Network response was not ok');
    }
    
    return await result.json();
  } catch (error) {
    console.error('Error processing data:', error);
    throw error;
  }
};

// Usage example
const handleSubmit = async (formData) => {
  const processed = await processData(formData);
  console.log('Processed result:', processed);
};
\`\`\`

This function includes:
- **Async/await** for handling promises
- **Error handling** with try-catch
- **Modern fetch API** usage
- **Proper error propagation**

You can use this pattern for any API calls in your application.`;
    }

    // List-related responses
    if (
      lowerMessage.includes("list") ||
      lowerMessage.includes("steps") ||
      lowerMessage.includes("how to")
    ) {
      return `Here's a step-by-step guide to accomplish that:

## Step-by-Step Process

1. **Preparation Phase**
   - Gather all necessary materials
   - Set up your development environment
   - Review requirements and documentation

2. **Implementation Phase**
   - Start with a basic structure
   - Add core functionality incrementally
   - Test each component as you build

3. **Testing Phase**
   - Write unit tests for individual functions
   - Perform integration testing
   - Conduct user acceptance testing

4. **Deployment Phase**
   - Prepare production environment
   - Deploy with proper monitoring
   - Monitor performance and user feedback

5. **Maintenance Phase**
   - Regular updates and bug fixes
   - Performance optimization
   - Feature enhancements based on feedback

**Pro Tips:**
- Always document your code
- Use version control for all changes
- Keep backups of important data
- Test thoroughly before deployment`;
    }

    // Explanation responses
    if (
      lowerMessage.includes("explain") ||
      lowerMessage.includes("what is") ||
      lowerMessage.includes("why")
    ) {
      return `Great question! Let me explain this concept in detail:

## Understanding the Concept

**What it is:**
This is a fundamental concept in modern web development that combines multiple technologies to create dynamic, interactive applications.

**Why it matters:**
- **Performance**: Improves loading times and user experience
- **Scalability**: Allows applications to handle more users efficiently
- **Maintainability**: Makes code easier to understand and modify
- **User Experience**: Provides smoother interactions and better responsiveness

**How it works:**
The system operates on a layered architecture where each component has a specific responsibility. Data flows through these layers in a predictable manner, making the application more reliable and easier to debug.

**Real-world applications:**
- E-commerce platforms
- Social media applications
- Content management systems
- Real-time collaboration tools

**Best practices:**
1. Follow the single responsibility principle
2. Implement proper error handling
3. Use meaningful naming conventions
4. Write comprehensive documentation
5. Regular code reviews and testing

This approach has become industry standard because it provides a balance between flexibility and maintainability.`;
    }

    // Technical deep-dive responses
    if (
      lowerMessage.includes("technical") ||
      lowerMessage.includes("architecture") ||
      lowerMessage.includes("design")
    ) {
      return `Let me dive deep into the technical architecture and design patterns:

## Technical Architecture Overview

### **System Design Principles**

**1. Separation of Concerns**
\`\`\`typescript
interface UserService {
  getUser(id: string): Promise<User>;
  updateUser(id: string, data: Partial<User>): Promise<User>;
  deleteUser(id: string): Promise<void>;
}

interface DataRepository {
  find(id: string): Promise<Entity>;
  save(entity: Entity): Promise<Entity>;
  delete(id: string): Promise<void>;
}
\`\`\`

**2. Dependency Injection Pattern**
\`\`\`typescript
class UserController {
  constructor(
    private userService: UserService,
    private logger: Logger,
    private validator: Validator
  ) {}
  
  async handleRequest(req: Request): Promise<Response> {
    try {
      const user = await this.userService.getUser(req.params.id);
      return new Response(JSON.stringify(user));
    } catch (error) {
      this.logger.error('Failed to get user', error);
      return new Response('User not found', { status: 404 });
    }
  }
}
\`\`\`

### **Performance Considerations**

- **Caching Strategy**: Implement Redis for session storage
- **Database Optimization**: Use connection pooling and query optimization
- **CDN Integration**: Serve static assets globally
- **Load Balancing**: Distribute traffic across multiple servers

### **Security Measures**

1. **Authentication**: JWT tokens with refresh mechanism
2. **Authorization**: Role-based access control (RBAC)
3. **Input Validation**: Sanitize all user inputs
4. **Rate Limiting**: Prevent abuse and DDoS attacks
5. **HTTPS**: Encrypt all data in transit

This architecture ensures scalability, maintainability, and security.`;
    }

    // Simple conversational responses
    if (lowerMessage.includes("hello") || lowerMessage.includes("hi")) {
      return `Hello! 👋 I'm here to help you with any questions you might have. Whether you need help with coding, want to discuss technical concepts, or just want to chat, I'm ready to assist!

What would you like to explore today?`;
    }

    // Default response for other messages
    return `I understand you're asking about "${userMessage}". Let me provide you with a comprehensive response:

## Key Points to Consider

**Main Concept:**
This involves understanding the fundamental principles and applying them in practical scenarios.

**Important Factors:**
- **Context matters**: Always consider the specific situation
- **Best practices**: Follow established guidelines and patterns
- **Continuous learning**: Stay updated with latest developments
- **Practical application**: Theory is important, but practice makes perfect

**Implementation Tips:**
1. Start with a clear plan
2. Break down complex problems into smaller parts
3. Test your assumptions
4. Iterate and improve based on feedback
5. Document your process and decisions

**Common Challenges:**
- Overthinking the solution
- Not considering edge cases
- Skipping the planning phase
- Ignoring feedback and iteration

Remember, the best approach is often the simplest one that meets your requirements. Don't over-engineer solutions unless necessary!`;
  };

  const handleSend = (message: string) => {
    setMessages((prev) => [...prev, { sender: "user", text: message }]);
    setIsTyping(true);

    // Simulate typing delay based on response length
    const botResponse = generateBotResponse(message);
    const typingDelay = Math.min(1000 + botResponse.length * 10, 3000); // 1-3 seconds

    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          sender: "bot",
          text: botResponse,
        },
      ]);
      setIsTyping(false);
    }, typingDelay);
  };

  return (
    <main className="w-screen h-screen bg-background flex">
      <div
        className={`h-full bg-sidebar transition-all duration-300 overflow-hidden ${
          isSidebarOpen ? "w-[15%]" : "w-0"
        }`}
      >
        <Sidebar setIsOpen={setIsSidebarOpen} />
      </div>

      <div className="flex-1 flex">
        {!isSidebarOpen && (
          <div className="bg-sidebar p-2 h-full flex flex-col items-center space-y-4">
            <Tooltip content="Open sidebar" position="right">
              <button
                className="p-2 hover:bg-surface rounded-full"
                onClick={() => setIsSidebarOpen(true)}
              >
                <Menu className="h-5 w-5" />
              </button>
            </Tooltip>
            <Tooltip content="New Chat" position="right">
              <button className="p-2 rounded-lg hover:bg-surface">
                <Pencil className="h-5 w-5" />
              </button>
            </Tooltip>
            <Tooltip content="Search chats" position="right">
              <button className="p-2 rounded-lg hover:bg-surface">
                <Search className="h-5 w-5" />
              </button>
            </Tooltip>
            <Tooltip content="Library" position="right">
              <button className="p-2 rounded-lg hover:bg-surface">
                <Library className="h-5 w-5" />
              </button>
            </Tooltip>
          </div>
        )}
        <ChatLayout
          messages={messages}
          onSend={handleSend}
          isTyping={isTyping}
          disabled={isTyping}
        />
      </div>
    </main>
  );
}
