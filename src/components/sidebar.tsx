"use client";
import {
  Check,
  Menu,
  MessagesSquare,
  Pencil,
  Plus,
  Trash,
  X,
} from "lucide-react";
import { useState, useEffect, useContext } from "react";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
} from "./ui/dialog";
import { DialogTrigger } from "@radix-ui/react-dialog";
import { usePathname } from "next/navigation";
import { ChatIdContext } from "./chatid-provider";
import { ChatType } from "@/types/ChatType";
import { Input } from "./ui/input";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "./ui/hover-card";
import { Sheet, SheetClose, SheetContent, SheetTrigger } from "./ui/sheet";

const ChatbotSidebar = () => {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [chats, setChats] = useState<ChatType[] | []>([]);
  const [renameChatId, setRenameChatId] = useState<string>("");
  const [chatName, setChatName] = useState<string>("");
  const { setChatId } = useContext(ChatIdContext);

  const handleOpenSidebar = () => setIsOpen(true);
  const handleCloseSidebar = () => setIsOpen(false);
  const handleChatRename = (e: React.ChangeEvent<HTMLInputElement>) => {
    setChatName(e.target.value);
  };

  const renameChat = (id: string) => {
    if (chatName) {
      setChats((prevChats: any) => {
        const updatedChats = prevChats.map((chat: any) => {
          if (chat.key === id) {
            chat.name = chatName;
          }
          return chat;
        });
        localStorage.setItem("savedChats", JSON.stringify(updatedChats));
        return updatedChats;
      });
    }
    setRenameChatId("");
  };

  const createChat = () => {
    let newChat = {
      key: crypto.randomUUID(),
      name: "New Chat",
    };
    if (chats) {
      setChats((prev: any) => {
        const updatedChats = [...prev, newChat];
        localStorage.setItem("savedChats", JSON.stringify(updatedChats));
        return updatedChats;
      });
    } else {
      setChats([newChat]);
      localStorage.setItem("savedChats", JSON.stringify([newChat]));
    }
    updateChatId(newChat.key);
  };

  const updateChatId = (id: string) => {
    window.location.href = `/${id}`;
    setChatId(id);
  };

  const deleteChat = (id: string) => {
    setChats((prevChats: any) => {
      const updatedChats = prevChats.filter((chat: any) => chat.key !== id);
      localStorage.setItem("savedChats", JSON.stringify(updatedChats));
      window.location.href = `/`;
      return updatedChats;
    });
  };

  useEffect(() => {
    let savedChats: ChatType[] | [] = JSON.parse(
      localStorage.getItem("savedChats") || "[]"
    );
    let chatId = pathname.replace("/", "");
    let chatIdExists = savedChats.some((chat: ChatType) => chat.key === chatId);
    if (savedChats.length > 0) {
      setChats(savedChats);
      setChatId(chatId);
    } else {
      createChat();
    }
    if (chats.length > 0 && !chatIdExists) {
      updateChatId(chats[0].key);
    }
  }, [chats.length]);

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        handleCloseSidebar();
      }
    };
    document.addEventListener("keydown", handleKeyPress);
    return () => {
      document.removeEventListener("keydown", handleKeyPress);
    };
  }, []);

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button className={`absolute px-3 top-5 left-5`}>
          <Menu size={20} />
        </Button>
      </SheetTrigger>
      <SheetContent side={"left"}>
        <Button
          className="flex gap-2 items-center justify-center w-full"
          onClick={createChat}
        >
          <Plus />
          Create New Chat
        </Button>
        {chats && (
          <>
            <p className="font-bold my-1">Your chats</p>
            <div className="flex flex-col gap-2 my-2 w-full h-[92vh] overflow-y-scroll">
              {chats.map((chat: ChatType) => (
                <div
                  className="flex items-center justify-between gap-2 rounded-lg bg-card px-3 py-4"
                  key={chat.key}
                >
                  {renameChatId !== chat.key ? (
                    <a className="flex gap-3" href={`/${chat.key}`}>
                      <MessagesSquare />
                      <span>{chat.name}</span>
                    </a>
                  ) : (
                    <div className="flex items-center gap-2">
                      <div>
                        <MessagesSquare />
                      </div>
                      <Input
                        defaultValue={chat.name}
                        onChange={handleChatRename}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            renameChat(chat.key);
                          }
                        }}
                      />
                      <button onClick={() => renameChat(chat.key)}>
                        <Check />
                      </button>
                    </div>
                  )}
                  <div className="flex gap-4 items-center">
                    <HoverCard>
                      <HoverCardTrigger asChild>
                        <button
                          className="flex justify-end"
                          onClick={() => setRenameChatId(chat.key)}
                        >
                          <Pencil
                            size={20}
                            className="opacity-50 hover:opacity-100 transition-all"
                          />
                        </button>
                      </HoverCardTrigger>
                      <HoverCardContent>
                        Rename the Chat Instance
                      </HoverCardContent>
                    </HoverCard>
                    <Dialog>
                      <HoverCard>
                        <HoverCardTrigger asChild>
                          <DialogTrigger asChild>
                            <button>
                              <Trash
                                size={20}
                                className="opacity-50 hover:opacity-100 transition-all"
                              />
                            </button>
                          </DialogTrigger>
                        </HoverCardTrigger>
                        <HoverCardContent>
                          Delete the Chat Instance
                        </HoverCardContent>
                      </HoverCard>
                      <DialogContent>
                        <DialogHeader>
                          <h2>Do you want to delete the Chat?</h2>
                        </DialogHeader>
                        <DialogFooter>
                          <div className="flex gap-2">
                            <DialogClose asChild>
                              <Button type="button" variant="secondary">
                                No
                              </Button>
                            </DialogClose>
                            <DialogClose asChild>
                              <Button
                                onClick={() => deleteChat(chat.key)}
                                type="button"
                              >
                                Yes
                              </Button>
                            </DialogClose>
                          </div>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
        <HoverCard>
          <HoverCardTrigger asChild>
            <SheetClose asChild>
              <Button
                className="absolute top-5 lg:right-[-5rem] right-[-4.5rem]"
                onClick={handleCloseSidebar}
              >
                <X />
              </Button>
            </SheetClose>
          </HoverCardTrigger>
          <HoverCardContent>Close the Sidebar</HoverCardContent>
        </HoverCard>
      </SheetContent>
    </Sheet>
  );
};

export default ChatbotSidebar;
