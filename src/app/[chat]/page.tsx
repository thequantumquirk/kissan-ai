"use client";
import { ChatContext } from "@/components/chat-provider";
import ChatScreen from "@/components/chat-screen";
import { ChatIdContext } from "@/components/chatid-provider";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";

export default function Home() {
  const queryClient = new QueryClient();
  const [isChatPresent, setIsChatPresent] = useState(false);
  const [chatId, setChatId] = useState("");
  return (
    <QueryClientProvider client={queryClient}>
      <ChatContext.Provider value={{ isChatPresent, setIsChatPresent }}>
        <ChatIdContext.Provider value={{ chatId, setChatId }}>
          <ChatScreen />
        </ChatIdContext.Provider>
      </ChatContext.Provider>
    </QueryClientProvider>
  );
}
