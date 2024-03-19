"use client";

import { useContext, useEffect, useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { SendHorizonal } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import Loader from "./ui/loader";
import { MessageType } from "@/types/MessageType";
import axios from "axios";
import { AxiosError } from "axios";
import { ChatIdContext } from "./chatid-provider";
import { ChatContext } from "./chat-provider";
import { useToast } from "@/components/ui/use-toast";
import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import rehypeSanitize from "rehype-sanitize";
import rehypeStringify from "rehype-stringify";
import { MessagesContext } from "./messages-provider";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";
import { supabase } from "@/supabase";
import { UserIdContext } from "./userid-provider";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

export default function PromptInput() {
  const { toast } = useToast();
  const [prompt, setPrompt] = useState("");
  const { setMessages } = useContext(MessagesContext);
  const { chatId } = useContext(ChatIdContext);
  const { isChatPresent, setIsChatPresent } = useContext(ChatContext);
  const { userId } = useContext(UserIdContext);
  const [language, setLanguage] = useState("English");
  const handlePrompt = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPrompt(e.target.value);
  };

  const handleChatPresenceChange = (val: boolean) => {
    setIsChatPresent(val);
  };

  const insertMessage = async (text: string, role: "user" | "assistant") => {
    const resp = await supabase.from("chats").insert({
      user_id: userId,
      text,
      role,
      chat_id: chatId,
    });
    const message: MessageType = {
      id: crypto.randomUUID(),
      role,
      content: text,
    };
    setMessages((prev: any) => {
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
      let inputForm = new FormData();
      inputForm.append("language", language);
      inputForm.append("question", text);
      handleChatPresenceChange(true);
      insertMessage(text, "user");
      const { data } = await axios.post(
        "https://api1.kissangpt.com/v1/inference/text/web",
        inputForm,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      return data;
    },
    onSuccess: async (data) => {
      let message = await renderMarkdown(data.answer);
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
          title: "An error occoured",
          description: detail,
        });
      }
    },
  });

  useEffect(() => {
    if (chatId) {
      let savedMessages = localStorage.getItem(chatId);
      if (savedMessages && savedMessages?.length > 0) {
        handleChatPresenceChange(true);
        setMessages(JSON.parse(savedMessages));
      } else {
        handleChatPresenceChange(false);
        setMessages([]);
      }
    }
  }, [chatId]);

  return (
    <>
      <div>
        <div className="flex gap-1 items-center w-32 mx-auto my-2">
          <span>Language: </span>
          <Select value={language} onValueChange={(e) => setLanguage(e)}>
            <SelectTrigger>
              <SelectValue placeholder={`Select Language`} />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Language</SelectLabel>
                <SelectItem value="English">English</SelectItem>
                <SelectItem value="Tamil">தமிழ்</SelectItem>
                <SelectItem value="Hindi">हिन्दी</SelectItem>
                <SelectItem value="Gujarati">ગુજરાતી</SelectItem>
                <SelectItem value="Telugu">తెలుగు</SelectItem>
                <SelectItem value="Bangla">বাংলা</SelectItem>
                <SelectItem value="Marathi">मराठी</SelectItem>
                <SelectItem value="Kannada">ಕನ್ನಡ</SelectItem>
                <SelectItem value="Punjabi">ਪੰਜਾਬੀ</SelectItem>
                <SelectItem value="Malayalam">മലയാളം</SelectItem>
                <SelectItem value="Spanish">Español</SelectItem>
                <SelectItem value="Portuguese">Português</SelectItem>
                <SelectItem value="Japanese">日本語</SelectItem>
                <SelectItem value="Indonesian">Indonesia</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
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
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                onClick={() =>
                  !sendReqQuery.isPending &&
                  prompt &&
                  sendReqQuery.mutate(prompt)
                }
              >
                {sendReqQuery.isPending ? <Loader /> : <SendHorizonal />}
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              {sendReqQuery.isPending
                ? "Please wait till we fetch your query"
                : "Send your Query"}
            </TooltipContent>
          </Tooltip>
        </div>
      </div>
    </>
  );
}
