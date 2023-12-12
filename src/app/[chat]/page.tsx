"use client";
import { ChatContext } from "@/components/chat-provider";
import ChatScreen from "@/components/chat-screen";
import { ChatIdContext } from "@/components/chatid-provider";
import { MessagesContext } from "@/components/messages-provider";
import { MessageType } from "@/types/MessageType";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";

export default function Home() {
  const queryClient = new QueryClient();
  const [isChatPresent, setIsChatPresent] = useState(false);
  const [chatId, setChatId] = useState("");
  const [messages, setMessages] = useState<MessageType[]>([]);
  return (
    <QueryClientProvider client={queryClient}>
      <ChatContext.Provider value={{ isChatPresent, setIsChatPresent }}>
        <ChatIdContext.Provider value={{ chatId, setChatId }}>
          <MessagesContext.Provider value={{ messages, setMessages }}>
            <ChatScreen />
          </MessagesContext.Provider>
        </ChatIdContext.Provider>
      </ChatContext.Provider>
    </QueryClientProvider>
  );
}
