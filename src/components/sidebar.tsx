"use client";
import { Menu, MessagesSquare, Plus, Trash, X } from "lucide-react";
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

const ChatbotSidebar = () => {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [chats, setChats] = useState<any>([]);
  const { setChatId } = useContext(ChatIdContext);
  const handleOpenSidebar = () => setIsOpen(true);
  const handleCloseSidebar = () => setIsOpen(false);
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
    let savedChats = JSON.parse(localStorage.getItem("savedChats") || "[]");
    let chatId = pathname.replace("/", "");
    let chatIdExists = savedChats.some((chat) => chat.key === chatId);
    if (savedChats.length > 0) {
      setChats(savedChats);
      setChatId(chatId);
    } else {
      let newChat = {
        key: crypto.randomUUID(),
        name: "New Chat",
      };
      setChats([newChat]);
      localStorage.setItem("savedChats", JSON.stringify([newChat]));
      updateChatId(newChat.key);
    }
    if (chats.length > 0 && !chatIdExists) {
      updateChatId(chats[0].key);
    }
  }, [chats.length]);

  const renderSidebar = () => (
    <div
      className={`${
        !isOpen ? "left-[-30rem]" : "left-0 backdrop-blur-sm w-screen"
      } absolute top-0 transition-all duration-300 ease-in-out`}
    >
      <div className="relative h-screen w-80 lg:w-96 bg-secondary rounded-r-lg p-4">
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
              {chats.map((chat: any) => (
                <div
                  className="flex items-center justify-between gap-2 rounded-lg bg-background px-6 py-4"
                  key={chat.key}
                >
                  <a href={`/${chat.key}`}>
                    <div className="flex gap-3">
                      <MessagesSquare />
                      <span>{chat.name}</span>
                    </div>
                  </a>
                  <Dialog>
                    <DialogTrigger asChild>
                      <button className="flex justify-end">
                        <Trash />
                      </button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <h1>Do you want to delete the Chat?</h1>
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
              ))}
            </div>
          </>
        )}

        <Button
          className="absolute top-5 lg:right-[-5rem] right-[-4.5rem]"
          onClick={handleCloseSidebar}
        >
          <X />
        </Button>
      </div>
    </div>
  );

  return (
    <>
      {!isOpen && (
        <Button className={`absolute top-5 left-5`} onClick={handleOpenSidebar}>
          <Menu />
        </Button>
      )}
      {renderSidebar()}
    </>
  );
};

export default ChatbotSidebar;
