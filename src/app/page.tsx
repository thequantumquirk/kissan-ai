"use client";
import { ChatContext } from "@/components/chat-provider";
import { ChatIdContext } from "@/components/chatid-provider";
import PromptInput from "@/components/prompt-input";
import ChatbotSidebar from "@/components/sidebar";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Image from "next/image";
import { useState } from "react";

export default function Home() {
  const queryClient = new QueryClient();
  const [isChatPresent, setIsChatPresent] = useState(false);
  const [chatId, setChatId] = useState("");
  return (
    <QueryClientProvider client={queryClient}>
      <ChatContext.Provider value={{ isChatPresent, setIsChatPresent }}>
        <ChatIdContext.Provider value={{ chatId, setChatId }}>
          <main className="flex min-h-screen flex-col items-center justify-center gap-8 p-12">
            <div className="absolute right-5 top-5">
              <ThemeToggle />
            </div>
            {!isChatPresent ? (
              <section className="flex flex-col justify-between items-center h-full">
                <Image src="/logo.svg" alt="Logo" height={100} width={100} />
                <h1 className="text-4xl font-bold">
                  The <span className="text-primary">Omnis</span> Chatbot
                </h1>
                <h4>
                  Ask your <span className="text-primary">queries</span> and get
                  it <span className="text-primary">answered</span>
                </h4>
              </section>
            ) : (
              <div className="flex gap-2">
                <Image src="/logo.svg" alt="Logo" height={50} width={50} />
                <h1 className="text-4xl font-bold">
                  The <span className="text-primary">Omnis</span> Chatbot
                </h1>
              </div>
            )}
            <ChatbotSidebar />
            <PromptInput />
          </main>
        </ChatIdContext.Provider>
      </ChatContext.Provider>
    </QueryClientProvider>
  );
}
