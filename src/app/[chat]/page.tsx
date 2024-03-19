"use client";
import { ChatContext } from "@/components/chat-provider";
import ChatScreen from "@/components/chat-screen";
import { ChatIdContext } from "@/components/chatid-provider";
import { MessagesContext } from "@/components/messages-provider";
import { UserIdContext } from "@/components/userid-provider";
import { supabase } from "@/supabase";
import { MessageType } from "@/types/MessageType";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useContext, useEffect, useState } from "react";

export default function Home() {
  const queryClient = new QueryClient();
  const [isChatPresent, setIsChatPresent] = useState(false);
  const [chatId, setChatId] = useState("");
  const [messages, setMessages] = useState<MessageType[]>([]);
  const { userId, setUserId } = useContext(UserIdContext);
  const checkUser = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    console.log("user", user.id);
    setUserId(user?.id || "");
  };
  useEffect(() => {
    checkUser();
  });
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
