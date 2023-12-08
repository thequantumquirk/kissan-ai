"use client";

import { useContext, useEffect, useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { SendHorizonal } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import Loader from "./ui/loader";
import { MessageType } from "@/types/MessageType";
import MessagesSection from "./messages";

import axios from "axios";
import { ChatIdContext } from "./chatid-provider";
import { ChatContext } from "./chat-provider";

export default function PromptInput() {
  const [prompt, setPrompt] = useState("");
  const { chatId, setChatId } = useContext(ChatIdContext);
  const handlePrompt = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPrompt(e.target.value);
  };
  const [chatResponse, setChatResponse] = useState<MessageType[] | null>(null);
  const { isChatPresent, setIsChatPresent } = useContext(ChatContext);

  const handleChatPresenceChange = () => {
    setIsChatPresent(true);
  };
  const sendReqQuery = useMutation({
    mutationFn: async (text: string) => {
      let userMessage: MessageType = {
        id: crypto.randomUUID(),
        role: "user",
        content: text,
      };
      if (chatResponse) {
        setChatResponse((prev: any) => {
          const updatedChatResponse = [...prev, userMessage];
          localStorage.setItem(chatId, JSON.stringify(updatedChatResponse));
          return updatedChatResponse;
        });
      } else {
        handleChatPresenceChange();
        setChatResponse([userMessage]);
        localStorage.setItem(chatId, JSON.stringify([userMessage]));
      }
      setPrompt("");
      const { data } = await axios.post(
        "https://api-v2.longshot.ai/custom/api/generate/instruct",
        {
          text,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_LONGSHOT_KEY}`,
          },
        }
      );
      return data;
    },
    onSuccess: (data) => {
      let message: MessageType = {
        id: crypto.randomUUID(),
        role: "assistant",
        content: data.copies[0].content,
      };
      setChatResponse((prev: any) => {
        console.log("Hello");
        const updatedChatResponse = [...prev, message];
        localStorage.setItem(chatId, JSON.stringify(updatedChatResponse));
        return updatedChatResponse;
      });
    },
  });

  useEffect(() => {
    let savedMessages = localStorage.getItem(chatId);
    if (savedMessages) {
      handleChatPresenceChange();
      setChatResponse(JSON.parse(savedMessages));
    } else {
      setChatResponse(null);
    }
  }, [chatId]);

  return (
    <>
      {chatResponse && <MessagesSection messages={chatResponse} />}
      <div className="flex gap-2 items-center">
        <Input
          className="w-[40vw]"
          placeholder="Enter your Prompt"
          value={prompt}
          onChange={handlePrompt}
        />
        <Button
          disabled={sendReqQuery.isPending}
          onClick={() => sendReqQuery.mutate(prompt)}
        >
          {sendReqQuery.isPending ? <Loader /> : <SendHorizonal />}
        </Button>
      </div>
    </>
  );
}
