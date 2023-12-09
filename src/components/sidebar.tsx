"use client";
import { Menu, MessagesSquare, Plus, Trash, X } from "lucide-react";
import { useState, useEffect, useContext } from "react";
import { Button } from "./ui/button";
import { ChatIdContext } from "./chatid-provider";

const ChatbotSidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [chats, setChats] = useState<any>([]);
  const { chatId, setChatId } = useContext(ChatIdContext);
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

  const deleteChat = (id: string) => {
    setChats((prevChats: any) => {
      const updatedChats = prevChats.filter((chat: any) => chat.key !== id);
      localStorage.setItem("savedChats", JSON.stringify(updatedChats));
      return updatedChats;
    });
  };

  const changeChat = (id: string) => {
    setChatId(id);
  };

  useEffect(() => {
    let savedChats = localStorage.getItem("savedChats");
    if (savedChats) {
      console.log(savedChats);
      setChats(JSON.parse(savedChats));
    } else if (chats.length === 0) {
      let newChat = {
        key: crypto.randomUUID(),
        name: "New Chat",
      };
      setChats([newChat]);
      localStorage.setItem("savedChats", JSON.stringify([newChat]));
    }
    if (chats.length > 0 && !chatId) {
      setChatId(chats[0].key);
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
                <button key={chat.key} onClick={() => changeChat(chat.key)}>
                  <div className="flex items-center justify-between gap-2 rounded-lg bg-background px-6 py-4">
                    <div className="flex gap-3">
                      <MessagesSquare />
                      <span>{chat.name}</span>
                    </div>
                    <button
                      className="flex justify-end"
                      onClick={() => deleteChat(chat.key)}
                    >
                      <Trash />
                    </button>
                  </div>
                </button>
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
