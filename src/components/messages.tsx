import { MessageType } from "@/types/MessageType";
import parse from "html-react-parser";

export default function MessagesSection({
  messages,
}: {
  messages: MessageType[];
}) {
  return (
    <div className="grow h-full flex text-lg flex-col gap-2 overflow-y-scroll">
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
            } flex justify-end items-center rounded-lg p-2 w-fit max-w-4xl`}
          >
            <div className="whitespace-pre-wrap">{parse(message.content)}</div>
          </div>
        </div>
      ))}
    </div>
  );
}
