import type { Metadata } from "next";
import "./globals.css";
import { ChatProvider } from "@/contexts/ChatContext";

export const metadata: Metadata = {
  title: "BotChat - AI-Powered Chat Application",
  description: "A modern chat application powered by OpenAI and LangChain",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased w-screen h-screen">
        <ChatProvider>{children}</ChatProvider>
      </body>
    </html>
  );
}
