"use client";
import { ChatContext } from "@/components/chat-provider";
import { ChatIdContext } from "@/components/chatid-provider";
import PromptInput from "@/components/prompt-input";
import ChatbotSidebar from "@/components/sidebar";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { UserIdContext } from "@/components/userid-provider";
import { supabase } from "@/supabase";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Image from "next/image";
import { useContext, useEffect, useState } from "react";

export default function Home() {
  const queryClient = new QueryClient();
  const [isChatPresent, setIsChatPresent] = useState(false);
  const [chatId, setChatId] = useState("");
  const { setUserId } = useContext(UserIdContext);
  const checkUser = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    console.log("user", user);
    setUserId(user?.id || "");
  };
  useEffect(() => {
    checkUser();
  });
  return (
    <QueryClientProvider client={queryClient}>
      <ChatContext.Provider value={{ isChatPresent, setIsChatPresent }}>
        <ChatIdContext.Provider value={{ chatId, setChatId }}>
          <main className="flex min-h-screen flex-col items-center justify-center gap-4 lg:gap-8 p-4 lg:p-12 lg:mt-0 mt-8">
            <div className="absolute right-5 top-5">
              <ThemeToggle />
            </div>
            {!isChatPresent ? (
              <section className="flex flex-col justify-between items-center h-full">
                <Image src="/logo.svg" alt="Logo" height={100} width={100} />
                <h1 className="text-3xl lg:text-4xl font-bold">
                  <span className="text-primary">Agritalk</span> AI
                </h1>
                <h4>
                  Ask your <span className="text-primary">queries</span> and get
                  it <span className="text-primary">answered</span>
                </h4>
              </section>
            ) : (
              <div className="flex gap-2 items-center">
                <Image src="/logo.svg" alt="Logo" height={50} width={50} />
                <h1 className="text-2xl lg:text-4xl font-bold">
                  The <span className="text-primary">Agritalk</span> AI
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
