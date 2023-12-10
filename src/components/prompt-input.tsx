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
import { AxiosError } from "axios";
import { ChatIdContext } from "./chatid-provider";
import { ChatContext } from "./chat-provider";
import { useToast } from "@/components/ui/use-toast";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "./ui/hover-card";
import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import rehypeSanitize from "rehype-sanitize";
import rehypeStringify from "rehype-stringify";

export default function PromptInput() {
  const { toast } = useToast();
  const [prompt, setPrompt] = useState("");
  const [chatResponse, setChatResponse] = useState<MessageType[] | null>(null);
  const { chatId } = useContext(ChatIdContext);
  const { isChatPresent, setIsChatPresent } = useContext(ChatContext);

  const handlePrompt = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPrompt(e.target.value);
  };

  const handleChatPresenceChange = (val: boolean) => {
    setIsChatPresent(val);
  };

  const insertMessage = (text: string, role: "user" | "assistant") => {
    const message: MessageType = {
      id: crypto.randomUUID(),
      role,
      content: text,
    };
    setChatResponse((prev: any) => {
      const updatedChatResponse = prev ? [...prev, message] : [message];
      localStorage.setItem(chatId, JSON.stringify(updatedChatResponse));
      return updatedChatResponse;
    });
    if (role === "user") {
      setPrompt("");
    }
  };

  const renderMarkdown = async (markdown: string) => {
    const file = await unified()
      .use(remarkParse)
      .use(remarkRehype)
      .use(rehypeSanitize)
      .use(rehypeStringify)
      .process(markdown);

    return String(file);
  };

  const sendReqQuery = useMutation({
    mutationFn: async (text: string) => {
      handleChatPresenceChange(true);
      insertMessage(text, "user");
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
    onSuccess: async (data) => {
      let message = await renderMarkdown(data.copies[0].content);
      insertMessage(message, "assistant");
    },
    onError: (error) => {
      if (error) {
        const axiosError = error as AxiosError;
        const { detail } =
          (axiosError.response?.data as {
            detail: string;
          }) || "Unknown error";
        toast({
          title: "An error occured.",
          description: detail,
        });
      }
    },
  });

  useEffect(() => {
    if (chatId) {
      let savedMessages = localStorage.getItem(chatId);
      if (savedMessages) {
        handleChatPresenceChange(true);
        setChatResponse(JSON.parse(savedMessages));
      } else {
        handleChatPresenceChange(false);
        setChatResponse(null);
      }
    }
  }, [chatId]);

  return (
    <>
      {chatResponse && <MessagesSection messages={chatResponse} />}
      <div className="flex gap-2 items-center">
        <Input
          className="w-[70vw] lg:w-[40vw]"
          placeholder="Enter your Prompt"
          value={prompt}
          onChange={handlePrompt}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !sendReqQuery.isPending && prompt) {
              sendReqQuery.mutate(prompt);
            }
          }}
        />
        <HoverCard>
          <HoverCardTrigger asChild>
            <Button
              onClick={() =>
                !sendReqQuery.isPending && prompt && sendReqQuery.mutate(prompt)
              }
            >
              {sendReqQuery.isPending ? <Loader /> : <SendHorizonal />}
            </Button>
          </HoverCardTrigger>
          <HoverCardContent>
            {sendReqQuery.isPending
              ? "Please wait till we fetch your query"
              : "Send your Query"}
          </HoverCardContent>
        </HoverCard>
      </div>
    </>
  );
}
