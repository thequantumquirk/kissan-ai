import { useContext } from "react";
import { ThemeToggle } from "./ui/theme-toggle";
import Image from "next/image";
import ChatbotSidebar from "./sidebar";
import PromptInput from "./prompt-input";
import { ChatContext } from "./chat-provider";
import MessagesSection from "./messages";
import { MessagesContext } from "./messages-provider";

export default function ChatScreen() {
  const { isChatPresent } = useContext(ChatContext);
  const { messages } = useContext(MessagesContext);
  return (
    <main className="flex h-screen flex-col items-center justify-center gap-4 lg:gap-8 px-4 py-6 lg:p-12">
      <div className="absolute right-5 top-5">
        <ThemeToggle />
      </div>
      {!isChatPresent ? (
        <section className="flex flex-col justify-between items-center">
          <Image src="/logo.svg" alt="Logo" height={100} width={100} />
          <h1 className="text-3xl lg:text-4xl font-bold">
            <span className="text-primary">Agritalk.ai</span>
          </h1>
          <h4>
            Ask your <span className="text-primary">queries</span> and get it{" "}
            <span className="text-primary">answered</span>
          </h4>
        </section>
      ) : (
        <div className="flex gap-2 items-center">
          <div className="hidden lg:block">
            <Image src="/logo.svg" alt="Logo" height={50} width={50} />
          </div>
          <h1 className="text-xl 2xl:text-4xl w-full font-bold">
            <span className="text-primary">Agritalk</span>.ai
          </h1>
        </div>
      )}
      <ChatbotSidebar />
      {messages.length > 0 && (
        <section className="grow w-full h-full bg-foreground/10 lg:px-8 px-2 py-4 rounded-lg">
          <MessagesSection messages={messages} />
        </section>
      )}
      <PromptInput />
    </main>
  );
}
