import { MessageType } from "@/types/MessageType";
import parse from "html-react-parser";

export default function MessagesSection({
  messages,
}: {
  messages: MessageType[];
}) {
  return (
    <div className="w-full lg:w-[75vw] h-[75vh] flex flex-col gap-2 bg-foreground/10 lg:px-8 px-2 py-4 rounded-lg overflow-y-scroll">
      {messages.map((message) => (
        <div
          key={message.id}
          className={`${
            message.role === "assistant"
              ? "w-full flex justify-start"
              : "w-full flex justify-end"
          }`}
        >
          <div
            className={`${
              message.role === "assistant"
                ? "bg-background"
                : "text-white bg-primary"
            } flex justify-end items-center rounded-lg p-2 w-fit`}
          >
            <div className="whitespace-pre-wrap">{parse(message.content)}</div>
          </div>
        </div>
      ))}
    </div>
  );
}
