import { useContext } from "react";
import { ThemeToggle } from "./ui/theme-toggle";
import Image from "next/image";
import ChatbotSidebar from "./sidebar";
import PromptInput from "./prompt-input";
import { ChatContext } from "./chat-provider";

export default function ChatScreen() {
  const { isChatPresent, setIsChatPresent } = useContext(ChatContext);
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-4 lg:gap-8 p-4 lg:p-12 lg:mt-0 mt-8">
      <div className="absolute right-5 top-5">
        <ThemeToggle />
      </div>
      {!isChatPresent ? (
        <section className="flex flex-col justify-between items-center h-full">
          <Image src="/logo.svg" alt="Logo" height={100} width={100} />
          <h1 className="text-3xl lg:text-4xl font-bold">
            The <span className="text-primary">Omnis</span> Chatbot
          </h1>
          <h4>
            Ask your <span className="text-primary">queries</span> and get it{" "}
            <span className="text-primary">answered</span>
          </h4>
        </section>
      ) : (
        <div className="flex gap-2 items-center">
          <Image src="/logo.svg" alt="Logo" height={50} width={50} />
          <h1 className="text-2xl lg:text-4xl font-bold">
            The <span className="text-primary">Omnis</span> Chatbot
          </h1>
        </div>
      )}
      <ChatbotSidebar />
      <PromptInput />
    </main>
  );
}
